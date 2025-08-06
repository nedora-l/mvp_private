"use client"

import { useState, useCallback, useRef } from "react"
import { GoogleGenAI, type LiveServerMessage, Modality, MediaResolution, type Session } from "@google/genai"

interface UseGeminiLiveStreamProps {
  onMessage?: (content: string) => void
  onAudioData?: (audioData: string, mimeType: string) => void
}

export function useGeminiLiveStream({ onMessage, onAudioData }: UseGeminiLiveStreamProps = {}) {
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sessionRef = useRef<Session | null>(null)
  const responseQueueRef = useRef<LiveServerMessage[]>([])
  const audioParts = useRef<string[]>([])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const handleModelTurn = useCallback(
    (message: LiveServerMessage) => {
      if (message.serverContent?.modelTurn?.parts) {
        const part = message.serverContent.modelTurn.parts[0]

        if (part?.text) {
          onMessage?.(part.text)
        }

        if (part?.inlineData && onAudioData) {
          const inlineData = part.inlineData
          audioParts.current.push(inlineData.data || "")

          // Pass the audio data to the callback
          if (inlineData.data) {
            onAudioData(inlineData.data, inlineData.mimeType || "audio/wav")
          }
        }

        if (part?.fileData) {
          console.log(`File received: ${part.fileData.fileUri}`)
        }
      }

      if (message.serverContent?.turnComplete) {
        setIsStreaming(false)
        audioParts.current = [] // Reset audio parts for next turn
      }
    },
    [onMessage, onAudioData],
  )

  const processResponseQueue = useCallback(() => {
    const processMessages = () => {
      const message = responseQueueRef.current.shift()
      if (message) {
        handleModelTurn(message)
        // Continue processing if there are more messages
        if (responseQueueRef.current.length > 0) {
          setTimeout(processMessages, 10)
        }
      }
    }
    processMessages()
  }, [handleModelTurn])

  const connect = useCallback(async () => {
    if (isConnecting || isConnected) return

    setIsConnecting(true)
    setError(null)

    try {
      const response = await fetch("/api/gemini-stream", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "connect" }),
      })

      if (!response.ok) {
        throw new Error(`Failed to connect: ${response.statusText}`)
      }

      const ai = new GoogleGenAI({
        apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY || "",
      })

      const model = "models/gemini-2.5-flash-preview-native-audio-dialog"

      const config = {
        responseModalities: [Modality.AUDIO, Modality.TEXT],
        mediaResolution: MediaResolution.MEDIA_RESOLUTION_MEDIUM,
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: {
              voiceName: "Zephyr",
            },
          },
        },
        contextWindowCompression: {
          triggerTokens: "25600",
          slidingWindow: { targetTokens: "12800" },
        },
      }

      const session = await ai.live.connect({
        model,
        callbacks: {
          onopen: () => {
            console.log("Gemini Live session opened")
            setIsConnected(true)
            setIsConnecting(false)
          },
          onmessage: (message: LiveServerMessage) => {
            responseQueueRef.current.push(message)
            processResponseQueue()
          },
          onerror: (e: ErrorEvent) => {
            console.error("Gemini Live error:", e.message)
            setError(`Connection error: ${e.message}`)
            setIsConnected(false)
            setIsConnecting(false)
            setIsStreaming(false)
          },
          onclose: (e: CloseEvent) => {
            console.log("Gemini Live session closed:", e.reason)
            setIsConnected(false)
            setIsConnecting(false)
            setIsStreaming(false)
          },
        },
        config,
      })

      sessionRef.current = session
    } catch (err) {
      console.error("Failed to connect to Gemini Live:", err)
      setError(err instanceof Error ? err.message : "Failed to connect to Gemini Live")
      setIsConnecting(false)
    }
  }, [isConnecting, isConnected, processResponseQueue])

  const disconnect = useCallback(() => {
    if (sessionRef.current) {
      sessionRef.current.close()
      sessionRef.current = null
    }
    setIsConnected(false)
    setIsStreaming(false)
    responseQueueRef.current = []
    audioParts.current = []
  }, [])

  const sendMessage = useCallback(
    (message: string) => {
      if (!sessionRef.current || !isConnected) {
        setError("Not connected to Gemini Live")
        return
      }

      try {
        setIsStreaming(true)
        sessionRef.current.sendClientContent({
          turns: [message],
        })
      } catch (err) {
        console.error("Failed to send message:", err)
        setError(err instanceof Error ? err.message : "Failed to send message")
        setIsStreaming(false)
      }
    },
    [isConnected],
  )

  const sendAudio = useCallback(
    async (audioBlob: Blob) => {
      if (!sessionRef.current || !isConnected) {
        setError("Not connected to Gemini Live")
        return
      }

      try {
        setIsStreaming(true)

        // Convert blob to base64
        const reader = new FileReader()
        reader.readAsDataURL(audioBlob)

        reader.onloadend = async () => {
          const base64data = reader.result as string
          // Remove the data URL prefix (e.g., "data:audio/wav;base64,")
          const base64Audio = base64data.split(",")[1]

          // Send the audio data to Gemini
          sessionRef.current?.sendClientContent({
            turns: [
              {
                inlineData: {
                  data: base64Audio,
                  mimeType: audioBlob.type,
                },
              },
            ],
          })
        }
      } catch (err) {
        console.error("Failed to send audio:", err)
        setError(err instanceof Error ? err.message : "Failed to send audio")
        setIsStreaming(false)
      }
    },
    [isConnected],
  )

  return {
    isConnected,
    isConnecting,
    isStreaming,
    error,
    connect,
    disconnect,
    sendMessage,
    sendAudio,
    clearError,
  }
}
