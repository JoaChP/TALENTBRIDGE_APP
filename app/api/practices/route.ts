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

export async function GET() {
  const store = await fetchStore()
  return NextResponse.json(store.practices || [])
}

export async function POST(request: Request) {
  const body = await request.json()
  const store = await fetchStore()
  const newPractice = { ...body, id: `p_${Date.now()}` }
  store.practices = store.practices || []
  store.practices.unshift(newPractice)
  await persistStore(store)
  return NextResponse.json(newPractice)
}
