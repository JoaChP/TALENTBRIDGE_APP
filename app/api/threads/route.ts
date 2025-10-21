import { NextResponse } from 'next/server'
import { defaultData } from '../../../src/mocks/api'
import type { Thread } from '../../../src/types'

type DataStore = typeof defaultData
type ThreadInput = Omit<Thread, 'id'>

function resolveStoreUrl(request: Request) {
  const url = new URL(request.url)
  url.pathname = '/api/data'
  url.search = ''
  url.hash = ''
  return url.toString()
}

async function fetchStore(request: Request): Promise<DataStore> {
  const response = await fetch(resolveStoreUrl(request), { cache: 'no-store' })
  if (!response.ok) throw new Error(`failed to load store (${response.status})`)
  return (await response.json()) as DataStore
}

async function persistStore(request: Request, store: DataStore) {
  const response = await fetch(resolveStoreUrl(request), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(store),
  })
  if (!response.ok) throw new Error(`failed to persist store (${response.status})`)
  return response.json()
}

export async function GET(request: Request) {
  try {
    const store = await fetchStore(request)
    return NextResponse.json(store.threads || [])
  } catch (error) {
    console.error('[api/threads] GET failed', error)
    return NextResponse.json({ error: 'Failed to load threads' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
  const body = (await request.json()) as ThreadInput
  const store = await fetchStore(request)
  store.threads = store.threads || []
  const newThread: Thread = { ...body, id: `t_${Date.now()}` }
    store.threads.unshift(newThread)
    await persistStore(request, store)
    return NextResponse.json(newThread)
  } catch (error) {
    console.error('[api/threads] POST failed', error)
    return NextResponse.json({ error: 'Failed to create thread' }, { status: 500 })
  }
}
