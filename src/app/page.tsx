"use client"

import { useEffect, useState } from "react"
import { MusicPlayer } from "@/components/music-player"
import type { Track } from "@/types/music"
import { fetchTracks } from "@/lib/music-api"

export default function Home() {
  const [tracks, setTracks] = useState<Track[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadTracks = async () => {
      try {
        const fetchedTracks = (await fetchTracks()) as Track[]
        setTracks(fetchedTracks)
      } catch (error) {
        console.error("Error loading tracks:", error)
      } finally {
        setLoading(false)
      }
    }

    loadTracks()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading music player...</div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-white text-center mb-8">AHADEMY MUSIC</h1>
        <MusicPlayer tracks={tracks} />
      </div>
    </main>
  )
}
