"use client"

import { useState, useRef, useCallback, useEffect } from "react"

interface UseAudioProps {
  onAudioAvailable?: (blob: Blob, base64?: string) => void
  onError?: (error: Error) => void
}

export function useAudio({ onAudioAvailable, onError }: UseAudioProps = {}) {
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [recordedAudio, setRecordedAudio] = useState<Blob | null>(null)
  const [error, setError] = useState<string | null>(null)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Stable cleanup function
  const cleanup = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }

    if (mediaRecorderRef.current) {
      try {
        if (mediaRecorderRef.current.state !== "inactive") {
          mediaRecorderRef.current.stop()
        }
      } catch (err) {
        console.warn("Error stopping media recorder:", err)
      }
      mediaRecorderRef.current = null
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        try {
          track.stop()
        } catch (err) {
          console.warn("Error stopping track:", err)
        }
      })
      streamRef.current = null
    }

    audioChunksRef.current = []
  }, [])

  // Clean up on unmount
  useEffect(() => {
    return cleanup
  }, [cleanup])

  // Helper function to convert blob to base64
  const blobToBase64 = useCallback((blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          const base64 = reader.result.split(",")[1]
          resolve(base64)
        } else {
          reject(new Error("Failed to convert blob to base64"))
        }
      }
      reader.onerror = () => {
        reject(new Error("FileReader error"))
      }
      reader.readAsDataURL(blob)
    })
  }, [])

  const startRecording = useCallback(async () => {
    try {
      cleanup()
      setError(null)
      setRecordingTime(0)

      // Check for browser support
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("getUserMedia is not supported in this browser")
      }

      if (typeof MediaRecorder === "undefined") {
        throw new Error("MediaRecorder is not supported in this browser")
      }

      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        },
      })
      streamRef.current = stream

      // Determine the best MIME type for recording
      const mimeTypes = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4", "audio/ogg;codecs=opus", "audio/wav"]

      let selectedMimeType = ""
      for (const mimeType of mimeTypes) {
        if (MediaRecorder.isTypeSupported(mimeType)) {
          selectedMimeType = mimeType
          break
        }
      }

      if (!selectedMimeType) {
        throw new Error("No supported audio format found")
      }

      console.log("Using MIME type:", selectedMimeType)

      // Create MediaRecorder instance
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: selectedMimeType,
        audioBitsPerSecond: 128000,
      })
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      // Set up event handlers
      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = async () => {
        try {
          if (audioChunksRef.current.length === 0) {
            throw new Error("No audio data recorded")
          }

          const audioBlob = new Blob(audioChunksRef.current, {
            type: selectedMimeType,
          })

          if (audioBlob.size === 0) {
            throw new Error("Recorded audio is empty")
          }

          setRecordedAudio(audioBlob)

          // Convert to base64 and call callback
          if (onAudioAvailable) {
            try {
              const base64 = await blobToBase64(audioBlob)
              onAudioAvailable(audioBlob, base64)
            } catch (err) {
              console.error("Error converting audio to base64:", err)
              onAudioAvailable(audioBlob)
            }
          }
        } catch (err) {
          console.error("Error processing recorded audio:", err)
          const error = err instanceof Error ? err : new Error("Unknown error processing audio")
          setError(error.message)
          if (onError) onError(error)
        }

        setIsRecording(false)
        setRecordingTime(0)
      }

      mediaRecorder.onerror = (event) => {
        console.error("MediaRecorder error:", event)
        const error = new Error(`Recording error: ${event.error?.message || "Unknown error"}`)
        setError(error.message)
        if (onError) onError(error)
        setIsRecording(false)
      }

      mediaRecorder.onstart = () => {
        setIsRecording(true)
      }

      // Start recording
      mediaRecorder.start(100)

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime((prevTime) => prevTime + 1)
      }, 1000)
    } catch (err) {
      console.error("Error starting recording:", err)
      let errorMessage = "Failed to start recording"

      if (err instanceof Error) {
        if (err.name === "NotAllowedError") {
          errorMessage = "Microphone access denied. Please allow microphone access and try again."
        } else if (err.name === "NotFoundError") {
          errorMessage = "No microphone found. Please connect a microphone and try again."
        } else {
          errorMessage = err.message
        }
      }

      setError(errorMessage)
      if (onError) onError(err instanceof Error ? err : new Error(errorMessage))
    }
  }, [cleanup, onAudioAvailable, onError, blobToBase64])

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop()
    }

    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }, [])

  return {
    isRecording,
    recordingTime,
    formattedTime: formatTime(recordingTime),
    recordedAudio,
    error,
    startRecording,
    stopRecording,
    clearError,
  }
}
