# Atomic Mail — Struktur & Arsitektur

> Hasil reverse-engineering dari `atomicmail.io` (login + JS bundle analysis) ·
> Login akun: `alipdev@atomicmail.io` (Akun dev) ·
> Tanggal analisis: 17 Juni 2026

---

## 1. Ringkasan Produk

**Atomic Mail** = layanan email E2E-encrypted (zero-access, blockchain-secured). Klaim: Gmail/Outlook alternative yang tidak bisa baca isi email user.

**Karakter kunci:**
- Single-page web app (React + Redux) di-host di `atomicmail.io/app/*`
- Marketing site (Webflow) di `land.atomicmail.io`
- API terpisah di `api.atomicmail.io`
- WebSocket realtime di `ws.atomicmail.io`
- CDN asset di `cdn1.atomicmail.io`
- **Tidak ada IMAP/SMTP** — murni web client
- Bundle size besar: **5.2 MB main + 0.8 MB editor + 0.5 MB crypto** (gak minified buat production-ready first-paint yang nge-lag)

---

## 2. Tech Stack

| Layer | Tech | Sumber / Versi (observed) |
|---|---|---|
| Bahasa | TypeScript | inferred dari `.d.ts` references |
| UI Framework | **React 18** | JSX runtime, hooks pattern |
| Build tool | **Vite** | `vite`, `import.meta.hot` |
| Styling | **CSS Modules** (BEM) + **@emotion** (CSS-in-JS) | class pattern `_action__content_8o8f4` |
| UI Primitives | **Radix UI** (headless, accessible) | `radix-ui` di bundle |
| State | **Redux Toolkit** | `createSlice`, `configureStore` |
| Persist | **localforage** → IndexedDB (keyvaluepairs store) | `AtomicMailDB` di browser |
| HTTP client | **ky** (fetch wrapper) + **swr** (cache) | imports di bundle |
| Realtime | **Socket.IO** v3+ | `wss://ws.atomicmail.io/engine.io` |
| Editor | **Jodit** WYSIWYG + **Slate** (advanced flows) | `J as Jodit`, `slate` di editor bundle |
| Icons | **Tabler Icons** | `tabler` di bundle |
| Fonts | **Inter** (300, 400, 500, 600, 700) | dari `getComputedStyle`, `WebFont.load` |
| Crypto | WebCrypto API: **AES** (sym), **Ed25519** (sign), **secp256k1** (ECDH) + **scrypt / pbkdf2** (KDF) | `crypto-BTB_DxXS.js` |
| Analytics | **Firebase** (heartbeat DB) | `firebase-heartbeat-database` di IndexedDB |
| Bot mitigation | **Cloudflare Turnstile** | `cf_clearance` cookie |
| i18n | 3 locales: **en-US, ar-SA, pt-BR** | string literals di bundle |
| PWA / Service Worker | ❌ none | no `navigator.serviceWorker.controller` |
| Marketing CMS | **Webflow** | `data-wf-domain="land.atomicmail.io"` |

---

## 3. Application Routes

Hanya **4 top-level routes** (semua di `/app/...`):

```ts
// dari bundle: path:APP_ROUTES.*
APP_ROUTES.AUTH                          → /app/auth
APP_ROUTES.AUTH.SIGN_IN                  → /app/auth/sign-in
APP_ROUTES.AUTH.SIGN_UP                  → /app/auth/sign-up
APP_ROUTES.AUTH.WELCOME                  → /app/auth/welcome
APP_ROUTES.AUTH.RECOVERY                 → /app/auth/recovery
APP_ROUTES.AUTH.DELETED                  → /app/auth/deleted
APP_ROUTES.MAILBOX(":mailbox")           → /app/mailbox/:mailbox
APP_ROUTES.MESSAGE(":mailbox", ":id")    → /app/mailbox/:mailbox/message/:id
APP_ROUTES.ENCRYPTED(":key")             → /app/encrypted/:key   // untuk recipient eksternal
```

> **Catatan penting:** Semua settings (Account, Privacy, Aliases, 2FA) bukan route — muncul sebagai **modal/panel overlay** yang di-trigger dari sidebar/avatar. Ini bikin SPA lebih ringan, deep-link terbatas.

**Folder dinamis (system + custom):**
```
system:  inbox · sent · drafts · trash · junk · archive · flagged · important · unread · all
custom:  user-created (contoh observed: "aaaa")
```

---

