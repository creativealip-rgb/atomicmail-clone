import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { users, sessions } from "../db/schema/index.js";
import { hashPassword, verifyPassword } from "../lib/password.js";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../lib/jwt.js";
import { requireAuth, type ChainmailVars } from "../middleware/auth.js";
import { generateKeyPair, encryptKeyPair } from "@ui/crypto";
import { generateRecoveryCode, hashRecoveryCode } from "@ui/crypto";

const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128),
});

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const refreshSchema = z.object({
  refreshToken: z.string().min(1),
});

export const auth = new Hono<{ Variables: ChainmailVars }>();

auth.post("/sign-up", zValidator("json", signUpSchema), async (c) => {
  const { email, password } = c.req.valid("json");
  const normalizedEmail = email.toLowerCase().trim();

  const existing = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, normalizedEmail))
    .limit(1);

  if (existing.length > 0) {
    return c.json({ error: "email_taken", message: "Email already registered" }, 409);
  }

  // W3.5: generate per-user X25519 + Ed25519 keypair, encrypt privs with password
  const kp = await generateKeyPair();
  const encKp = await encryptKeyPair(kp, password);
  const encKpJson = JSON.stringify(encKp);
  const recoveryCode = await generateRecoveryCode();
  const recoveryHash = await hashRecoveryCode(recoveryCode);
  const passwordHash = await hashPassword(password);

  const [user] = await db
    .insert(users)
    .values({
      email: normalizedEmail,
      passwordHash,
      publicKey: kp.ecdhPublicKey,           // server uses this to encrypt new mail
      encryptedPrivateKey: encKpJson,         // client decrypts with password
      recoveryKeyHash: recoveryHash,          // server stores hash only
    })
    .returning({ id: users.id, email: users.email, createdAt: users.createdAt });

  if (!user) {
    return c.json({ error: "insert_failed" }, 500);
  }

  const accessToken = await signAccessToken({ sub: user.id, email: user.email });
  const { token: refreshToken, jti } = await signRefreshToken({ sub: user.id });
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  await db.insert(sessions).values({
    id: jti,
    userId: user.id,
    refreshExpiresAt: expiresAt,
  });

  return c.json(
    {
      user: { id: user.id, email: user.email, createdAt: user.createdAt },
      accessToken,
      refreshToken,
      // W3.5: key material for the client to persist
      keyMaterial: {
        ecdhPublicKey: kp.ecdhPublicKey,
        signPublicKey: kp.signPublicKey,
        encryptedPrivateKey: encKp,
        recoveryCode, // shown ONCE — user must save it
      },
    },
    201
  );
});

auth.post("/sign-in", zValidator("json", signInSchema), async (c) => {
  const { email, password } = c.req.valid("json");
  const normalizedEmail = email.toLowerCase().trim();

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, normalizedEmail))
    .limit(1);

  if (!user) {
    return c.json({ error: "invalid_credentials" }, 401);
  }

  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) {
    return c.json({ error: "invalid_credentials" }, 401);
  }

  const accessToken = await signAccessToken({ sub: user.id, email: user.email });
  const { token: refreshToken, jti } = await signRefreshToken({ sub: user.id });
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  await db.insert(sessions).values({
    id: jti,
    userId: user.id,
    refreshExpiresAt: expiresAt,
  });

  return c.json({
    user: { id: user.id, email: user.email, createdAt: user.createdAt },
    accessToken,
    refreshToken,
    // W3.5: ship encrypted private key + public keys so client can decrypt
    keyMaterial: user.encryptedPrivateKey && user.publicKey
      ? {
          ecdhPublicKey: user.publicKey,
          encryptedPrivateKey: JSON.parse(user.encryptedPrivateKey),
          // signPublicKey is bundled in encryptedPrivateKey, but we expose it via the structure
        }
      : null,
  });
});

auth.post("/refresh", zValidator("json", refreshSchema), async (c) => {
  const { refreshToken } = c.req.valid("json");

  let payload;
  try {
    payload = await verifyRefreshToken(refreshToken);
  } catch (e) {
    return c.json({ error: "invalid_refresh_token" }, 401);
  }

  const [session] = await db.select().from(sessions).where(eq(sessions.id, payload.jti)).limit(1);
  if (!session || session.userId !== payload.sub) {
    return c.json({ error: "session_not_found" }, 401);
  }
  if (session.refreshExpiresAt < new Date()) {
    return c.json({ error: "session_expired" }, 401);
  }

  const [user] = await db.select().from(users).where(eq(users.id, payload.sub)).limit(1);
  if (!user) {
    return c.json({ error: "user_not_found" }, 401);
  }

  const accessToken = await signAccessToken({ sub: user.id, email: user.email });
  return c.json({ accessToken });
});

auth.get("/me", requireAuth(), async (c) => {
  const userId = c.get("userId");
  const [user] = await db
    .select({ id: users.id, email: users.email, createdAt: users.createdAt, publicKey: users.publicKey })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!user) {
    return c.json({ error: "user_not_found" }, 404);
  }
  return c.json({ user });
});
