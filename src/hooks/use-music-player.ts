"use client"

import { useState, useRef, useCallback } from "react"
import type { Track, PlayerState } from "@/types/music"

export function useMusicPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [playerState, setPlayerState] = useState<PlayerState>({
    isPlaying: false,
    isLoading: false,
    currentTime: 0,
    duration: 0,
    volume: 1,
    currentTrack: null,
  })

  const [audioContext, setAudioContext] = useState<AudioContext | null>(null)
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null)
  const [dataArray, setDataArray] = useState<Uint8Array | null>(null)

  // Initialize audio context for equalizer
  const initializeAudioContext = useCallback(() => {
    if (!audioRef.current || audioContext) return

    const context = new (window.AudioContext || (window as any).webkitAudioContext)()
    const source = context.createMediaElementSource(audioRef.current)
    const analyserNode = context.createAnalyser()

    analyserNode.fftSize = 256
    const bufferLength = analyserNode.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)

    source.connect(analyserNode)
    analyserNode.connect(context.destination)

    setAudioContext(context)
    setAnalyser(analyserNode)
    setDataArray(dataArray)
  }, [audioContext])

  const loadTrack = useCallback((track: Track) => {
    if (!audioRef.current) {
      audioRef.current = new Audio()
    }

    setPlayerState((prev) => ({
      ...prev,
      isLoading: true,
      currentTrack: track,
    }))

    audioRef.current.src = track.url
    audioRef.current.load()

    const handleLoadedData = () => {
      setPlayerState((prev) => ({
        ...prev,
        isLoading: false,
        duration: audioRef.current?.duration || 0,
      }))
    }

    const handleTimeUpdate = () => {
      setPlayerState((prev) => ({
        ...prev,
        currentTime: audioRef.current?.currentTime || 0,
      }))
    }

    const handleEnded = () => {
      setPlayerState((prev) => ({
        ...prev,
        isPlaying: false,
        currentTime: 0,
      }))
    }

    audioRef.current.addEventListener("loadeddata", handleLoadedData)
    audioRef.current.addEventListener("timeupdate", handleTimeUpdate)
    audioRef.current.addEventListener("ended", handleEnded)

    return () => {
      audioRef.current?.removeEventListener("loadeddata", handleLoadedData)
      audioRef.current?.removeEventListener("timeupdate", handleTimeUpdate)
      audioRef.current?.removeEventListener("ended", handleEnded)
    }
  }, [])

  const play = useCallback(async () => {
    if (!audioRef.current) return

    try {
      // Simulate loading state for 500ms
      setPlayerState((prev) => ({ ...prev, isLoading: true }))

      await new Promise((resolve) => setTimeout(resolve, 500))

      await audioRef.current.play()
      initializeAudioContext()
      setPlayerState((prev) => ({
        ...prev,
        isPlaying: true,
        isLoading: false,
      }))
    } catch (error) {
      console.error("Error playing audio:", error)
      setPlayerState((prev) => ({ ...prev, isLoading: false }))
    }
  }, [initializeAudioContext])

  const pause = useCallback(async () => {
    if (!audioRef.current) return

    // Simulate loading state for 500ms
    setPlayerState((prev) => ({ ...prev, isLoading: true }))

    await new Promise((resolve) => setTimeout(resolve, 500))

    audioRef.current.pause()
    setPlayerState((prev) => ({
      ...prev,
      isPlaying: false,
      isLoading: false,
    }))
  }, [])

  const seek = useCallback((time: number) => {
    if (!audioRef.current) return

    audioRef.current.currentTime = time
    setPlayerState((prev) => ({ ...prev, currentTime: time }))
  }, [])

  const setVolume = useCallback((volume: number) => {
    if (!audioRef.current) return

    audioRef.current.volume = volume
    setPlayerState((prev) => ({ ...prev, volume }))
  }, [])

  const getFrequencyData = useCallback(() => {
    if (!analyser || !dataArray) return null

    analyser.getByteFrequencyData(dataArray)
    return Array.from(dataArray)
  }, [analyser, dataArray])

  return {
    playerState,
    loadTrack,
    play,
    pause,
    seek,
    setVolume,
    getFrequencyData,
  }
}
