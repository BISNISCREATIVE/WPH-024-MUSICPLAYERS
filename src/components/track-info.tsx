"use client"

import { motion } from "framer-motion"
import type { Track } from "@/types/music"

interface TrackInfoProps {
  track: Track | null
  className?: string
}

export function TrackInfo({ track, className = "" }: TrackInfoProps) {
  if (!track) {
    return (
      <div className={`${className}`}>
        <div className="h-6 bg-gray-700 rounded animate-pulse mb-2" />
        <div className="h-4 bg-gray-700 rounded animate-pulse w-2/3" />
      </div>
    )
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-lg font-semibold text-white truncate">{track.title}</h2>
      <p className="text-sm text-gray-400 truncate">{track.artist}</p>
    </motion.div>
  )
}
