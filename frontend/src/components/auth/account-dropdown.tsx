"use client"

import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  User,
  Package,
  CreditCard,
  Calendar,
  Settings,
  LogOut,
  ChevronDown,
  MapPin,
  Building2,
  Mail,
} from "lucide-react"
import { useAuthStore } from "@/store/auth-store"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"

export default function Profile() {
  const user = useAuthStore((state) => state.user)
  const { logout } = useAuthStore()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      // Assume logout returns void or just performs the action
      await logout()
      router.push("/") // Redirect to home
      toast.success("Logged out successfully")
    } catch (error) {
      console.error("Logout failed:", error)
      toast.error("Logout failed")
    }
  }

  console.log(user)

  if (!user) return null

  const isPharmacy = user.role === "pharmacy"
  const displayName = isPharmacy ? user.businessName : user.ownerName || "User"
  const displayEmail = user.email
  const avatarFallback = isPharmacy
    ? user.businessName?.substring(0, 2).toUpperCase() || "PH"
    : user.ownerName?.substring(0, 2).toUpperCase() || "U"

  return (
    <div className="relative">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex items-center space-x-3 px-3 py-2 h-auto border-0 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 focus:bg-gray-100 dark:focus:bg-gray-800"
          >
            <Avatar className="">
              <AvatarImage src={user.avatar || "/placeholder.svg"} alt="User avatar" />
              <AvatarFallback className="bg-gradient-to-br from-green-500 to-blue-600 border-0 text-white text-sm font-medium">
                {avatarFallback}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-start">
              <span className="text-sm font-medium text-foreground">{displayName}</span>
              <div className="flex items-center space-x-1">
                {isPharmacy && user.location && (
                  <>
                    <MapPin className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{user.location}</span>
                  </>
                )}
                {!isPharmacy && <span className="text-xs text-muted-foreground">{displayEmail}</span>}
              </div>
            </div>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-72" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex items-start space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user.avatar || "/placeholder.svg"} alt="User avatar" />
                <AvatarFallback className="bg-gradient-to-br from-green-500 to-blue-600 text-white font-medium">
                  {avatarFallback}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col space-y-1">
                {isPharmacy ? (
                  <>
                    <div className="flex items-center space-x-2">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm font-medium leading-none text-foreground">{user.businessName}</p>
                    </div>
                    <p className="text-xs leading-none text-muted-foreground">Owner: {user.ownerName}</p>
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      <p className="text-xs leading-none text-muted-foreground">{user.location}</p>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Mail className="h-3 w-3 text-muted-foreground" />
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-sm font-medium leading-none text-foreground">{displayName}</p>
                    <p className="text-xs leading-none text-muted-foreground">{displayEmail}</p>
                  </>
                )}
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem asChild className="cursor-pointer">
            <Link href="/account" className="flex items-center space-x-2 w-full">
              <User className="h-4 w-4" />
              <span>{isPharmacy ? "Business Profile" : "Profile"}</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild className="cursor-pointer">
            <Link href="/orders" className="flex items-center space-x-2 w-full">
              <Package className="h-4 w-4" />
              <span>Orders</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild className="cursor-pointer">
            <Link href="/payments" className="flex items-center space-x-2 w-full">
              <CreditCard className="h-4 w-4" />
              <span>Payment Methods</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem asChild className="cursor-pointer">
            <Link href="/subscriptions" className="flex items-center space-x-2 w-full">
              <Calendar className="h-4 w-4" />
              <span>Subscriptions</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild className="cursor-pointer">
            <Link href="/settings" className="flex items-center space-x-2 w-full">
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            className="cursor-pointer text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400 focus:bg-red-50 dark:focus:bg-red-950/50"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            <span>Sign out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
