// Demo seed data — used when VITE_DEMO=true to render the dashboard
// without needing real atomicmail.io auth. Same Message shape as the
// production API so all UI logic works identically.

import type {
  Message,
  Folder,
  User,
  Alias,
  Attachment,
} from "@ui/shared-types";

const NO_ATTACHMENTS: Attachment[] = [];

const baseDate = (offsetMin: number) =>
  new Date(Date.now() - offsetMin * 60_000).toISOString();

/* ─── User ─── */

export const DEMO_USER: User = {
  id: "usr_demo_alip",
  email: "alip@atomicmail-clone.demo",
  displayName: "Alip",
  plan: "plus",
  publicKey: "MCowBQYDK2VwAyEAR9Y5K0o9bzG8c5Xm+KQ4VuJqq2lY4CkQkg==",
  signPublicKey: "MCowBQYDK2VwAyEAGb3zQa9WjBJSP5V8M+QYkG3p1qRkc7P4YkQ==",
  createdAt: "2026-01-15T08:00:00.000Z",
  timezone: "Asia/Jakarta",
  twoFactorEnabled: true,
  language: "en-US",
  theme: "system",
};

/* ─── Folders ─── */

export const DEMO_FOLDERS: Folder[] = [
  { id: "inbox", name: "Inbox", kind: "system", unreadCount: 7, parentId: null },
  { id: "sent", name: "Sent", kind: "system", unreadCount: 0, parentId: null },
  { id: "drafts", name: "Drafts", kind: "system", unreadCount: 2, parentId: null },
  { id: "flagged", name: "Flagged", kind: "system", unreadCount: 1, parentId: null },
  { id: "important", name: "Important", kind: "system", unreadCount: 3, parentId: null },
  { id: "unread", name: "Unread", kind: "system", unreadCount: 7, parentId: null },
  { id: "junk", name: "Junk", kind: "system", unreadCount: 4, parentId: null },
  { id: "trash", name: "Trash", kind: "system", unreadCount: 0, parentId: null },
  { id: "archive", name: "Archive", kind: "system", unreadCount: 0, parentId: null },
  { id: "all", name: "All mail", kind: "system", unreadCount: 0, parentId: null },
  // custom folders
  {
    id: "fld_work",
    name: "Work",
    kind: "custom",
    unreadCount: 2,
    parentId: null,
  },
  {
    id: "fld_invoices",
    name: "Invoices",
    kind: "custom",
    unreadCount: 1,
    parentId: null,
  },
];

/* ─── Inbox messages (12) ─── */

