import crypto from "crypto";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { authUsers } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

const ITERATIONS = 100000;
const KEY_LENGTH = 64;
const DIGEST = "sha512";
const SESSION_COOKIE = "kyomu-session";
const SESSION_MAX_AGE = 30 * 24 * 60 * 60; // 30 jours

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.randomBytes(32).toString("hex");
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(password, salt, ITERATIONS, KEY_LENGTH, DIGEST, (err, derivedKey) => {
      if (err) reject(err);
      resolve(`${salt}:${derivedKey.toString("hex")}`);
    });
  });
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const [salt, key] = hash.split(":");
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(password, salt, ITERATIONS, KEY_LENGTH, DIGEST, (err, derivedKey) => {
      if (err) reject(err);
      resolve(derivedKey.toString("hex") === key);
    });
  });
}

export function generateSessionToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

export async function getAuthUser() {
  const users = await db.select().from(authUsers).limit(1);
  return users[0] ?? null;
}

export async function isAuthConfigured(): Promise<boolean> {
  const user = await getAuthUser();
  return user !== null;
}

export async function validateSession(token: string): Promise<boolean> {
  const user = await getAuthUser();
  if (!user || !user.sessionToken) return false;
  return user.sessionToken === token;
}

export async function getSessionFromCookie(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE)?.value ?? null;
}

export async function setSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}
