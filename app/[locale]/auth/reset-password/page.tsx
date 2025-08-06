"use client"

import { useState, Suspense } from "react"
import { Button } from "@/components/ui/button"
import { useRouter, useSearchParams } from "next/navigation"

export function ResetPasswordForm() {
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (password !== confirm) {
      setError("Passwords do not match.")
      return
    }
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password })
      })
      if (!res.ok) throw new Error("Failed to reset password.")
      setSuccess(true)
      setTimeout(() => router.push("/auth/login"), 2000)
    } catch (err) {
      setError((err as Error).message)
    }
  }

  if (success) {
    return <div className="p-6 text-center">Password reset! Redirecting to login...</div>
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 max-w-sm mx-auto">
      <h2 className="text-lg font-semibold">Reset Password</h2>
      <input
        type="password"
        required
        placeholder="New password"
        className="w-full border rounded px-3 py-2"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <input
        type="password"
        required
        placeholder="Confirm new password"
        className="w-full border rounded px-3 py-2"
        value={confirm}
        onChange={e => setConfirm(e.target.value)}
      />
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <Button type="submit" className="w-full">Reset Password</Button>
    </form>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  )
}