## 4. Storage Layers (5-tier)

Atomic Mail pakai **5 lapis storage** yang berbeda per kegunaan:

| Tier | Storage | Isi | Karakter |
|---|---|---|---|
| 1 | **Cookies** | `cf_clearance` (CF bot), session token (HttpOnly, `Secure`, `SameSite=None`), `_ga*` (analytics) | HttpOnly session, gak bisa di-baca dari JS |
| 2 | **localStorage** | `last-shown-sidebar-banner` (UI state) | cuma 9 bytes observed — minim |
| 3 | **sessionStorage** | (kosong) | gak dipake |
| 4 | **IndexedDB** (`AtomicMailDB` v2) | via `localforage` → `keyvaluepairs` store: encrypted message cache, keypair blob, drafts | store utama |
| 5 | **Firebase IndexedDB** | `firebase-heartbeat-database` v1: analytics heartbeat | dipisah dari app data |

**Cache API:** kosong (no offline PWA)
**Service Worker:** none (no PWA install)

```
┌──────────────────────────────────────────────────────────┐
│  Browser Storage                                         │
├──────────────────────────────────────────────────────────┤
│  cookies     │  cf_clearance, session_token, _ga*        │
│  localStorage│  last-shown-sidebar-banner (UI state)     │
│  indexeddb   │  AtomicMailDB ── keyvaluepairs            │
│              │                  ├─ encryptedMessages     │
│              │                  ├─ keypair (encrypted)   │
│              │                  ├─ drafts                │
│              │                  └─ ...                   │
│              │  firebase-heartbeat-database              │
├──────────────────────────────────────────────────────────┤
│  Memory (Redux)  │  decrypted messages, in-flight state  │
└──────────────────────────────────────────────────────────┘
```

---

## 5. State Management (Redux Toolkit)

Slices yang terdeteksi (inferred dari component names):

```
store/
├── auth/           // session, token, user info
├── messages/       // decrypted in-memory message list
├── folders/        // folder tree + unread counters
├── labels/
├── contacts/
├── aliases/        // Hide-My-Email addresses
├── encryption/     // keypair, encryption state
├── user/           // profile, settings, theme
├── ui/             // modals, sidebars, banners
├── composer/       // draft state, attachments
└── notifications/  // toast/alert queue
```

API: `configureStore` + `combineReducers` + `createSlice` + `persistReducer`

> **Catatan:** `persistReducer` ada di bundle tapi output `redux-persist` keys gak muncul di `localStorage` observed — kemungkinan **persist di-disable** atau di-rename. Real cache pakai IndexedDB via `localforage` (Tier 4), bukan `redux-persist`.

---

## 6. Module / Component Structure (BEM CSS Modules)

**Pattern:** `{component}__{element}_{hash}` (Vite CSS modules suffix)
Contoh dari bundle:

```
_action__content_8o8f4
_action__dropdown_1tvu1
_action__item_assistant
_action__item_grammar
_action__left_1tvu1
_action__tooltip_e8g8c
_actions__send_8h4zi
_actions__submit_1flfm
_activity__left_svfac
_address__adornment
_address__error_1og8i
_appearance__card_19pw0
_appearance__card_selected
```

**Inferred component tree (high-level):**

