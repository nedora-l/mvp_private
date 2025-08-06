"use client"

import React, { useState, useCallback, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Mic, MicOff, Send, AlertCircle, CheckCircle, Radio, Volume2 } from "lucide-react"
import { useAudio } from "@/hooks/useAudio"
import { AudioPlayer } from "@/components/audi-player"

interface AudioData {
  mimeType: string
  data: string // base64 encoded audio
}

interface Message {
  id: string
  type: "user" | "assistant"
  content: string
  timestamp: Date
  audioBlob?: Blob
  audioBase64?: string
  audioMimeType?: string
}

export default function GeminiLiveStreamApp() {
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [inputMessage, setInputMessage] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [audioSupported, setAudioSupported] = useState(true)

  // Audio context for playing Gemini responses
  const audioContextRef = useRef<AudioContext | null>(null)

  // Initialize AudioContext
  useEffect(() => {
    if (typeof window !== 'undefined' && !audioContextRef.current) {
      try {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
      } catch (e) {
        console.error("Web Audio API is not supported by this browser.", e)
      }
    }
  }, [])
  // Helper function to fetch audio as base64
  const fetchAudioAsBase64 = async (audioUrl: string): Promise<string | undefined> => {
    try {
      const response = await fetch(audioUrl)
      if (!response.ok) {
        throw new Error(`Failed to fetch audio: ${response.statusText}`)
      }
      const blob = await response.blob()
      return new Promise((resolve) => {
        const reader = new FileReader()
        reader.onloadend = () => {
          if (typeof reader.result === 'string') {
            // Extract base64 part from data URL
            const base64 = reader.result.split(',')[1]
            resolve(base64)
          } else {
            resolve(undefined)
          }
        }
        reader.onerror = () => resolve(undefined)
        reader.readAsDataURL(blob)
      })
    } catch (error) {
      console.error("Error fetching audio:", error)
      return undefined
    }
  }
  const playAudioData = async (base64Data: string, mimeType: string, audioContext: AudioContext) => {
    try {
      const binaryString = atob(base64Data)
      const arrayBuffer = new ArrayBuffer(binaryString.length)
      const uint8Array = new Uint8Array(arrayBuffer)
      for (let i = 0; i < binaryString.length; i++) {
        uint8Array[i] = binaryString.charCodeAt(i)
      }

      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)
      const source = audioContext.createBufferSource()
      source.buffer = audioBuffer
      source.connect(audioContext.destination)
      source.start()
      console.log("Audio playback started for mimeType:", mimeType)
    } catch (e) {
      console.error("Error playing audio:", e, "MIME Type:", mimeType, "Data (first 100 chars):", base64Data.substring(0,100))
    }
  }

  // Initialize audio hooks
  const {
    isRecording,
    recordingTime,
    formattedTime,
    recordedAudio,
    error: audioError,
    startRecording,
    stopRecording,
    clearError: clearAudioError,  } = useAudio({
    onAudioAvailable: async (blob, base64) => {
      if (!isConnected) return

      try {
        // Add user audio message to chat
        const userMessage: Message = {
          id: Date.now().toString(),
          type: "user",
          content: "[Voice message]",
          timestamp: new Date(),
          audioBlob: blob,
          audioMimeType: blob.type,
        }

        setMessages((prev) => [...prev, userMessage])
        setIsStreaming(true)        // Send audio to API
        if (base64) {
          const response = await fetch("/api/gemini-stream", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              action: "send_audio",
              audioBase64: base64,
            }),
          })

          if (!response.ok) {
            throw new Error(`Failed to send audio: ${response.statusText}`)
          }

          const data = await response.json()

          // Add assistant response
          const assistantMessage: Message = {
            id: (Date.now() + 1).toString(),
            type: "assistant",
            content: data.response || "I received your audio message.",
            timestamp: new Date(),
            audioBase64: data.audioResponse?.data,
            audioMimeType: data.audioResponse?.mimeType || "audio/wav",
          }

          setMessages((prev) => [...prev, assistantMessage])

          // Play audio response if available and AudioContext is ready
          if (data.audioResponse?.data && audioContextRef.current) {
            try {
              await playAudioData(data.audioResponse.data, data.audioResponse.mimeType || "audio/wav", audioContextRef.current)
            } catch (audioError) {
              console.error("Failed to play audio response:", audioError)
            }
          }
        }
      } catch (err) {
        console.error("Failed to send audio:", err)
        setError(err instanceof Error ? err.message : "Failed to send audio")
      } finally {
        setIsStreaming(false)
      }
    },
    onError: (err) => {
      console.error("Audio recording error:", err)
      setError(`Audio recording error: ${err.message}`)
    },
  })

  // Check for audio support
  useEffect(() => {
    const checkAudioSupport = async () => {
      try {
        // Check if getUserMedia is supported
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          setAudioSupported(false)
          console.error("getUserMedia is not supported in this browser")
          return
        }

        // Check if MediaRecorder is supported
        if (typeof MediaRecorder === "undefined") {
          setAudioSupported(false)
          console.error("MediaRecorder is not supported in this browser")
          return
        }

        // Check if we can get audio permissions
        await navigator.mediaDevices
          .getUserMedia({ audio: true })
          .then((stream) => {
            // Stop all tracks immediately after checking
            stream.getTracks().forEach((track) => track.stop())
            setAudioSupported(true)
          })
          .catch((err) => {
            console.error("Audio permission error:", err)
            setAudioSupported(false)
          })
      } catch (err) {
        console.error("Error checking audio support:", err)
        setAudioSupported(false)
      }
    }

    checkAudioSupport()
  }, [])

  const clearError = useCallback(() => {
    setError(null)
    clearAudioError()
  }, [clearAudioError])

  const connect = useCallback(async () => {
    if (isConnecting || isConnected) return

    setIsConnecting(true)
    setError(null)

    try {
      // Check if API key is available
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

      // Simulate connection process
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setIsConnected(true)
      setIsConnecting(false)

      // Add welcome message
      setMessages([
        {
          id: Date.now().toString(),
          type: "assistant",
          content: "Hello! I'm connected and ready to chat. You can send me text messages or record audio.",
          timestamp: new Date(),
        },
      ])
    } catch (err) {
      console.error("Failed to connect:", err)
      setError(err instanceof Error ? err.message : "Failed to connect to Gemini Live")
      setIsConnecting(false)
    }
  }, [isConnecting, isConnected])

  const disconnect = useCallback(() => {
    setIsConnected(false)
    setIsStreaming(false)
    setMessages([])
  }, [])

  const handleSendMessage = useCallback(async () => {
    if (!inputMessage.trim() || !isConnected) return

    // Add user message to chat
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputMessage,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setIsStreaming(true)

    try {
      // Send message to API
      const response = await fetch("/api/gemini-stream", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "send_message",
          message: inputMessage,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to send message")
      }      const data = await response.json()

      // Add assistant response
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: data.response || `I received your message: "${inputMessage}".`,
        timestamp: new Date(),
        audioBase64: data.audioResponse?.data,
        audioMimeType: data.audioResponse?.mimeType || "audio/wav",
      }

      setMessages((prev) => [...prev, assistantMessage])
      
      // Play audio response if available and AudioContext is ready
      if (data.audioResponse?.data && audioContextRef.current) {
        try {
          await playAudioData(data.audioResponse.data, data.audioResponse.mimeType || "audio/wav", audioContextRef.current)
        } catch (audioError) {
          console.error("Failed to play audio response:", audioError)
        }
      }
      
      setInputMessage("")
    } catch (err) {
      console.error("Failed to send message:", err)
      setError(err instanceof Error ? err.message : "Failed to send message")
    } finally {
      setIsStreaming(false)
    }
  }, [inputMessage, isConnected])

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const getStatusBadge = () => {
    if (isConnecting) {
      return (
        <Badge variant="secondary" className="gap-2">
          <Loader2 className="w-3 h-3 animate-spin" />
          Connecting
        </Badge>
      )
    }
    if (isConnected && isStreaming) {
      return (
        <Badge className="gap-2 bg-red-500 hover:bg-red-600">
          <Radio className="w-3 h-3" />
          Live Streaming
        </Badge>
      )
    }
    if (isConnected) {
      return (
        <Badge className="gap-2 bg-green-500 hover:bg-green-600">
          <CheckCircle className="w-3 h-3" />
          Connected
        </Badge>
      )
    }
    return (
      <Badge variant="outline" className="gap-2">
        <MicOff className="w-3 h-3" />
        Disconnected
      </Badge>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">  Live Stream</h1>
          <p className="text-lg text-gray-600">Real-time AI conversation with  MCP Client</p>
          <div className="flex justify-center">{getStatusBadge()}</div>
        </div>

        {/* Error Alert */}
        {(error || audioError) && (
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="flex justify-between items-center text-red-800">
              {error || audioError}
              <Button variant="outline" size="sm" onClick={clearError}>
                Dismiss
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Audio Support Warning */}
        {!audioSupported && (
          <Alert className="border-yellow-200 bg-yellow-50">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              Audio recording is not supported in your browser or microphone access is blocked. You can still use text
              messaging.
            </AlertDescription>
          </Alert>
        )}

        {/* Main Control Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mic className="w-5 h-5" />
              Live Stream Control
            </CardTitle>
            <CardDescription>
              Start a live streaming session with Gemini AI. Click the button below to begin.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4 justify-center">
              {!isConnected ? (
                <Button onClick={connect} disabled={isConnecting} size="lg" className="gap-2 px-8">
                  {isConnecting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <Radio className="w-4 h-4" />
                      Start Live Stream
                    </>
                  )}
                </Button>
              ) : (
                <Button onClick={disconnect} variant="destructive" size="lg" className="gap-2 px-8">
                  <MicOff className="w-4 h-4" />
                  Stop Stream
                </Button>
              )}
            </div>

            {isConnected && audioSupported && (
              <div className="flex flex-col items-center gap-2 mt-4">
                <div className="flex gap-2">
                  {!isRecording ? (
                    <Button onClick={startRecording} variant="outline" className="gap-2" disabled={!isConnected}>
                      <Mic className="w-4 h-4" />
                      Record Audio
                    </Button>
                  ) : (
                    <Button onClick={stopRecording} variant="destructive" className="gap-2">
                      <MicOff className="w-4 h-4" />
                      Stop Recording {formattedTime}
                    </Button>
                  )}
                </div>

                {isRecording && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="animate-pulse text-red-500">●</span>
                    <span>Recording audio...</span>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Chat Interface */}
        {isConnected && (
          <Card>
            <CardHeader>
              <CardTitle>Live Conversation</CardTitle>
              <CardDescription>Send messages to Gemini and see real-time responses</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Messages */}
              <div className="h-96 w-full border rounded-md p-4 overflow-y-auto bg-white">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    No messages yet. Send a message or record audio to start the conversation!
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg px-4 py-2 ${
                            message.type === "user" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-900"
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>

                          {(message.audioBlob || message.audioBase64) && (
                            <div className="mt-2 pt-2 border-t border-gray-200">
                              <div className="flex items-center gap-2 mb-1">
                                <Volume2 className="h-3 w-3" />
                                <span className="text-xs">
                                  {message.type === "user" ? "Your voice message" : "AI audio response"}
                                </span>
                              </div>
                              <AudioPlayer
                                audioBlob={message.audioBlob}
                                audioBase64={message.audioBase64}
                                mimeType={message.audioMimeType}
                                autoPlay={message.type === "assistant"}
                              />
                            </div>
                          )}

                          <p className="text-xs opacity-70 mt-1">{message.timestamp.toLocaleTimeString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Input */}
              <div className="flex gap-2">
                <Textarea
                  placeholder="Type your message here..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1"
                  rows={2}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || !isConnected || isStreaming}
                  className="gap-2"
                >
                  {isStreaming ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  Send
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Status Information */}
        <Card>
          <CardHeader>
            <CardTitle>Connection Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : "bg-gray-300"}`} />
                <span>Connection: {isConnected ? "Active" : "Inactive"}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isStreaming ? "bg-red-500 animate-pulse" : "bg-gray-300"}`} />
                <span>Streaming: {isStreaming ? "Active" : "Inactive"}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isRecording ? "bg-red-500 animate-pulse" : "bg-gray-300"}`} />
                <span>Recording: {isRecording ? "Active" : "Inactive"}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${audioSupported ? "bg-green-500" : "bg-yellow-500"}`} />
                <span>Audio Support: {audioSupported ? "Available" : "Unavailable"}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Debug Information */}
        <Card>
          <CardHeader>
            <CardTitle>Audio Debug Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm space-y-2">
              <p>
                <strong>Browser:</strong> {typeof window !== "undefined" ? window.navigator.userAgent : "Unknown"}
              </p>
              <p>
                <strong>MediaRecorder Support:</strong> {typeof MediaRecorder !== "undefined" ? "Yes" : "No"}
              </p>
              <p>
                <strong>AudioContext Support:</strong> {typeof AudioContext !== "undefined" ? "Yes" : "No"}
              </p>
              <p>
                <strong>MediaDevices Support:</strong>{" "}
                {typeof navigator !== "undefined" && navigator.mediaDevices ? "Yes" : "No"}
              </p>
              <p>
                <strong>getUserMedia Support:</strong>{" "}
                {typeof navigator !== "undefined" && 
                 navigator.mediaDevices && 
                 typeof navigator.mediaDevices.getUserMedia === "function" ? "Yes" : "No"}
              </p>
              <p>
                <strong>Last Recorded Audio:</strong>{" "}
                {recordedAudio ? `${recordedAudio.size} bytes, type: ${recordedAudio.type}` : "None"}
              </p>
              <p>
                <strong>Audio Test:</strong>{" "}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const audio = new Audio(
                      "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=",
                    )
                    audio
                      .play()
                      .then(() => console.log("Test audio played"))
                      .catch((err) => console.error("Test audio failed:", err))
                  }}
                >
                  Play Test Sound
                </Button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
