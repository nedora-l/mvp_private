"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, Volume2, VolumeX, AlertCircle } from "lucide-react"

interface AudioPlayerProps {
  audioBlob?: Blob
  audioBase64?: string
  mimeType?: string
  autoPlay?: boolean
}

export function AudioPlayer({ audioBlob, audioBase64, mimeType = "audio/wav", autoPlay = false }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolume] = useState(0.75)
  const [isMuted, setIsMuted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const animationRef = useRef<number | null>(null)
  const audioUrlRef = useRef<string | null>(null)

  // Create audio element
  useEffect(() => {
    const audio = new Audio()
    audio.volume = volume
    audio.muted = isMuted
    audioRef.current = audio

    return () => {
      audio.pause()
      audio.src = ""
      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current)
      }
    }
  }, [volume, isMuted])

  // Set up event listeners
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleLoadedMetadata = () => {
      console.log("Audio metadata loaded, duration:", audio.duration)
      setDuration(audio.duration || 0)
      setIsLoading(false)
    }

    const handleEnded = () => {
      console.log("Audio playback ended")
      setIsPlaying(false)
      setCurrentTime(0)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }

    const handleError = (e: Event) => {
      console.error("Audio playback error:", e)
      setError("Failed to play audio")
      setIsPlaying(false)
      setIsLoading(false)
    }

    const handleCanPlay = () => {
      console.log("Audio can play")
      setIsLoading(false)
      if (autoPlay) {
        audio
          .play()
          .then(() => {
            console.log("Auto-play started")
            setIsPlaying(true)
            requestAnimationFrame(updateProgress)
          })
          .catch((err) => {
            console.error("Auto-play failed:", err)
            setError("Auto-play failed - click play to start")
          })
      }
    }

    audio.addEventListener("loadedmetadata", handleLoadedMetadata)
    audio.addEventListener("ended", handleEnded)
    audio.addEventListener("error", handleError)
    audio.addEventListener("canplay", handleCanPlay)

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata)
      audio.removeEventListener("ended", handleEnded)
      audio.removeEventListener("error", handleError)
      audio.removeEventListener("canplay", handleCanPlay)
    }
  }, [autoPlay])

  // Update progress function
  const updateProgress = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return

    setCurrentTime(audio.currentTime)

    if (!audio.paused) {
      animationRef.current = requestAnimationFrame(updateProgress)
    }
  }, [])

  // Load audio from blob or base64
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    // Clean up previous audio
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current)
      audioUrlRef.current = null
    }

    audio.pause()
    setIsPlaying(false)
    setCurrentTime(0)
    setIsLoading(true)
    setError(null)

    try {
      if (audioBlob && audioBlob.size > 0) {
        console.log("Loading audio from blob:", audioBlob.type, audioBlob.size, "bytes")
        const url = URL.createObjectURL(audioBlob)
        audioUrlRef.current = url
        audio.src = url
      } else if (audioBase64) {
        console.log("Loading audio from base64, length:", audioBase64.length)
        const dataUrl = `data:${mimeType};base64,${audioBase64}`
        audio.src = dataUrl
      } else {
        console.log("No audio data provided")
        setIsLoading(false)
        return
      }

      audio.load()
    } catch (err) {
      console.error("Error loading audio:", err)
      setError("Failed to load audio")
      setIsLoading(false)
    }
  }, [audioBlob, audioBase64, mimeType])

  const togglePlayPause = useCallback(() => {
    const audio = audioRef.current
    if (!audio || isLoading) return

    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    } else {
      audio
        .play()
        .then(() => {
          setIsPlaying(true)
          animationRef.current = requestAnimationFrame(updateProgress)
        })
        .catch((err) => {
          console.error("Play failed:", err)
          setError("Failed to play audio")
        })
    }
  }, [isPlaying, isLoading, updateProgress])

  const onSliderChange = useCallback((value: number[]) => {
    const audio = audioRef.current
    if (!audio) return

    const newTime = value[0]
    audio.currentTime = newTime
    setCurrentTime(newTime)
  }, [])

  const toggleMute = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return

    const newMuted = !isMuted
    audio.muted = newMuted
    setIsMuted(newMuted)
  }, [isMuted])

  const handleVolumeChange = useCallback(
    (value: number[]) => {
      const audio = audioRef.current
      if (!audio) return

      const newVolume = value[0]
      audio.volume = newVolume
      setVolume(newVolume)

      if (newVolume === 0) {
        audio.muted = true
        setIsMuted(true)
      } else if (isMuted) {
        audio.muted = false
        setIsMuted(false)
      }
    },
    [isMuted],
  )

  const formatTime = useCallback((time: number) => {
    if (isNaN(time) || !isFinite(time)) return "00:00"

    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }, [])

  // Don't render if no audio data
  if (!audioBlob && !audioBase64) {
    return null
  }

  // Show error state
  if (error) {
    return (
      <div className="flex items-center space-x-2 p-2 bg-red-50 border border-red-200 rounded text-red-700">
        <AlertCircle className="h-4 w-4" />
        <span className="text-xs">{error}</span>
      </div>
    )
  }

  return (
    <div className="flex flex-col space-y-2 w-full">
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="icon" className="h-8 w-8" onClick={togglePlayPause} disabled={isLoading}>
          {isLoading ? (
            <div className="animate-spin h-4 w-4 border-2 border-gray-400 border-t-transparent rounded-full" />
          ) : isPlaying ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4" />
          )}
        </Button>

        <div className="flex-1">
          <Slider
            value={[currentTime]}
            max={duration || 100}
            step={0.1}
            onValueChange={onSliderChange}
            disabled={isLoading || duration === 0}
          />
        </div>

        <div className="text-xs text-gray-500 w-20 text-right">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={toggleMute}>
          {isMuted ? <VolumeX className="h-3 w-3" /> : <Volume2 className="h-3 w-3" />}
        </Button>

        <div className="w-24">
          <Slider value={[isMuted ? 0 : volume]} max={1} step={0.01} onValueChange={handleVolumeChange} />
        </div>

        {isLoading && <div className="text-xs text-gray-500">Loading audio...</div>}
      </div>
    </div>
  )
}
