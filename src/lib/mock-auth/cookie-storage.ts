import type { StateStorage } from "zustand/middleware"

// Custom cookie storage for Zustand persist
export const cookieStorage: StateStorage = {
  getItem: (name: string): string | null => {
    if (typeof window === "undefined") return null

    const cookies = document.cookie.split(";")
    const cookie = cookies.find((c) => c.trim().startsWith(`${name}=`))

    if (!cookie) return null

    try {
      return decodeURIComponent(cookie.split("=")[1])
    } catch {
      return null
    }
  },

  setItem: (name: string, value: string): void => {
    if (typeof window === "undefined") return

    // Set cookie with 7 days expiration
    const expires = new Date()
    expires.setDate(expires.getDate() + 7)

    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires.toUTCString()}; path=/; SameSite=Strict; Secure=${window.location.protocol === "https:"}`
  },

  removeItem: (name: string): void => {
    if (typeof window === "undefined") return

    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
  },
}
