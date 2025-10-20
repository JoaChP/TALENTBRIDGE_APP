import { NextResponse } from 'next/server'

async function fetchStore() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_ORIGIN || ''}/api/data`, { cache: 'no-store' })
  if (!res.ok) throw new Error('failed to load store')
  return res.json()
}

async function persistStore(store: any) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_ORIGIN || ''}/api/data`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(store),
  })
  if (!res.ok) throw new Error('failed to persist store')
  return res.json()
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const threadId = searchParams.get('threadId')
  if (!threadId) return NextResponse.json([])
  const store = await fetchStore()
  const messages = (store.messages || []).filter((m: any) => m.threadId === threadId)
  return NextResponse.json(messages)
}

export async function POST(request: Request) {
  const body = await request.json()
  const store = await fetchStore()
  store.messages = store.messages || []
  const newMsg = { ...body, id: `m_${Date.now()}`, createdAt: new Date().toISOString() }
  store.messages.push(newMsg)
  await persistStore(store)
  return NextResponse.json(newMsg)
}
