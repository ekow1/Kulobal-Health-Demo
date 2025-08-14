"use client"
import { useAuthStore } from "@/lib/mock-auth/auth";
import { DashboardNavbar } from "../dashbord/navbar"
import { Navbar } from "../navbar"

export function ConditionalNavbar() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);


  return isAuthenticated ? <DashboardNavbar /> : <Navbar />
}
