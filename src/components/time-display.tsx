"use client"

interface TimeDisplayProps {
  currentTime: number
  duration: number
  className?: string
}

export function TimeDisplay({ currentTime, duration, className = "" }: TimeDisplayProps) {
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  return (
    <div className={`flex justify-between text-sm text-gray-400 ${className}`}>
      <span>{formatTime(currentTime)}</span>
      <span>{formatTime(duration)}</span>
    </div>
  )
}
