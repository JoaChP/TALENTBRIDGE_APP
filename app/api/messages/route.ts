import { NextResponse } from 'next/server'

function resolveStoreUrl(request: Request) {
  const url = new URL(request.url)
  url.pathname = '/api/data'
  url.search = ''
  url.hash = ''
  return url.toString()
}

async function fetchStore(request: Request) {
  const response = await fetch(resolveStoreUrl(request), { cache: 'no-store' })
  if (!response.ok) throw new Error(`failed to load store (${response.status})`)
  return response.json()
}

async function persistStore(request: Request, store: any) {
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
    const { searchParams } = new URL(request.url)
    const threadId = searchParams.get('threadId')
    if (!threadId) return NextResponse.json([])
    const store = await fetchStore(request)
    const messages = (store.messages || []).filter((m: any) => m.threadId === threadId)
    return NextResponse.json(messages)
  } catch (error) {
    console.error('[api/messages] GET failed', error)
    return NextResponse.json({ error: 'Failed to load messages' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const store = await fetchStore(request)
    store.messages = store.messages || []
    const newMsg = { ...body, id: `m_${Date.now()}`, createdAt: new Date().toISOString() }
    store.messages.push(newMsg)
    await persistStore(request, store)
    return NextResponse.json(newMsg)
  } catch (error) {
    console.error('[api/messages] POST failed', error)
    return NextResponse.json({ error: 'Failed to persist message' }, { status: 500 })
  }
}
