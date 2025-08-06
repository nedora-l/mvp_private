"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      })
      if (!res.ok) throw new Error("Failed to send reset email.")
      setSubmitted(true)
    } catch (err) {
      setError((err as Error).message)
    }
  }

  if (submitted) {
    return <div className="p-6 text-center">Check your email for a reset link.</div>
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 max-w-sm mx-auto">
      <h2 className="text-lg font-semibold">Forgot Password</h2>
      <input
        type="email"
        required
        placeholder="Enter your email"
        className="w-full border rounded px-3 py-2"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <Button type="submit" className="w-full">Send Reset Link</Button>
    </form>
  )
}
