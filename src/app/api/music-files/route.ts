import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

export async function GET() {
  const musicDir = path.join(process.cwd(), 'public', 'music')
  let files: string[] = []
  try {
    const allFiles = await fs.readdir(musicDir)
    files = allFiles.filter(f => f.toLowerCase().endsWith('.mp3'))
  } catch (e) {
    return NextResponse.json([], { status: 200 })
  }
  return NextResponse.json(files, { status: 200 })
} 