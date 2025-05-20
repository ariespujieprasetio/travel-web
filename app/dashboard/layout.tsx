"use client"

import { ReactNode } from "react"
import { useAuthStore } from "@/src/store/authStore"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

interface ChatLayoutProps {
  children: ReactNode
}

export default function ChatLayout({ children }: ChatLayoutProps) {
  const { isAuthenticated } = useAuthStore()
  const router = useRouter()
  // State to toggle mobile menu
  
  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  return (
    <div className="min-h-screen bg-gray-50">
           {children}

    </div>
  )
}