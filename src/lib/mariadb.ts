// Lightweight MariaDB helper using mysql2/promise
// Exports getStore() and setStore(data) to read/write JSON blob under key 'seed'.
import type { Pool, RowDataPacket } from 'mysql2/promise'
import { defaultData } from '../mocks/api'

type DataStore = typeof defaultData

let pool: Pool | null = null
let poolPromise: Promise<Pool> | null = null

async function createPool(databaseUrl: string): Promise<Pool> {
  // dynamic import to avoid requiring mysql2 when not used
  const mysql = await import('mysql2/promise')
  return mysql.createPool(databaseUrl)
}

async function getPool(): Promise<Pool> {
  if (pool) return pool
  const url = process.env.DATABASE_URL
  if (!url) throw new Error('DATABASE_URL not set')
  if (!poolPromise) {
    poolPromise = createPool(url)
  }
  pool = await poolPromise
  return pool
}

type StoreRow = RowDataPacket & { data: string | null }

export async function getStoreFromDb(): Promise<DataStore | null> {
  try {
    const connection = await getPool()
    const [rows] = await connection.query<StoreRow[]>(
      "SELECT data FROM store WHERE id = 'seed' LIMIT 1"
    )
    const row = Array.isArray(rows) ? rows[0] : undefined
    if (!row || !row.data) return null
    const parsed = typeof row.data === 'string' ? JSON.parse(row.data) : row.data
    return parsed as DataStore
  } catch (error) {
    console.error('[mariadb] getStore error', error)
    return null
  }
}

export async function setStoreToDb(data: DataStore): Promise<boolean> {
  try {
    const connection = await getPool()
    const json = JSON.stringify(data)
    // Use INSERT ... ON DUPLICATE KEY UPDATE for upsert
    await connection.query(
      "INSERT INTO store (id, data) VALUES ('seed', ?) ON DUPLICATE KEY UPDATE data = VALUES(data)",
      [json]
    )
    return true
  } catch (error) {
    console.error('[mariadb] setStore error', error)
    return false
  }
}

const mariaDbHelpers = {
  getStoreFromDb,
  setStoreToDb,
}

export default mariaDbHelpers
