import { NextResponse } from 'next/server'
import { defaultData } from '../../../src/mocks/api'
import { promises as fs } from 'fs'
import path from 'path'

// Server file backed store (simple JSON file under /data/store.json)
// Note: This works for demos and local dev. On serverless platforms persistence
// across invocations is not guaranteed - use a proper DB for production.
const STORE_DIR = path.join(process.cwd(), 'data')
const STORE_FILE = path.join(STORE_DIR, 'store.json')

async function ensureStoreExists() {
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
    await ensureStoreExists()
    await fs.writeFile(STORE_FILE, JSON.stringify(body, null, 2), 'utf8')
    return NextResponse.json({ ok: true, data: body })
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 })
  }
}
