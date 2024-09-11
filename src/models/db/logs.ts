import { Env } from '@interfaces';
import { logs, type Log, type LogType } from '@models/schema';
import { getDB } from '.';
import { asc } from 'drizzle-orm';
import { createId } from '@paralleldrive/cuid2';

export const log = async (
  env: Env,
  uid: string,
  assessment_id: string,
  event: string,
  message: string,
  type: LogType
) => {
  switch (type) {
    case 'error':
      console.error(message);
      break;
    case 'debug':
      console.warn(message);
      break;
    case 'info':
    default:
      console.info(message);
      break;
  }
  await getDB(env).insert(logs).values({
    log_id: createId(),
    uid,
    assessment_id,
    event,
    message,
    type,
  });
};

// rewrite using drizzle-orm
const pageSize = 200;
export const getLogs = async (env: Env, page: number): Promise<Log[]> => {
  return getDB(env)
    .select()
    .from(logs)
    .orderBy(asc(logs.created_at))
    .limit(pageSize)
    .offset(page * pageSize) as Promise<Log[]>;
};

export const getUsageFromLogs = async (env: Env, uid: string, event: string): Promise<number[]> => {
  const { results } = await env.DB.prepare(
    `WITH RECURSIVE dates AS (
        SELECT date('now', '-29 days') as date
        UNION ALL
        SELECT date(date, '+1 day')
        FROM dates
        WHERE date < date('now')
    )
    SELECT
        dates.date,
        IFNULL(COUNT(logs.event), 0) as count
    FROM dates
    LEFT JOIN logs ON date(logs.created_at) = dates.date AND logs.uid = ? AND logs.event LIKE ?
    GROUP BY dates.date
    ORDER BY dates.date`
  )
    .bind(uid, event)
    .all();
  return results.map((row) => row.count) as number[];
};

export const getUsageFromAllLogs = async (env: Env, event: string): Promise<number[]> => {
  const { results } = await env.DB.prepare(
    `WITH RECURSIVE dates AS (
        SELECT date('now', '-29 days') as date
        UNION ALL
        SELECT date(date, '+1 day')
        FROM dates
        WHERE date < date('now')
    )
    SELECT
        dates.date,
        IFNULL(COUNT(logs.event), 0) as count
    FROM dates
    LEFT JOIN logs ON date(logs.created_at) = dates.date AND logs.event LIKE ?
    GROUP BY dates.date
    ORDER BY dates.date`
  )
    .bind(event)
    .all();
  return results.map((row) => row.count) as number[];
};

export const getTotalEventsForMonth = async (
  env: Env,
  uid: string,
  event: string,
  months_back: number
): Promise<number> => {
  const start_date = new Date();
  start_date.setHours(0, 0, 0, 0);
  start_date.setDate(1);
  start_date.setMonth(start_date.getMonth() - months_back);
  const end_date = new Date();
  end_date.setHours(0, 0, 0, 0);
  end_date.setDate(1);
  end_date.setMonth(end_date.getMonth() - months_back + 1);
  const response = await env.DB.prepare(
    `SELECT COUNT(*) as count
     FROM logs
     WHERE uid = ? AND event LIKE ?
     AND created_at >= ? AND created_at < ?`
  )
    .bind(uid, event, start_date.toISOString(), end_date.toISOString())
    .first();

  return (response?.count || 0) as number;
};