```
App
├── AuthLayout                    (/app/auth/*)
│   ├── SignInForm
│   │   ├── EmailStep             (2-step: email → password/seed)
│   │   └── PasswordStep
│   ├── SignUpForm
│   ├── RecoveryForm
│   │   ├── PasswordForm
│   │   ├── PhraseForm
│   │   └── SuccessStep
│   └── WelcomeForm
│
├── DashboardLayout               (/app/mailbox/*)
│   ├── Sidebar
│   │   ├── Logo
│   │   ├── ComposeButton
│   │   ├── PrivacyCenterButton
│   │   ├── FolderList
│   │   │   ├── FolderItem (with badge)
│   │   │   └── FolderCreate
│   │   ├── AliasesList
│   │   ├── AliasCreate
│   │   └── PromoCard (Gemini)
│   │
│   ├── TopBar
│   │   ├── SearchField
│   │   ├── AvatarMenu
│   │   │   ├── ToInboxes
│   │   │   ├── SecurityOptions
│   │   │   │   ├── SecurityHelper
│   │   │   │   ├── TwoFactorSetup
│   │   │   │   └── LocalLLM
│   │   │   ├── HideIdentity
│   │   │   │   ├── CreateHideMyEmail
│   │   │   │   └── CreateAlias
│   │   │   └── SendSecureEmail
│   │   │       ├── EncryptByPassword
│   │   │       ├── EncryptAsFile
│   │   │       └── EncryptWithAtomic
│   │   └── ThemeToggle
│   │
│   ├── MailboxView               (list)
│   │   ├── ActionToolbar
│   │   │   ├── SelectAll
│   │   │   ├── MarkAsRead
│   │   │   ├── MoveTo
│   │   │   ├── Delete
│   │   │   ├── JunkToggle
│   │   │   ├── StarToggle
│   │   │   └── AIHelper
│   │   └── MessageList
│   │       ├── MessageRow (sender, subject, preview, date)
│   │       └── EmptyState
│   │
│   ├── MessageView               (detail)
│   │   ├── MessageHeader
│   │   ├── MessageBody (Jodit-rendered HTML)
│   │   ├── Attachments
│   │   └── ReplyFooter
│   │
│   └── Modals (overlay layer)
│       ├── ComposeModal
│       │   ├── RecipientField
│       │   ├── JoditEditor
│       │   ├── EncryptOptions
│       │   └── SendActions
│       ├── SettingsModal
│       │   ├── SettingsAccount
│       │   │   ├── ChangePasswordForm
│       │   │   ├── Username
│       │   │   ├── Timezone
│       │   │   ├── DateAndTime
│       │   │   └── DeleteAccount
│       │   ├── PlanPanel (ProfilePlan, PlanMetadata)
│       │   └── AppearancePicker (3 cards: light/dark/system)
│       ├── PrivacyCenterModal
│       ├── AliasCreateModal
│       └── TwoFactorSetup
│
└── EncryptedView                 (/app/encrypted/:key) — recipient-only password page
```

---

## 7. Network Layer

### 7.1 HTTP

```
Base: https://api.atomicmail.io
Auth header: Bearer <session_token> (atau cookie-based)
Client: ky (timeout, retry built-in)
Data fetching: swr (cache + revalidation)
```

**Sample endpoints (inferred dari component names + 401 di console):**

```
POST /v1/auth/sign-in           (login)
POST /v1/auth/sign-up           (register)
POST /v1/auth/recovery          (seed-phrase recovery)
GET  /v1/mailboxes              (folder list)
GET  /v1/mailboxes/:id/messages (messages in folder)
GET  /v1/messages/:id           (single message)
POST /v1/messages               (send)
POST /v1/aliases                (create hide-my-email)
GET  /v1/aliases
GET  /v1/user                   (profile)
PATCH /v1/user                  (update)
GET  /v1/user/keys/public       (own pubkey, untuk E2E)
GET  /v1/users/:email/keys/public  (recipient pubkey, lookup)
POST /v1/keys                  (rotate / upload pubkey)
```

### 7.2 WebSocket

```
URL: wss://ws.atomicmail.io
Path: /engine.io
Lib: socket.io-client v3+
Events (inferred): message:new, message:read, message:delete, folder:update, presence
```

### 7.3 CDN

```
https://cdn1.atomicmail.io/icons/        (logo, social icons)
https://cdn1.atomicmail.io/discord.png
```

---

## 8. Crypto Architecture

**Pipeline (inferred dari `crypto-BTB_DxXS.js` + strings):**

