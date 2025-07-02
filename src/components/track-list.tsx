"use client"

import type React from "react"

import { motion } from "framer-motion"
import { Play, Pause, Music, FileAudio } from "lucide-react"
import type { Track } from "@/types/music"

interface TrackListProps {
  tracks: Track[]
  currentTrack: Track | null
  isPlaying: boolean
  onTrackSelect: (track: Track, index: number) => void
  className?: string
}

export function TrackList({ tracks, currentTrack, isPlaying, onTrackSelect, className = "" }: TrackListProps) {
  const formatDuration = (seconds: number) => {
    if (seconds === 0) return "0:00"
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  // Separate MP3 and demo tracks
  const mp3Tracks = tracks.filter((track) => track.id.startsWith("mp3-"))
  const demoTracks = tracks.filter((track) => track.id.startsWith("demo-"))

  const TrackSection = ({
    title,
    tracks: sectionTracks,
    icon,
  }: {
    title: string
    tracks: Track[]
    icon: React.ReactNode
  }) => {
    if (sectionTracks.length === 0) return null

    return (
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          {icon}
          <h4 className="text-white font-medium text-sm">{title}</h4>
          <span className="text-gray-500 text-xs">({sectionTracks.length})</span>
        </div>

        <div className="space-y-2">
          {sectionTracks.map((track, sectionIndex) => {
            const globalIndex = tracks.findIndex((t) => t.id === track.id)
            const isCurrentTrack = currentTrack?.id === track.id
            const isCurrentlyPlaying = isCurrentTrack && isPlaying

            return (
              <motion.div
                key={track.id}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-300 ${
                  isCurrentTrack
                    ? "bg-purple-600/20 border border-purple-600/30 shadow-lg"
                    : "hover:bg-gray-700/50 border border-transparent"
                }`}
                onClick={() => onTrackSelect(track, globalIndex)}
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: sectionIndex * 0.1 }}
              >
                {/* Play/Pause Icon */}
                <motion.div className="w-8 h-8 flex items-center justify-center" whileHover={{ scale: 1.1 }}>
                  {isCurrentlyPlaying ? (
                    <Pause className="w-4 h-4 text-purple-400" />
                  ) : (
                    <Play className="w-4 h-4 text-gray-400 group-hover:text-white" />
                  )}
                </motion.div>

                {/* Track Info */}
                <div className="flex-1 min-w-0">
                  <div
                    className={`font-medium truncate transition-colors ${
                      isCurrentTrack ? "text-purple-400" : "text-white"
                    }`}
                  >
                    {track.title}
                  </div>
                  <div className="text-sm text-gray-400 truncate">{track.artist}</div>
                </div>

                {/* Duration */}
                <div className="text-sm text-gray-400 min-w-[40px] text-right">{formatDuration(track.duration)}</div>

                {/* Track type indicator */}
                <div className="w-2 h-2 rounded-full">
                  {track.id.startsWith("mp3-") ? (
                    <div className="w-full h-full bg-green-400 rounded-full" title="MP3 File" />
                  ) : (
                    <div className="w-full h-full bg-blue-400 rounded-full" title="Demo Track" />
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 border border-gray-700/50 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold">Playlist</h3>
        <div className="text-xs text-gray-400">
          {tracks.length} track{tracks.length !== 1 ? "s" : ""}
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto custom-scrollbar">
        {/* MP3 Files Section */}
        <TrackSection title="MP3 Files" tracks={mp3Tracks} icon={<FileAudio className="w-4 h-4 text-green-400" />} />

        {/* Demo Tracks Section */}
        <TrackSection title="Demo Tracks" tracks={demoTracks} icon={<Music className="w-4 h-4 text-blue-400" />} />

        {/* Empty state */}
        {tracks.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Music className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No tracks available</p>
            <p className="text-xs mt-2">Add MP3 files to public/music/</p>
          </div>
        )}
      </div>
    </div>
  )
}
