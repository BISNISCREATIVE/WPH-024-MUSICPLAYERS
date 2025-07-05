"use client"

import { motion } from "framer-motion"

interface EqualizerProps {
  isPlaying: boolean
  isLoading: boolean
  getFrequencyData?: () => number[] | null
  className?: string
}

export function Equalizer({ isPlaying, isLoading, getFrequencyData, className = "" }: EqualizerProps) {
  const bars = [1, 2, 3, 4, 5]

  const getBarVariants = (index: number) => ({
    playing: {
      height: ["20%", "100%", "20%"],
      transition: {
        duration: 0.5,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse" as const,
        ease: "easeInOut",
        delay: index * 0.1, // 100ms stagger
      },
    },
    paused: {
      height: "20%",
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
    loading: {
      height: "50%",
      opacity: 0.5,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  })

  const getCurrentState = () => {
    if (isLoading) return "loading"
    if (isPlaying) return "playing"
    return "paused"
  }

  return (
    <div className={`flex items-end gap-[1px] h-[24px] ${className}`}>
      {bars.map((bar, index) => (
        <motion.div
          key={bar}
          className="bg-gradient-to-t from-purple-600 to-purple-400 rounded-sm gpu-accelerated"
          style={{
            width: "4px",
            minHeight: "4px",
          }}
          variants={getBarVariants(index)}
          animate={getCurrentState()}
          initial="paused"
        />
      ))}
    </div>
  )
}
