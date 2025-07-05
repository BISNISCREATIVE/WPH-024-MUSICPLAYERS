"use client"

import { motion } from "framer-motion"
import { SkipBack, SkipForward, Shuffle, Repeat, Play, Pause, Volume2, VolumeX } from "lucide-react"
import { useState } from "react"

interface PlayerControlsProps {
  isPlaying: boolean
  isLoading: boolean
  onPlay: () => void
  onPause: () => void
  onPrevious?: () => void
  onNext?: () => void
  onShuffle?: () => void
  onRepeat?: () => void
  volume: number
  onVolumeChange: (volume: number) => void
  onVolumeSliderChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  className?: string
}

export function PlayerControls({
  isPlaying,
  isLoading,
  onPlay,
  onPause,
  onPrevious,
  onNext,
  onShuffle,
  onRepeat,
  volume,
  onVolumeChange,
  onVolumeSliderChange,
  className = "",
}: PlayerControlsProps) {
  const [isButtonLoading, setIsButtonLoading] = useState(false)

  const handlePlayPause = async () => {
    if (isLoading || isButtonLoading) return
    setIsButtonLoading(true)
    setTimeout(() => {
      setIsButtonLoading(false)
      if (isPlaying) {
        onPause()
      } else {
        onPlay()
      }
    }, 500)
  }

  const buttonVariants = {
    hover: {
      scale: 1.05,
      color: "rgb(255 255 255)",
      transition: { duration: 0.2 },
    },
    tap: {
      scale: 0.95,
      transition: { duration: 0.1 },
    },
    disabled: {
      color: "rgb(107 114 128)",
      cursor: "not-allowed",
    },
  }

  const playButtonVariants = {
    playing: {
      backgroundColor: "hsl(var(--primary))",
      scale: 1,
      transition: { type: "spring", duration: 0.3 },
    },
    paused: {
      backgroundColor: "hsl(var(--primary))",
      scale: 1,
      transition: { type: "spring", duration: 0.3 },
    },
    loading: {
      backgroundColor: "hsl(var(--muted-foreground))",
      scale: 1,
      transition: { type: "spring", duration: 0.3 },
    },
  }

  const getCurrentPlayButtonState = () => {
    if (isLoading) return "loading"
    if (isPlaying) return "playing"
    return "paused"
  }

  const volumeSliderVariants = {
    hover: {
      backgroundColor: "rgb(168 85 247)", // purple-500
      transition: { duration: 0.2 },
    },
    default: {
      backgroundColor: "rgb(107 114 128)", // gray-500
      transition: { duration: 0.2 },
    },
  }

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      {/* Main Controls */}
      <div className="flex items-center justify-center gap-4">
        {/* Shuffle */}
        <motion.button
          onClick={onShuffle}
          disabled={isLoading}
          className="text-gray-400 p-2"
          variants={buttonVariants}
          whileHover={!isLoading ? "hover" : undefined}
          whileTap={!isLoading ? "tap" : undefined}
          animate={isLoading ? "disabled" : undefined}
        >
          <Shuffle className="w-4 h-4" />
        </motion.button>

        {/* Previous */}
        <motion.button
          onClick={onPrevious}
          disabled={isLoading}
          className="text-gray-400 p-2"
          variants={buttonVariants}
          whileHover={!isLoading ? "hover" : undefined}
          whileTap={!isLoading ? "tap" : undefined}
          animate={isLoading ? "disabled" : undefined}
        >
          <SkipBack className="w-5 h-5" />
        </motion.button>

        {/* Play/Pause */}
        <motion.button
          onClick={handlePlayPause}
          disabled={isLoading || isButtonLoading}
          className="w-12 h-12 rounded-full text-white shadow-lg flex items-center justify-center"
          variants={playButtonVariants}
          animate={isLoading || isButtonLoading ? "loading" : getCurrentPlayButtonState()}
          whileHover={!isLoading && !isButtonLoading ? { scale: 1.05 } : undefined}
          whileTap={!isLoading && !isButtonLoading ? { scale: 0.95 } : undefined}
          style={{ willChange: "transform" }}
        >
          {(isLoading || isButtonLoading) ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
            />
          ) : isPlaying ? (
            <Pause className="w-5 h-5" />
          ) : (
            <Play className="w-5 h-5 ml-0.5" />
          )}
        </motion.button>

        {/* Next */}
        <motion.button
          onClick={onNext}
          disabled={isLoading}
          className="text-gray-400 p-2"
          variants={buttonVariants}
          whileHover={!isLoading ? "hover" : undefined}
          whileTap={!isLoading ? "tap" : undefined}
          animate={isLoading ? "disabled" : undefined}
        >
          <SkipForward className="w-5 h-5" />
        </motion.button>

        {/* Repeat */}
        <motion.button
          onClick={onRepeat}
          disabled={isLoading}
          className="text-gray-400 p-2"
          variants={buttonVariants}
          whileHover={!isLoading ? "hover" : undefined}
          whileTap={!isLoading ? "tap" : undefined}
          animate={isLoading ? "disabled" : undefined}
        >
          <Repeat className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Volume Control */}
      <div className="flex items-center gap-2">
        <motion.button
          onClick={() => onVolumeChange(volume > 0 ? 0 : 1)}
          disabled={isLoading}
          className="text-gray-400 p-1"
          variants={buttonVariants}
          whileHover={!isLoading ? "hover" : undefined}
          whileTap={!isLoading ? "tap" : undefined}
        >
          {volume > 0 ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </motion.button>

        <div className="flex-1 h-1 bg-gray-600 rounded-full overflow-hidden relative">
          <motion.div
            className="h-full rounded-full absolute top-0 left-0"
            style={{ width: `${volume * 100}%`, backgroundColor: '#a855f7', zIndex: 1 }}
            variants={volumeSliderVariants}
            whileHover="hover"
            animate="default"
          />
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={onVolumeSliderChange}
            disabled={isLoading}
            className="absolute w-full h-1 opacity-0 cursor-pointer z-10"
            style={{ top: 0, left: 0 }}
            aria-label="Volume slider"
          />
        </div>
      </div>
    </div>
  )
}
