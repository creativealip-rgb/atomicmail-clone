export type ID = string;
export type EmailAddress = string;
export type ISO8601 = string;

/* ─── User & Plan ─── */

export type Plan = "free" | "plus";

export interface User {
  id: ID;
  email: EmailAddress;
  displayName: string | null;
  plan: Plan;
  publicKey: string;       // base64
  signPublicKey: string;   // base64
  createdAt: ISO8601;
  timezone: string;
  twoFactorEnabled: boolean;
  language: "en-US" | "ar-SA" | "pt-BR";
  theme: "light" | "dark" | "system";
}

/* ─── Folders ─── */

export type FolderKind = "system" | "custom";
export type SystemFolderId = "inbox" | "sent" | "drafts" | "trash" | "junk" | "archive" | "flagged" | "important" | "unread" | "all";

export interface Folder {
  id: ID;
  name: string;
  kind: FolderKind;
  unreadCount: number;
  parentId: ID | null;
}

/* ─── Messages ─── */

export interface MessageCipher {
  body: Uint8Array;          // ciphertext
  iv: Uint8Array;            // AES-GCM IV
  authTag: Uint8Array;       // AES-GCM auth tag (16 bytes)
  senderPubKey: string;      // base64
  signature: Uint8Array;     // Ed25519 signature
}

export interface Message {
  id: ID;
  from: EmailAddress;
  fromName: string | null;
  to: EmailAddress[];
  cc?: EmailAddress[];
  bcc?: EmailAddress[];
  subject: string | null;
  preview: string;            // plaintext, server-side scrubbed
  receivedAt: ISO8601;
  readAt: ISO8601 | null;
  starred: boolean;
  encrypted: boolean;
  encryptionMethod: "atomic" | "password" | "file" | null;
  ciphertext?: MessageCipher | null;
  attachments: Attachment[];
  threadId: ID | null;
  folder: SystemFolderId | string;
}

export interface Attachment {
  id: ID;
  name: string;
  size: number;
  type: string; // mime
  encrypted: boolean;
}

/* ─── Aliases (Hide My Email) ─── */

export interface Alias {
  id: ID;
  email: EmailAddress;
  createdAt: ISO8601;
  active: boolean;
  description?: string;
  forwardTo: EmailAddress;
}

/* ─── Encryption ─── */

export interface KeyPair {
  signPublicKey: string;     // base64
  signPrivateKey: string;    // base64 — SENSITIVE
  ecdhPublicKey: string;     // base64
  ecdhPrivateKey: string;    // base64 — SENSITIVE
}

export type EncryptionMethod = "atomic" | "password" | "file";

/* ─── Real-time events ─── */

export interface WsEventNewMessage {
  type: "message:new";
  mailbox: SystemFolderId | string;
  message: Message;
}

export interface WsEventUnread {
  type: "folder:unread";
  folderId: ID;
  count: number;
}

export type WsEvent = WsEventNewMessage | WsEventUnread;
