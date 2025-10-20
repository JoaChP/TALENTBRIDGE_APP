import { NextResponse } from 'next/server'
import { defaultData } from '../../../src/mocks/api'

// Simple API route that returns the seed data for the app and accepts POST to replace it.
// Note: On serverless platforms this won't persist across instances without an external DB.
export async function GET() {
  return NextResponse.json(defaultData)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    // In a real DB we'd persist here. For now echo back what we received.
    return NextResponse.json({ ok: true, data: body })
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 400 })
  }
}
