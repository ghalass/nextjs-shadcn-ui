// lib/auth.ts

import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import crypto from "crypto";

export async function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = await bcrypt.hash(password + salt, 10);
  return { salt, hash };
}

export async function verifyPassword(
  password: string,
  salt: string,
  hashedPassword: string
) {
  const passwordMatches = await bcrypt.compare(password + salt, hashedPassword);
  return passwordMatches;
}

export type SessionData = {
  userId: string;
  email: string;
  role: string;
  isLoggedIn: boolean;
};

export const sessionOptions = {
  password: process.env.SESSION_PASSWORD as string,
  cookieName: "auth_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax" as const, // 'lax' | 'strict' | 'none'
    maxAge: 7 * 24 * 60 * 60, // 7 jours en secondes
  },
};

export async function getSession() {
  const cookieStore = await cookies();
  const session = await getIronSession<SessionData>(
    cookieStore,
    sessionOptions
  );

  if (!session.isLoggedIn) {
    session.isLoggedIn = false;
  }

  return session;
}

export async function logout() {
  const session = await getSession();
  session.destroy();
}