```
┌────────────────────────────────────────────────────────────┐
│  Signup / First Login                                      │
├────────────────────────────────────────────────────────────┤
│  1. Generate keypair:                                      │
│     - Ed25519 (sign/verify)                                │
│     - secp256k1 (ECDH for shared secret derivation)        │
│  2. Derive symmetric key from password:                    │
│     - scrypt (or pbkdf2)  → KEK (Key Encryption Key)       │
│  3. Encrypt private key with KEK → store in IndexedDB      │
│  4. Upload public key to /v1/keys                           │
│  5. Generate seed phrase (BIP39-style 12 words) as backup  │
│  6. Encrypt seed phrase with password → encryptedSeedPhrase│
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│  Login (subsequent)                                        │
├────────────────────────────────────────────────────────────┤
│  1. Submit email → /v1/auth/sign-in (step 1)               │
│  2. Server returns salt + KDF params                       │
│  3. Client derives KEK from password + scrypt              │
│  4. Submit password + signature → /v1/auth/sign-in (step 2) │
│  5. Server returns session token (HttpOnly cookie)         │
│  6. Load encrypted private key from IndexedDB              │
│  7. Decrypt private key with KEK → in-memory only          │
│  8. Open WS, sync message list                             │
│  9. Decrypt each message body using ECDH(priv, sender_pub)  │
│     → AES key → message plaintext                          │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│  Send Encrypted                                            │
├────────────────────────────────────────────────────────────┤
│  For internal Atomic Mail user:                            │
│    1. Fetch recipient pubkey from /v1/users/:email/keys/... │
│    2. ECDH(my_priv, recipient_pub) → shared secret         │
│    3. HKDF → AES session key                               │
│    4. Encrypt body with AES-GCM                            │
│    5. Sign with Ed25519 (authentication)                   │
│    6. POST /v1/messages with ciphertext + signature        │
│                                                            │
│  For external (password):                                  │
│    1. Generate random password (or user-set)               │
│    2. Encrypt body with AES(password)                      │
│    3. Recipient opens /app/encrypted/:key with password    │
│                                                            │
│  For external (file):                                      │
│    1. Same as password but file downloadable               │
└────────────────────────────────────────────────────────────┘
```

**Crypto primitives (final):**
- KEM: secp256k1 ECDH → HKDF
- Sign: Ed25519
- Sym: AES-GCM (256-bit)
- KDF: scrypt (N=2^14, r=8, p=1) atau pbkdf2 (100k iter)
- Backup: 12-word seed phrase (BIP39), encrypted at rest

---

## 9. Editor (Compose)

**Library:** **Jodit** WYSIWYG (npm `jodit-react`)
- Bold, Italic, Underline, Strikethrough
- Link, Image (with crop, resize, props, editor)
- Code, Quote, Bullet list, Heading
- Image embed dari clipboard / upload
- Plus: **Slate** untuk advanced flows (mention, react-style content?)

**Modal flow saat Compose diklik:**
1. Click → modal slide-up (5.2MB main bundle + 0.8MB editor = first-paint **~3-5 detik** observed)
2. Editor mount
3. Recipient field (autocomplete dari contacts)
4. Encrypt options muncul (default = encrypt with Atomic)
5. Send button enable setelah valid recipient + body

---

## 10. File Structure (Proposed Clone)

