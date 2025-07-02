"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useMusicPlayer } from "@/hooks/use-music-player"
import type { Track, PlayerStatus } from "@/types/music"
import { AlbumArt } from "./album-art"
import { TrackInfo } from "./track-info"
import { Equalizer } from "./equalizer"
import { ProgressBar } from "./progress-bar"
import { TimeDisplay } from "./time-display"
import { PlayerControls } from "./player-controls"

interface MusicPlayerProps {
  tracks: Track[]
  className?: string
}

export function MusicPlayer({ tracks, className = "" }: MusicPlayerProps) {
  const { playerState, loadTrack, play, pause, seek, setVolume, getFrequencyData } = useMusicPlayer()

  const { isPlaying, isLoading, currentTime, duration, volume, currentTrack } = playerState

  // Tambah state untuk index track
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0)

  // Load first track on mount
  useEffect(() => {
    if (tracks.length > 0 && !currentTrack) {
      loadTrack(tracks[0])
      setCurrentTrackIndex(0)
    }
  }, [tracks, currentTrack, loadTrack])

  // Fungsi next/previous looping
  const handleNext = () => {
    if (tracks.length === 0) return
    const nextIndex = (currentTrackIndex + 1) % tracks.length
    setCurrentTrackIndex(nextIndex)
    loadTrack(tracks[nextIndex])
  }

  const handlePrevious = () => {
    if (tracks.length === 0) return
    const prevIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length
    setCurrentTrackIndex(prevIndex)
    loadTrack(tracks[prevIndex])
  }

  // Update currentTrackIndex jika currentTrack berubah manual (misal dari playlist)
  useEffect(() => {
    if (!currentTrack) return
    const idx = tracks.findIndex((t) => t.id === currentTrack.id)
    if (idx !== -1 && idx !== currentTrackIndex) {
      setCurrentTrackIndex(idx)
    }
  }, [currentTrack, tracks, currentTrackIndex])

  // Handler untuk slider volume
  const handleVolumeSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number(e.target.value)
    setVolume(newVolume)
  }

  const getPlayerStatus = (): PlayerStatus => {
    if (isLoading) return "loading"
    if (isPlaying) return "playing"
    return "paused"
  }

  const playerStatus = getPlayerStatus()

  // Container variants for background and shadow transitions
  const containerVariants = {
    playing: {
      backgroundColor: "rgb(17 24 39)", // gray-900
      boxShadow: "0 25px 50px -12px rgba(168, 85, 247, 0.25), 0 0 0 1px rgba(168, 85, 247, 0.1)",
      transition: { duration: 0.3 },
    },
    paused: {
      backgroundColor: "rgb(17 24 39)", // gray-900
      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(75, 85, 99, 0.1)",
      transition: { duration: 0.3 },
    },
    loading: {
      backgroundColor: "rgb(17 24 39)", // gray-900
      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(75, 85, 99, 0.05)",
      transition: { duration: 0.3 },
    },
  }

  return (
    <motion.div
      className={`w-full max-w-md mx-auto rounded-3xl p-6 border border-gray-800 ${className}`}
      variants={containerVariants}
      animate={playerStatus}
      initial="paused"
      style={{ willChange: "box-shadow, background-color" }}
    >
      {/* Album Art */}
      <div className="mb-6">
        <AlbumArt isPlaying={isPlaying} isLoading={isLoading} className="w-24 h-24 float-left mr-4" />

        {/* Track Info and Equalizer Container */}
        <div className="overflow-hidden">
          <TrackInfo track={currentTrack} className="mb-3" />

          {/* Equalizer */}
          <AnimatePresence mode="wait">
            <motion.div
              key={playerStatus}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              <Equalizer isPlaying={isPlaying} isLoading={isLoading} getFrequencyData={getFrequencyData} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Clear float */}
      <div className="clear-both"></div>

      {/* Progress Bar */}
      <div className="mb-4">
        <ProgressBar
          currentTime={currentTime}
          duration={duration}
          onSeek={seek}
          isPlaying={isPlaying}
          isLoading={isLoading}
          className="mb-2"
        />
        <TimeDisplay currentTime={currentTime} duration={duration} />
      </div>

      {/* Player Controls */}
      <PlayerControls
        isPlaying={isPlaying}
        isLoading={isLoading}
        onPlay={play}
        onPause={pause}
        onPrevious={handlePrevious}
        onNext={handleNext}
        volume={volume}
        onVolumeChange={setVolume}
        onVolumeSliderChange={handleVolumeSliderChange}
        className="mb-4"
      />

      {/* Status Indicator */}
      <motion.div
        className="text-center text-xs text-gray-500"
        animate={{
          opacity: playerStatus === "loading" ? [0.5, 1, 0.5] : 1,
        }}
        transition={{
          duration: 1,
          repeat: playerStatus === "loading" ? Number.POSITIVE_INFINITY : 0,
        }}
      >
        {playerStatus === "loading" && "Loading..."}
        {playerStatus === "playing" && "Now Playing"}
        {playerStatus === "paused" && "Paused"}
      </motion.div>
    </motion.div>
  )
}
