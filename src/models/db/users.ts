import type { Env } from '@interfaces';
import type { User, UserRole } from '@models/schema';
import type { Context } from 'hono';
import { generatePassword } from '@utils';
import { createId } from '@paralleldrive/cuid2';
import { getSession, setSession } from '@models/auth';
import { users } from '@models/schema';
import { eq, like, and } from 'drizzle-orm';
import { getDB } from '.';

export const signUp = async (
  env: Env,
  name: string,
  email: string,
  role: UserRole,
  owner_id: string
): Promise<{ password: string; user: User } | null> => {
  const uid = createId();
  const api_key = createId();
  const password = generatePassword();
  const hashBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(password));
  const hashBase64 = btoa(String.fromCharCode(...new Uint8Array(hashBuffer)));
  const results = (await getDB(env)
    .insert(users)
    .values({ uid, name, email, password: hashBase64, api_key, role, owner_id })
    .returning()) as User[];
  return { password, user: results[0] };
};

export const resetPassword = async (env: Env, uid: string): Promise<string> => {
  const password = generatePassword();
  const hashBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(password));
  const hashBase64 = btoa(String.fromCharCode(...new Uint8Array(hashBuffer)));
  await getDB(env).update(users).set({ password: hashBase64, password_reset: true }).where(eq(users.uid, uid));
  return password;
};

export const signIn = async (c: Context, email: string, password: string) => {
  const user = (await getDB(c.env).query.users.findFirst({
    where: eq(users.email, email),
  })) as User | null;
  console.log('email', email, user);
  if (!user || !user.user_active) return null;
  const hashBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(password));
  const hashBase64 = btoa(String.fromCharCode(...new Uint8Array(hashBuffer)));
  if (hashBase64 !== user.password) return null;
  await setSession(c, { uid: user.uid });
  return user;
};

export const getUser = (env: Env, uid: string) =>
  getDB(env).query.users.findFirst({
    where: eq(users.uid, uid),
  }) as Promise<User | null>;

export const getUserFromApiKey = (env: Env, api_key: string) =>
  getDB(env).query.users.findFirst({
    where: eq(users.api_key, api_key),
  }) as Promise<User | null>;

export const getAllUsers = async (env: Env, role: UserRole, owner_id: string) =>
  getDB(env).query.users.findMany({
    where: and(eq(users.role, role), eq(users.owner_id, owner_id)),
  }) as Promise<User[]>;

export const updateUser = async (env: Env, uid: string, data: Partial<User>): Promise<User> => {
  const user = await getDB(env).update(users).set(data).where(eq(users.uid, uid)).returning();
  return user[0] as User;
};

export const deleteUser = async (env: Env, uid: string, owner_id: string) =>
  getDB(env)
    .delete(users)
    .where(and(eq(users.uid, uid), eq(users.owner_id, owner_id)));

export const searchUsers = async (env: Env, search: string, role: UserRole, owner_id: string): Promise<User[]> => {
  const results = await getDB(env)
    .select()
    .from(users)
    .where(and(like(users.name, `%${search}%`), eq(users.role, role), eq(users.owner_id, owner_id)));
  console.log('results', results);
  return results as User[];
};

export const getMyUser = async (c: Context) => {
  const payload = await getSession(c);
  if (!payload) return null;
  return getUser(c.env, payload.uid);
};

export const getMyOwner = async (c: Context) => {
  const user = await getMyUser(c);
  if (!user || !user.owner_id) return null;
  return getUser(c.env, user.owner_id);
};