export const DEMO_INBOX: Message[] = [
  {
    id: "msg_001",
    from: "security@atomicmail.io",
    fromName: "Security Atomic Mail",
    to: ["alip@atomicmail-clone.demo"],
    subject: "Did you log in from a new device?",
    preview:
      "We noticed a sign-in to your account from a new device (Jakarta, ID). If this was you, no action is needed. If not, secure your account…",
    receivedAt: baseDate(8),
    readAt: null,
    starred: true,
    encrypted: true,
    encryptionMethod: "atomic",
    attachments: NO_ATTACHMENTS,
    threadId: "thr_001",
    folder: "inbox",
  },
  {
    id: "msg_002",
    from: "community@atomicmail.io",
    fromName: "Community Atomic Mail",
    to: ["alip@atomicmail-clone.demo"],
    subject: "Join Atomic Mail Community on Discord! 💬",
    preview:
      "Hey there! We've just opened our official Discord server — a place to discuss features, share feedback, and meet other privacy-minded users…",
    receivedAt: baseDate(64),
    readAt: baseDate(60),
    starred: false,
    encrypted: false,
    encryptionMethod: null,
    attachments: NO_ATTACHMENTS,
    threadId: "thr_002",
    folder: "inbox",
  },
  {
    id: "msg_003",
    from: "product@atomicmail.io",
    fromName: "Product Atomic Mail",
    to: ["alip@atomicmail-clone.demo"],
    subject: "Welcome to Atomic Mail! 🚀",
    preview:
      "Your account is ready. Here are 3 things you can do right now: 1) Set up 2FA in Privacy Center  2) Create your first Hide-My-Email alias  3) Try encrypted email…",
    receivedAt: baseDate(180),
    readAt: baseDate(170),
    starred: false,
    encrypted: false,
    encryptionMethod: null,
    attachments: NO_ATTACHMENTS,
    threadId: "thr_003",
    folder: "inbox",
  },
  {
    id: "msg_004",
    from: "billing@stripe.com",
    fromName: "Stripe",
    to: ["alip@atomicmail-clone.demo"],
    subject: "Your invoice for June 2026 is ready",
    preview:
      "Invoice INV-2026-06-0042 for $19.00 is now available. View PDF, update payment method, or download for your records…",
    receivedAt: baseDate(420),
    readAt: baseDate(380),
    starred: false,
    encrypted: true,
    encryptionMethod: "password",
    attachments: [
      {
        id: "att_001",
        name: "invoice-2026-06.pdf",
        size: 48_213,
        type: "application/pdf",
        encrypted: true,
      },
    ],
    threadId: "thr_004",
    folder: "inbox",
  },
  {
    id: "msg_005",
    from: "github@noreply.github.com",
    fromName: "GitHub",
    to: ["alip@atomicmail-clone.demo"],
    subject: "[atomicmail-clone] PR #14 ready for review",
    preview:
      "coder-2 opened pull request feat/inbox-demo: adds VITE_DEMO flag to render dashboard with seed data. 3 files changed, 142 insertions(+)…",
    receivedAt: baseDate(720),
    readAt: baseDate(700),
    starred: true,
    encrypted: false,
    encryptionMethod: null,
    attachments: NO_ATTACHMENTS,
    threadId: "thr_005",
    folder: "inbox",
  },
  {
    id: "msg_006",
    from: "newsletter@figma.com",
    fromName: "Figma Weekly",
    to: ["alip@atomicmail-clone.demo"],
    subject: "5 fresh design systems to study this week",
    preview:
      "This week we're featuring Linear, Vercel, Stripe, Raycast, and Cron. All open source, all beautiful. Plus a deep-dive on design tokens…",
    receivedAt: baseDate(1_440),
    readAt: null,
    starred: false,
    encrypted: false,
    encryptionMethod: null,
    attachments: NO_ATTACHMENTS,
    threadId: "thr_006",
    folder: "inbox",
  },
  {
    id: "msg_007",
    from: "notifications@docker.com",
    fromName: "Docker Hub",
    to: ["alip@atomicmail-clone.demo"],
    subject: "Your image atomicmail-clone:latest was built",
    preview:
      "Build completed in 11.27s. Image size: 76.4 MB. Pushed to registry. View build logs and security scan results in the dashboard…",
    receivedAt: baseDate(2_160),
    readAt: null,
    starred: false,
    encrypted: false,
    encryptionMethod: null,
    attachments: NO_ATTACHMENTS,
    threadId: "thr_007",
    folder: "inbox",
  },
  {
    id: "msg_008",
    from: "team@vercel.com",
    fromName: "Vercel",
    to: ["alip@atomicmail-clone.demo"],
    subject: "Deployment successful: atomicmail-clone.vercel.app",
    preview:
      "Your deployment completed in 23s. Build size: 280 KB. All 12 routes responding 200. View deployment details and metrics…",
    receivedAt: baseDate(2_880),
    readAt: null,
    starred: false,
    encrypted: false,
    encryptionMethod: null,
    attachments: NO_ATTACHMENTS,
    threadId: "thr_008",
    folder: "inbox",
  },
  {
    id: "msg_009",
    from: "Mimi Amilia <mimi@vai.id>",
    fromName: "Mimi Amilia",
    to: ["alip@atomicmail-clone.demo"],
    subject: "Re: VAI website — invoice attached",
    preview:
      "Thanks for the quick turnaround! Invoice looks good. One small note — can you add the Cormorant Garamond font to the typography spec? Cheers…",
    receivedAt: baseDate(4_320),
    readAt: baseDate(4_200),
    starred: true,
    encrypted: true,
    encryptionMethod: "password",
    attachments: [
      {
        id: "att_002",
        name: "vai-invoice-jun.pdf",
        size: 31_204,
        type: "application/pdf",
        encrypted: true,
      },
    ],
    threadId: "thr_009",
    folder: "inbox",
  },
  {
    id: "msg_010",
    from: "alerts@uptimerobot.com",
    fromName: "UptimeRobot",
    to: ["alip@atomicmail-clone.demo"],
    subject: "✅ All monitors UP — premiacc.168-144-37-19.sslip.io",
    preview:
      "All 5 monitors are responding normally. Uptime this month: 99.97%. Average response time: 187ms. View full report…",
    receivedAt: baseDate(5_760),
    readAt: baseDate(5_700),
    starred: false,
    encrypted: false,
    encryptionMethod: null,
    attachments: NO_ATTACHMENTS,
    threadId: "thr_010",
    folder: "inbox",
  },
  {
    id: "msg_011",
    from: "noreply@midtrans.com",
    fromName: "Midtrans",
    to: ["alip@atomicmail-clone.demo"],
    subject: "Payment received — Order #ORD-2026-06-0042",
    preview:
      "We've successfully received your payment of Rp 250.000 for order ORD-2026-06-0042. Customer: via-public@premiacc.test. Settlement in 1-2 business days…",
    receivedAt: baseDate(7_200),
    readAt: null,
    starred: false,
    encrypted: false,
    encryptionMethod: null,
    attachments: NO_ATTACHMENTS,
    threadId: "thr_011",
    folder: "inbox",
  },
  {
    id: "msg_012",
    from: "ronaldo@premiacc.test",
    fromName: "Ronaldo",
    to: ["alip@atomicmail-clone.demo"],
    subject: "Re: stok ChatGPT Plus ready?",
    preview:
      "Bro gue mau 3 akun ChatGPT Plus, bisa ready hari ini? Bayar pake BCA. Kalau bisa gue transfer sekarang…",
    receivedAt: baseDate(8_640),
    readAt: baseDate(8_600),
    starred: false,
    encrypted: false,
    encryptionMethod: null,
    attachments: NO_ATTACHMENTS,
    threadId: "thr_012",
    folder: "inbox",
  },
];

