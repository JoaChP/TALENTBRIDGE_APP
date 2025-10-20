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
    const store = await fetchStore(request)
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (id) {
      const practice = (store.practices || []).find((item: any) => String(item.id) === id)
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
    const body = await request.json()
    const store = await fetchStore(request)
    const newPractice = { ...body, id: `p_${Date.now()}` }
    store.practices = store.practices || []
    store.practices.unshift(newPractice)
    await persistStore(request, store)
    return NextResponse.json(newPractice)
  } catch (error) {
    console.error('[api/practices] POST failed', error)
    return NextResponse.json({ error: 'Failed to create practice' }, { status: 500 })
  }
}
