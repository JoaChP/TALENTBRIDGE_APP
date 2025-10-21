import { NextResponse } from 'next/server'
import { defaultData } from '../../../src/mocks/api'
import type { Message } from '../../../src/types'

type DataStore = typeof defaultData
type MessageInput = Omit<Message, 'id' | 'createdAt'>

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
    const { searchParams } = new URL(request.url)
    const threadId = searchParams.get('threadId')
    if (!threadId) return NextResponse.json([])
  const store = await fetchStore(request)
  const messages = (store.messages || []).filter((message: Message) => message.threadId === threadId)
    return NextResponse.json(messages)
  } catch (error) {
    console.error('[api/messages] GET failed', error)
    return NextResponse.json({ error: 'Failed to load messages' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as MessageInput
    const store = await fetchStore(request)
    store.messages = store.messages || []
    const newMsg: Message = {
      ...body,
      id: `m_${Date.now()}`,
      createdAt: new Date().toISOString(),
    }
    store.messages.push(newMsg)
    await persistStore(request, store)
    return NextResponse.json(newMsg)
  } catch (error) {
    console.error('[api/messages] POST failed', error)
    return NextResponse.json({ error: 'Failed to persist message' }, { status: 500 })
  }
}
