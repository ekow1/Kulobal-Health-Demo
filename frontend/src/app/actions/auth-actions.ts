"use server"

import { apiClient } from "@/lib/api-client"
import { User } from "@/types/user"

// Login action
export async function loginUser(email: string, password: string) {
  try {
    const response = await apiClient.login({ email, password })

    if (!response.success) {
      return { success: false, error: response.message || "Login failed" }
    }

    if (response.data?.user) {
      // Convert API user format to frontend format
      const user: User = {
        id: response.data.user._id, // MongoDB uses _id
        businessName: response.data.user.businessName,
        ownerName: response.data.user.ownerName,
        location: response.data.user.location,
        email: response.data.user.email,
        telephone: response.data.user.telephone,
        avatar: response.data.user.avatar,
        role: response.data.user.role,
        createdAt: response.data.user.createdAt,
      }

      return { success: true, user }
    }

    return { success: false, error: "Login failed. Please try again." }
  } catch (error) {
    console.error("Login error:", error)
    return { success: false, error: "Login failed. Please try again." }
  }
}

// Register action
export async function registerUser(userData: {
  businessName: string
  ownerName: string
  location: string
  email: string
  telephone: string
  password: string
  role: "pharmacy" | "supplier" | "otc" | "admin"
}) {
  try {
    const response = await apiClient.register(userData)

    if (!response.success) {
      return { success: false, error: response.message || "Registration failed" }
    }

    if (response.data?.user) {
      // Convert API user format to frontend format
      const user: User = {
        id: response.data.user._id, // MongoDB uses _id
        businessName: response.data.user.businessName,
        ownerName: response.data.user.ownerName,
        location: response.data.user.location,
        email: response.data.user.email,
        telephone: response.data.user.telephone,
        avatar: response.data.user.avatar,
        role: response.data.user.role,
        createdAt: response.data.user.createdAt,
      }

      return { success: true, user }
    }

    return { success: false, error: "Registration failed. Please try again." }
  } catch (error) {
    console.error("Registration error:", error)
    return { success: false, error: "Registration failed. Please try again." }
  }
}

// Update profile action
export async function updateUserProfile(userId: string, userData: Partial<User>) {
  try {
    const response = await apiClient.updateProfile(userData)

    if (!response.success) {
      return { success: false, error: response.message || "Failed to update profile" }
    }

    if (response.data?.user) {
      // Convert API user format to frontend format
      const user: User = {
        id: response.data.user._id, // MongoDB uses _id
        businessName: response.data.user.businessName,
        ownerName: response.data.user.ownerName,
        location: response.data.user.location,
        email: response.data.user.email,
        telephone: response.data.user.telephone,
        avatar: response.data.user.avatar,
        role: response.data.user.role,
        createdAt: response.data.user.createdAt,
      }

      return { success: true, user }
    }

    return { success: false, error: "Failed to update profile. Please try again." }
  } catch (error) {
    console.error("Update profile error:", error)
    return { success: false, error: "Failed to update profile. Please try again." }
  }
}

// Logout action
export async function logoutUser() {
  try {
    // Call the API logout endpoint to clear the auth cookie
    await apiClient.logout()
    return { success: true }
  } catch (error) {
    console.error("Logout error:", error)
    return { success: false, error: "Logout failed" }
  }
}