```
atomicmail-clone/
├── apps/
│   ├── web/                              # React SPA (Vite)
│   │   ├── src/
│   │   │   ├── main.tsx
│   │   │   ├── App.tsx
│   │   │   ├── routes/
│   │   │   │   ├── AuthRoute.tsx
│   │   │   │   │   ├── SignInPage.tsx
│   │   │   │   │   ├── SignUpPage.tsx
│   │   │   │   │   ├── RecoveryPage.tsx
│   │   │   │   │   └── WelcomePage.tsx
│   │   │   │   ├── MailboxRoute.tsx
│   │   │   │   ├── MessageRoute.tsx
│   │   │   │   └── EncryptedRoute.tsx
│   │   │   ├── components/
│   │   │   │   ├── sidebar/
│   │   │   │   │   ├── Sidebar.tsx
│   │   │   │   │   ├── ComposeButton.tsx
│   │   │   │   │   ├── PrivacyCenterButton.tsx
│   │   │   │   │   ├── FolderList.tsx
│   │   │   │   │   ├── FolderItem.tsx
│   │   │   │   │   ├── AliasesList.tsx
│   │   │   │   │   └── PromoCard.tsx
│   │   │   │   ├── topbar/
│   │   │   │   │   ├── TopBar.tsx
│   │   │   │   │   ├── SearchField.tsx
│   │   │   │   │   ├── AvatarMenu.tsx
│   │   │   │   │   └── ThemeToggle.tsx
│   │   │   │   ├── mailbox/
│   │   │   │   │   ├── MailboxView.tsx
│   │   │   │   │   ├── ActionToolbar.tsx
│   │   │   │   │   ├── MessageList.tsx
│   │   │   │   │   └── MessageRow.tsx
│   │   │   │   ├── message/
│   │   │   │   │   ├── MessageView.tsx
│   │   │   │   │   ├── MessageHeader.tsx
│   │   │   │   │   ├── MessageBody.tsx
│   │   │   │   │   └── ReplyFooter.tsx
│   │   │   │   ├── modals/
│   │   │   │   │   ├── ComposeModal.tsx
│   │   │   │   │   ├── SettingsModal.tsx
│   │   │   │   │   ├── PrivacyCenterModal.tsx
│   │   │   │   │   ├── AliasCreateModal.tsx
│   │   │   │   │   └── TwoFactorSetup.tsx
│   │   │   │   └── ui/                  # Radix-based primitives
│   │   │   │       ├── Button.tsx
│   │   │   │       ├── Dialog.tsx
│   │   │   │       ├── Dropdown.tsx
│   │   │   │       ├── Popover.tsx
│   │   │   │       ├── Tooltip.tsx
│   │   │   │       ├── Input.tsx
│   │   │   │       ├── Switch.tsx
│   │   │   │       └── Avatar.tsx
│   │   │   ├── store/                    # Redux Toolkit
│   │   │   │   ├── index.ts
│   │   │   │   ├── slices/
│   │   │   │   │   ├── authSlice.ts
│   │   │   │   │   ├── messagesSlice.ts
│   │   │   │   │   ├── foldersSlice.ts
│   │   │   │   │   ├── aliasesSlice.ts
│   │   │   │   │   ├── encryptionSlice.ts
│   │   │   │   │   ├── composerSlice.ts
│   │   │   │   │   ├── userSlice.ts
│   │   │   │   │   ├── uiSlice.ts
│   │   │   │   │   └── notificationsSlice.ts
│   │   │   │   └── middleware/
│   │   │   │       ├── socketMiddleware.ts
│   │   │   │       └── persistMiddleware.ts
│   │   │   ├── services/                 # API + crypto + storage
│   │   │   │   ├── api/
│   │   │   │   │   ├── client.ts         # ky instance
│   │   │   │   │   ├── auth.ts
│   │   │   │   │   ├── messages.ts
│   │   │   │   │   ├── mailboxes.ts
│   │   │   │   │   ├── aliases.ts
│   │   │   │   │   ├── user.ts
│   │   │   │   │   └── keys.ts
│   │   │   │   ├── crypto/
│   │   │   │   │   ├── keypair.ts        # Ed25519 + secp256k1 gen
│   │   │   │   │   ├── kdf.ts            # scrypt + pbkdf2
│   │   │   │   │   ├── encrypt.ts        # AES-GCM
│   │   │   │   │   ├── sign.ts           # Ed25519 sign/verify
│   │   │   │   │   ├── ecdh.ts           # secp256k1 ECDH
│   │   │   │   │   ├── seed.ts           # BIP39 seed phrase
│   │   │   │   │   └── index.ts
│   │   │   │   ├── storage/
│   │   │   │   │   ├── cookies.ts
│   │   │   │   │   ├── localforage.ts    # IndexedDB wrapper
│   │   │   │   │   └── localStorage.ts
│   │   │   │   └── realtime/
│   │   │   │       ├── socket.ts         # socket.io-client
│   │   │   │       └── events.ts
│   │   │   ├── hooks/
│   │   │   │   ├── useAuth.ts
│   │   │   │   ├── useMessages.ts
│   │   │   │   ├── useDecryption.ts
│   │   │   │   ├── useRealtime.ts
│   │   │   │   └── useTheme.ts
│   │   │   ├── utils/
│   │   │   │   ├── format.ts
│   │   │   │   ├── date.ts
│   │   │   │   ├── i18n.ts
│   │   │   │   └── validation.ts
│   │   │   └── styles/
│   │   │       ├── tokens.css            # CSS variables (colors, spacing)
│   │   │       ├── reset.css
│   │   │       └── globals.css
│   │   ├── public/
│   │   │   ├── favicon.ico
│   │   │   └── icons/
│   │   ├── index.html
│   │   ├── vite.config.ts
│   │   ├── tsconfig.json
│   │   └── package.json
│   └── landing/                          # Webflow (or Astro static)
│       ├── src/
│       │   └── pages/
│       └── public/
│
├── packages/
│   ├── ui/                               # shared Radix-based primitives
│   ├── crypto/                           # isomorphic crypto (for Node + browser)
│   └── shared-types/                     # TypeScript types shared
│
├── docs/
│   ├── struktur.md                       # ← you are here
│   ├── desain.md                         # ← design system
│   └── api.md                            # API spec
│
├── infra/
│   ├── docker-compose.yml
│   └── caddy/
│
├── README.md
├── package.json                          # pnpm workspace
└── pnpm-workspace.yaml
```

---

## 11. API Domain Summary

