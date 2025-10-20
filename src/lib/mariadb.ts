// Lightweight MariaDB helper using mysql2/promise
// Exports getStore() and setStore(data) to read/write JSON blob under key 'seed'.
import type { Pool } from 'mysql2/promise'

let pool: Pool | null = null

async function createPool(databaseUrl: string) {
  // dynamic import to avoid requiring mysql2 when not used
  const mysql = await import('mysql2/promise')
  const pool = mysql.createPool(databaseUrl)
  return pool as Pool
}

function getPool() {
  if (pool) return pool
  const url = process.env.DATABASE_URL
  if (!url) throw new Error('DATABASE_URL not set')
  // create lazily
  pool = (createPool(url) as unknown) as Pool
  return pool
}

export async function getStoreFromDb() {
  try {
    const p = await (pool ? pool : createPool(process.env.DATABASE_URL!))
    const [rows] = await p.query("SELECT data FROM store WHERE id = 'seed' LIMIT 1")
    const r: any = Array.isArray(rows) && (rows as any)[0]
    if (!r) return null
    return typeof r.data === 'string' ? JSON.parse(r.data) : r.data
  } catch (e) {
    console.error('[mariadb] getStore error', e)
    return null
  }
}

export async function setStoreToDb(data: any) {
  try {
    const p = await (pool ? pool : createPool(process.env.DATABASE_URL!))
    const json = JSON.stringify(data)
    // Use INSERT ... ON DUPLICATE KEY UPDATE for upsert
    await p.query("INSERT INTO store (id, data) VALUES ('seed', ?) ON DUPLICATE KEY UPDATE data = VALUES(data)", [json])
    return true
  } catch (e) {
    console.error('[mariadb] setStore error', e)
    return false
  }
}

export default {
  getStoreFromDb,
  setStoreToDb,
}