/* ─── Sent folder ─── */

export const DEMO_SENT: Message[] = [
  {
    id: "msg_s01",
    from: "alip@atomicmail-clone.demo",
    fromName: "Alip",
    to: ["team@vai.id"],
    subject: "Re: VAI website redesign — Phase 2 done",
    preview:
      "Phase 2 is live. All 5 pages wired to real templates (home, blog, testimonial, contact, rates). Mockup at vai-mockup.168-144-37-19.sslip.io. Let me know if you want to tweak…",
    receivedAt: baseDate(180),
    readAt: baseDate(180),
    starred: false,
    encrypted: true,
    encryptionMethod: "atomic",
    attachments: NO_ATTACHMENTS,
    threadId: "thr_009",
    folder: "sent",
  },
  {
    id: "msg_s02",
    from: "alip@atomicmail-clone.demo",
    fromName: "Alip",
    to: ["ronaldo@premiacc.test"],
    subject: "Re: stok ChatGPT Plus ready?",
    preview:
      "Ready 3 akun, BCA a/n Alip, Rp 250k each. Kirim nominal pas ya biar auto-match. Invite link nyusul 5 menit abis transfer…",
    receivedAt: baseDate(8_400),
    readAt: baseDate(8_400),
    starred: false,
    encrypted: false,
    encryptionMethod: null,
    attachments: NO_ATTACHMENTS,
    threadId: "thr_012",
    folder: "sent",
  },
];

/* ─── Drafts ─── */

export const DEMO_DRAFTS: Message[] = [
  {
    id: "msg_d01",
    from: "alip@atomicmail-clone.demo",
    fromName: "Alip",
    to: ["investor@yc.com"],
    subject: "PremiAcc — seed round intro",
    preview:
      "Hi, I'm Alip — building PremiAcc, an Indonesian B2C marketplace for cheap premium AI subscriptions. We've done $X MRR over Y months with Z% margin…",
    receivedAt: baseDate(60),
    readAt: null,
    starred: false,
    encrypted: true,
    encryptionMethod: "password",
    attachments: [
      {
        id: "att_d01",
        name: "pitch-deck-q2.pdf",
        size: 1_204_881,
        type: "application/pdf",
        encrypted: true,
      },
    ],
    threadId: null,
    folder: "drafts",
  },
  {
    id: "msg_d02",
    from: "alip@atomicmail-clone.demo",
    fromName: "Alip",
    to: ["ops@digitalocean.com"],
    subject: "Upgrade droplet s-2vcpu-8gb → s-4vcpu-16gb",
    preview:
      "Hi DO team, please upgrade my droplet s-2vcpu-8gb-160gb-intel-sgp1-01 to s-4vcpu-16gb-320gb-intel-sgp1-01. Resize via control panel is fine, no downtime preferred…",
    receivedAt: baseDate(120),
    readAt: null,
    starred: false,
    encrypted: false,
    encryptionMethod: null,
    attachments: NO_ATTACHMENTS,
    threadId: null,
    folder: "drafts",
  },
];

