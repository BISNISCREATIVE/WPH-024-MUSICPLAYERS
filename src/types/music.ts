export interface Track {
  id: string
  title: string
  artist: string
  duration: number
  url: string
  albumArt?: string
}

export interface PlayerState {
  isPlaying: boolean
  isLoading: boolean
  currentTime: number
  duration: number
  volume: number
  currentTrack: Track | null
}

export type PlayerStatus = "paused" | "loading" | "playing"

export interface AnimationVariants {
  playing: any
  paused: any
  loading: any
}

export interface PlayerAnimationState {
  container: AnimationVariants
  albumArt: AnimationVariants
  equalizer: AnimationVariants
  controls: AnimationVariants
}
