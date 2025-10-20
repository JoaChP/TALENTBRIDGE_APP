import { NextResponse } from 'next/server'
import { defaultData } from '../../../src/mocks/api'
import { promises as fs } from 'fs'
import path from 'path'
// try to load mariadb helper if available
let mariadb: any = null
try {
  mariadb = require('../../../src/lib/mariadb').default
} catch (e) {
  mariadb = null
}

// Server file backed store (simple JSON file under /data/store.json)
// Note: This works for demos and local dev. On serverless platforms persistence
// across invocations is not guaranteed - use a proper DB for production.
const STORE_DIR = path.join(process.cwd(), 'data')
const STORE_FILE = path.join(STORE_DIR, 'store.json')

// Vercel and other serverless providers expose a read-only filesystem for the
// deployment bundle. Allow opting into an in-memory store so GET requests keep
// working without a database configured.
const globalStore = globalThis as typeof globalThis & {
  __talentbridgeMemoryStore?: unknown
}

const useMemoryStore = Boolean(process.env.VERCEL || process.env.DISABLE_FS_STORE === 'true')

function getMemoryStore() {
  if (!globalStore.__talentbridgeMemoryStore) {
    // Clone to avoid accidental mutations of the default seed reference.
    globalStore.__talentbridgeMemoryStore = JSON.parse(JSON.stringify(defaultData))
  }
  return globalStore.__talentbridgeMemoryStore
}

async function ensureStoreExists() {
  if (useMemoryStore) return
  try {
    await fs.mkdir(STORE_DIR, { recursive: true })
    try {
      await fs.access(STORE_FILE)
    } catch (_) {
      // write default
      await fs.writeFile(STORE_FILE, JSON.stringify(defaultData, null, 2), 'utf8')
    }
  } catch (e) {
    // ignore - will fall back to defaultData
  }
}

export async function GET() {
  try {
    if (useMemoryStore) {
      return NextResponse.json(getMemoryStore())
    }
    // If DATABASE_URL is provided try DB first
    if (process.env.DATABASE_URL && mariadb) {
      const db = await (mariadb.getStoreFromDb ? mariadb.getStoreFromDb() : null)
      if (db) return NextResponse.json(db)
    }
    await ensureStoreExists()
    const content = await fs.readFile(STORE_FILE, 'utf8')
    const json = JSON.parse(content)
    return NextResponse.json(json)
  } catch (e) {
    // fallback
    return NextResponse.json(defaultData)
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    if (useMemoryStore) {
      globalStore.__talentbridgeMemoryStore = body
      return NextResponse.json({ ok: true, data: body, persisted: 'memory' })
    }
    // If DB available, try to persist there
    if (process.env.DATABASE_URL && mariadb) {
      try {
        const ok = await mariadb.setStoreToDb(body)
        if (ok) return NextResponse.json({ ok: true, data: body })
      } catch (e) {
        // fall through to file
      }
    }

    await ensureStoreExists()
    await fs.writeFile(STORE_FILE, JSON.stringify(body, null, 2), 'utf8')
    return NextResponse.json({ ok: true, data: body })
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 })
  }
}
