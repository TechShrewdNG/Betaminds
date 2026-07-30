import "server-only";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

const COOKIE = "bm_session";
const MAX_AGE_SECONDS = 60 * 60 * 12;

export type Session = { userId: string; email: string; name: string };

function secret(): Uint8Array {
  const value = process.env.AUTH_SECRET;
  if (!value || value.length < 16) {
    throw new Error(
      "AUTH_SECRET is missing or too short. Set it in .env — see .env.example.",
    );
  }
  return new TextEncoder().encode(value);
}

export async function verifyCredentials(
  email: string,
  password: string,
): Promise<Session | null> {
  const user = await prisma.adminUser.findUnique({
    where: { email: email.trim().toLowerCase() },
  });
  // Compare against a dummy hash when the user is missing so a bad email and a
  // bad password take the same amount of time to reject.
  const hash =
    user?.passwordHash ??
    "$2a$10$invalidinvalidinvalidinvalidinvalidinvalidinvalidinvalidiu";
  const ok = await bcrypt.compare(password, hash);
  if (!ok || !user) return null;
  return { userId: user.id, email: user.email, name: user.name };
}

export async function createSession(session: Session) {
  const token = await new SignJWT({ ...session })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE_SECONDS}s`)
    .sign(secret());

  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function destroySession() {
  (await cookies()).delete(COOKIE);
}

export async function getSession(): Promise<Session | null> {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    if (typeof payload.userId !== "string") return null;
    return {
      userId: payload.userId,
      email: String(payload.email ?? ""),
      name: String(payload.name ?? ""),
    };
  } catch {
    return null;
  }
}

/** Throws if there is no valid session. Use in admin server actions. */
export async function requireSession(): Promise<Session> {
  const session = await getSession();
  if (!session) throw new Error("Not authenticated.");
  return session;
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function countAdmins() {
  return prisma.adminUser.count();
}
