"use client"

import { motion } from "framer-motion"
import { Music } from "lucide-react"
import Image from "next/image"
import { useEffect, useState, useRef } from "react"

interface AlbumArtProps {
  isPlaying: boolean
  isLoading: boolean
  className?: string
}

export function AlbumArt({ isPlaying, isLoading, className = "" }: AlbumArtProps) {
  const albumVariants = {
    playing: {
      scale: 1,
      transition: { type: "spring", duration: 0.3 },
    },
    paused: {
      scale: 0.95,
      transition: { type: "spring", duration: 0.3 },
    },
    loading: {
      scale: 0.9,
      transition: { type: "spring", duration: 0.3 },
    },
  }

  const getGradientClass = () => {
    if (isLoading) {
      return "from-purple-400 to-pink-400"
    }
    if (isPlaying) {
      return "from-purple-600 to-purple-500"
    }
    return "from-purple-600 to-purple-800"
  }

  const getCurrentState = () => {
    if (isLoading) return "loading"
    if (isPlaying) return "playing"
    return "paused"
  }

  const getAlbumImage = () => {
    if (isLoading) return "/images/album-loading.png"
    if (isPlaying) return "/images/album-playing.png"
    return "/images/album-art.png"
  }

  const [clockwise, setClockwise] = useState(true)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setClockwise((prev) => !prev)
      }, 15000)
    } else {
      setClockwise(true)
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isPlaying])

  return (
    <motion.div
      className={`relative rounded-2xl overflow-hidden bg-gradient-to-br ${getGradientClass()} ${className}`}
      variants={albumVariants}
      animate={getCurrentState()}
      initial="paused"
      style={{ willChange: "transform" }}
    >
      <div className="w-full h-full flex items-center justify-center">
        {isPlaying && (
          <motion.div
            className="absolute"
            style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
            animate={{ rotate: clockwise ? 360 : -360 }}
            transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
          >
            <svg width="120" height="120">
              <circle cx="60" cy="60" r="48" fill="none" stroke="#a4508b" strokeWidth="8" />
            </svg>
          </motion.div>
        )}
        <motion.div
          animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
          transition={isPlaying ? { repeat: Infinity, duration: 20, ease: 'linear' } : { duration: 0.3 }}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <Image src="/images/music-icon.png" alt="Music Icon" width={96} height={96} />
        </motion.div>
      </div>

      {/* Loading overlay */}
      {isLoading && (
        <motion.div
          className="absolute inset-0 bg-white/20"
          animate={{
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 1.5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      )}

      {/* Playing pulse effect */}
      {isPlaying && !isLoading && (
        <motion.div
          className="absolute inset-0 bg-white/10"
          animate={{
            opacity: [0, 0.3, 0],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      )}
    </motion.div>
  )
}