/* ─── Junk ─── */

export const DEMO_JUNK: Message[] = [
  {
    id: "msg_j01",
    from: "lottery@winner-nigeria.tk",
    fromName: "INHERITANCE CLAIMS",
    to: ["alip@atomicmail-clone.demo"],
    subject: "🎉 CONGRATULATIONS — You won $4,500,000 USD 🎉",
    preview:
      "DEAR WINNER, Your email has been selected in our annual international lottery. Send your full name, address, bank details, and a processing fee of $250…",
    receivedAt: baseDate(1_200),
    readAt: null,
    starred: false,
    encrypted: false,
    encryptionMethod: null,
    attachments: NO_ATTACHMENTS,
    threadId: null,
    folder: "junk",
  },
  {
    id: "msg_j02",
    from: "no-reply@crypto-elon-airdrop.io",
    fromName: "ElonCoin Airdrop",
    to: ["alip@atomicmail-clone.demo"],
    subject: "Claim 5000 ELON — 24 hours left!",
    preview:
      "Limited airdrop! Connect your wallet now to claim 5000 ELON tokens (worth $899 USD). Hurry — only 47 spots left for your region…",
    receivedAt: baseDate(2_400),
    readAt: null,
    starred: false,
    encrypted: false,
    encryptionMethod: null,
    attachments: NO_ATTACHMENTS,
    threadId: null,
    folder: "junk",
  },
];

/* ─── Aliases ─── */

export const DEMO_ALIASES: Alias[] = [
  {
    id: "als_01",
    email: "alip.shop@atomicmail-clone.demo",
    createdAt: "2026-03-10T08:00:00.000Z",
    active: true,
    forwardTo: "alip@atomicmail-clone.demo",
    description: "Online shopping signups",
  },
  {
    id: "als_02",
    email: "alip.newsletter@atomicmail-clone.demo",
    createdAt: "2026-04-22T08:00:00.000Z",
    active: true,
    forwardTo: "alip@atomicmail-clone.demo",
    description: "Newsletter subscriptions",
  },
  {
    id: "als_03",
    email: "alip.discord@atomicmail-clone.demo",
    createdAt: "2026-05-01T08:00:00.000Z",
    active: true,
    forwardTo: "alip@atomicmail-clone.demo",
    description: "Discord registrations",
  },
  {
    id: "als_04",
    email: "alip.deleted@atomicmail-clone.demo",
    createdAt: "2026-02-14T08:00:00.000Z",
    active: false,
    forwardTo: "alip@atomicmail-clone.demo",
    description: "Deactivated 2026-03-01",
  },
];

/* ─── Route → data map ─── */

export const DEMO_MAILBOXES: Record<string, Message[]> = {
  inbox: DEMO_INBOX,
  sent: DEMO_SENT,
  drafts: DEMO_DRAFTS,
  junk: DEMO_JUNK,
  trash: [],
  archive: [],
  flagged: DEMO_INBOX.filter((m) => m.starred),
  important: DEMO_INBOX.filter((_, i) => [0, 1, 3].includes(i)),
  unread: DEMO_INBOX.filter((m) => m.readAt === null),
  all: DEMO_INBOX,
  fld_work: DEMO_INBOX.filter((m) =>
    ["GitHub", "Docker Hub", "Vercel", "Stripe", "Midtrans"].some((s) =>
      (m.fromName ?? "").includes(s)
    )
  ),
  fld_invoices: DEMO_INBOX.filter((m) =>
    m.attachments.some((a: Attachment) => a.name.includes("invoice"))
  ),
};

/* ─── Single message lookup (for /message/:id) ─── */

export function findDemoMessage(id: string): Message | undefined {
  for (const list of Object.values(DEMO_MAILBOXES)) {
    const m = list.find((x) => x.id === id);
    if (m) return m;
  }
  return undefined;
}
