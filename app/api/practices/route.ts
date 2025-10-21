import { NextResponse } from 'next/server'
import { defaultData } from '../../../src/mocks/api'
import type { Practice } from '../../../src/types'

type DataStore = typeof defaultData
type PracticeInput = Omit<Practice, 'id'>

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
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (id) {
  const practice = (store.practices || []).find((item: Practice) => String(item.id) === id)
      if (!practice) {
        return NextResponse.json({ error: 'Practice not found' }, { status: 404 })
      }
      return NextResponse.json(practice)
    }

    return NextResponse.json(store.practices || [])
  } catch (error) {
    console.error('[api/practices] GET failed', error)
    return NextResponse.json({ error: 'Failed to load practices' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
  const body = (await request.json()) as PracticeInput
  const store = await fetchStore(request)
  store.practices = store.practices || []
  const newPractice: Practice = { ...body, id: `p_${Date.now()}` }
  store.practices.unshift(newPractice)
    await persistStore(request, store)
    return NextResponse.json(newPractice)
  } catch (error) {
    console.error('[api/practices] POST failed', error)
    return NextResponse.json({ error: 'Failed to create practice' }, { status: 500 })
  }
}