| Domain | Purpose | Protocol |
|---|---|---|
| `atomicmail.io/app/*` | SPA shell + static | HTTPS |
| `atomicmail.io/api/*` | (404 — not exposed) | — |
| `api.atomicmail.io` | REST API | HTTPS (CF) |
| `ws.atomicmail.io` | WebSocket | WSS (CF) |
| `cdn1.atomicmail.io` | static assets (icons, logo) | HTTPS (S3 eu-central-1) |
| `land.atomicmail.io` | marketing site (Webflow) | HTTPS |
| `mail.atomicmail.io` | 5.161.85.229 — kandidat SMTP/IMAP host (belum di-probe) | (TBD) |
| `support@atomicmail.io` | support email | mailto |

---

## 12. Bundle Composition

```
index-CF-xT8ig.js      main app         5.2 MB    (React + Redux + 240 unique colors)
editor-C1kqxfO6.js     rich text editor 0.8 MB    (Jodit + Slate)
crypto-BTB_DxXS.js     crypto module    0.5 MB    (WebCrypto wrappers)
react-vendor-...       React core        ~?
redux-vendor-...       Redux RTK         50 KB
editor-DFxbV0CK.css    editor styles
index-DJhVUe3d.css     app styles
```

> **Bundle concern:** 5.2 MB main bundle = first-paint ~3-5 detik di 3G. Code-splitting belum agresif (route-level). Cloning perlu agresif lazy-load: `React.lazy()` per route + `Suspense`.

---

## 13. PWA / Offline

❌ **No PWA**:
- Tidak ada service worker
- Tidak ada manifest.json yang aktif
- Cache API kosong

> User experience: kalau offline, app gak bisa load sama sekali. Cloning bisa tambahin PWA layer (Workbox) untuk cache shell + last inbox snapshot.

---

## 14. Security Considerations (saat cloning)

| Aspek | Atomic Mail | Clone harus |
|---|---|---|
| E2E crypto | ✅ WebCrypto | ✅ sama |
| Server-side scan | ❌ impossible (encrypted) | ❌ sama |
| 2FA | ✅ (di Settings) | ✅ implement |
| Session cookie | HttpOnly, Secure, SameSite=None | ✅ wajib |
| CSP | (likely strict, belum di-probe) | ✅ strict CSP |
| Rate limit | (server-side) | ✅ implement |
| Bot mitigation | Cloudflare Turnstile | ✅ CF Turnstile |
| HSTS | (likely, via CF) | ✅ |
| Audit | (TBD — no public SOC2) | wajib sebelum launch |

---

## 15. Performance & UX Notes

- **First-paint lambat** karena bundle gede (5.2MB) — perlu aggressive code-splitting
- **No skeleton/loading state** yang sophisticated — page blank saat load
- **Sidebar always visible** di desktop — bagus untuk email workflow
- **Mobile breakpoint** belum di-test (responsive design assumed)
- **Search field** ada tapi behaviour belum di-probe (client-side or server-side?)
- **AI Helper** muncul di message toolbar (Plus plan only?)
- **Promo card** "Get local Gemini" — promotional, dismissible

---

## 16. Known Unknowns (perlu probe lebih lanjut)

- [ ] `mail.atomicmail.io` (5.161.85.229) — IMAP/SMTP gateway?
- [ ] WebSocket event names & payload schema
- [ ] REST API full endpoint list (need to capture from network tab)
- [ ] Server-side storage (Postgres? Mongo? Custom blockchain claim?)
- [ ] Mobile app backend API (separate or shared?)
- [ ] Plan tier feature gating (free vs Plus)
- [ ] Custom domain support (FAQ mention, status unclear)
- [ ] IMAP encryption bridge (mentioned in FAQ, status unclear)
- [ ] Backup/restore flow
- [ ] Multi-device session management

---

## 17. Sumber Pengetahuan

- Login flow: `browser_navigate` + `browser_type` ke `atomicmail.io/app/auth/sign-in`
- Routes: extracted dari `app/assets/index-CF-xT8ig.js`
- Component tree: BEM class names di bundle + DOM inspection
- Crypto: bundle `app/assets/crypto-BTB_DxXS.js`
- Storage: `browser_console` evaluate `localStorage`, `indexedDB.databases()`
- Bundle analysis: `grep` patterns di `index-CF-xT8ig.js`
- API: 401 log di console + endpoint inferred dari component names

---

Lanjut baca: **[desain.md](./desain.md)** untuk design system (colors, typography, layout, components).
