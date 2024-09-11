import { drizzle } from 'drizzle-orm/d1';
import * as schema from '@models/schema';
import { Env } from '@interfaces';

export const getDB = (env: Env) => drizzle(env.DB, { schema });
