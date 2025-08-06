"use client"
import { useTheme } from "next-themes"
import Image from "next/image"
import { useEffect, useState } from "react"
import logoDark from '@/public/logo/logo-dark.svg'
import logoLight from '@/public/logo/logo-light.svg'

export function DynamicLogo({ width = 32, height = 32 }) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  
  // After mounting, we can safely show the theme-dependent content
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    // Return a placeholder or default logo during SSR
    return (
      <div style={{ width, height }} />
    )
  }

  return (
    <Image 
      src={resolvedTheme === 'dark' ? logoDark : logoLight}
      alt="D&A Workspace" 
      width={width} 
      height={height} 
    />
  )
}