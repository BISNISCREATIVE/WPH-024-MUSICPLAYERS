"use client"

import type React from "react"

import { motion } from "framer-motion"
import { useCallback } from "react"

interface ProgressBarProps {
  currentTime: number
  duration: number
  onSeek: (time: number) => void
  isPlaying: boolean
  isLoading?: boolean
  className?: string
}

export function ProgressBar({
  currentTime,
  duration,
  onSeek,
  isPlaying,
  isLoading = false,
  className = "",
}: ProgressBarProps) {
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (isLoading) return

      const rect = e.currentTarget.getBoundingClientRect()
      const clickX = e.clientX - rect.left
      const percentage = clickX / rect.width
      const newTime = percentage * duration
      onSeek(newTime)
    },
    [duration, onSeek, isLoading],
  )

  const progressVariants = {
    playing: {
      backgroundColor: "hsl(var(--primary))", // gunakan token ungu utama
    },
    paused: {
      backgroundColor: "hsl(var(--muted-foreground))", // gunakan token abu
    },
    loading: {
      backgroundColor: "hsl(var(--muted))", // gunakan token abu gelap
    },
  }

  const getCurrentState = () => {
    if (isLoading) return "loading"
    if (isPlaying) return "playing"
    return "paused"
  }

  return (
    <div
      className={`relative h-1 bg-gray-600 rounded-full ${isLoading ? "cursor-not-allowed" : "cursor-pointer"} ${className}`}
      onClick={handleClick}
    >
      <motion.div
        className="absolute top-0 left-0 h-full rounded-full will-change-transform"
        style={{ width: `${progress}%` }}
        variants={progressVariants}
        animate={getCurrentState()}
        transition={{ duration: 0.3 }}
      />
      <motion.div
        className="absolute top-1/2 w-3 h-3 bg-white rounded-full shadow-lg transform -translate-y-1/2"
        style={{ left: `calc(${progress}% - 1.5px)` }}
        whileHover={{ scale: 1.2 }}
        transition={{ duration: 0.2 }}
      />
    </div>
  )
}
