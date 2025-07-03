"use client"

import { motion } from "framer-motion"
import { Music } from "lucide-react"

interface AlbumArtProps {
  isPlaying: boolean
  isLoading: boolean
  className?: string
}

export function AlbumArt({ isPlaying, isLoading, className = "" }: AlbumArtProps) {
  const albumVariants = {
    playing: {
      scale: 1,
      rotate: 360,
      transition: {
        scale: {
          duration: 0.3,
          type: "spring",
          stiffness: 300,
          damping: 30,
        },
        rotate: {
          duration: 20,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        },
      },
    },
    paused: {
      scale: 0.95,
      rotate: 0,
      transition: {
        duration: 0.3,
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
    loading: {
      scale: 0.9,
      rotate: 0,
      transition: {
        duration: 0.3,
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
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

  return (
    <motion.div
      className={`relative rounded-2xl overflow-hidden bg-gradient-to-br ${getGradientClass()} ${className}`}
      variants={albumVariants}
      animate={getCurrentState()}
      initial="paused"
      style={{ willChange: "transform" }}
    >
      <div className="w-full h-full flex items-center justify-center">
        <Music className="w-12 h-12 text-black/80" />
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
