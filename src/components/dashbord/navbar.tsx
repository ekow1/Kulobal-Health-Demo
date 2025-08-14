"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { Bell, Menu, ShoppingCart } from "lucide-react"
import { useCartStore } from "@/store/cart-store"
import Profile from "../auth/account-dropdown"
import { ModeToggle } from "../ui/mode-toggle"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet"
import clsx from "clsx"
import { Button } from "../ui/button"
import { useAuthStore } from "@/lib/mock-auth/auth"
import { usePathname } from "next/navigation"

const navigationLinks = {
  primary: [
    { name: "Home", href: "/" },
    { name: "Dashboard", href: "/dashboard" },
    { name: "Marketplace", href: "/marketplace" },
    { name: "Detection", href: "/detection" },
  ],
  company: [
    { name: "About", href: "/about" },
    { name: "Team", href: "/team" },
    { name: "Contact", href: "/contact" },
  ],
}

export function DashboardNavbar() {
 
  const { totalItems, items: cart } = useCartStore()

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const isActive = (href: string) => pathname === href

 
  return (
    <nav className={"fixed top-0 left-0 right-0 z-50 bg-white shadow max-w-full rounded-sm dark:bg-background"}>
      <div className="flex items-center justify-between px-6 py-4 mx-auto w-[85%]">
        <div className="flex items-center ">
          <Link href="/" className="text-2xl font-bold text-emerald-500">
            <Image
              src="/logo.webp"
              alt="KulobalHealth"
              width={180}
              height={180}
              className="transition-transform duration-300 hover:brightness-110"
            />
          </Link>
        </div>

        <div className="items-center hidden space-x-8 md:flex">
          {navigationLinks.primary.map((item) => (
            <Link key={item.name} href={item.href} className="transition-colors duration-300 hover:text-emerald-500">
              {item.name}
            </Link>
          ))}
          <div className="relative group">
            <button className="transition-colors duration-300 hover:text-emerald-500">Company</button>
            <div className="absolute hidden group-hover:block pt-2 w-48">
              <div className="bg-white shadow-lg rounded-md py-2">
                {navigationLinks.company.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="block px-4 py-2 hover:bg-emerald-50 transition-colors duration-300"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Profile />
          <div className="relative">
            <Link href="/cart">
              <ShoppingCart className="cursor-pointer hover:text-emerald-500 transition-colors" />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-emerald-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>

          <Bell />
          <ModeToggle />
        </div>

        {/* Mobile Menu Trigger */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <SheetHeader>
              <SheetTitle>Navigation</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col space-y-4 mt-6">
              {/* Primary Navigation */}
              <div className="space-y-3">
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Primary</h3>
                {navigationLinks.primary.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={clsx("flex items-center space-x-3 p-3 rounded-lg transition-colors hover:bg-accent", {
                      "bg-accent": isActive(item.href),
                    })}
                  >
                    <span>{item.name}</span>
                  </Link>
                ))}
              </div>

              {/* Company Navigation */}
              <div className="space-y-3">
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Company</h3>
                {navigationLinks.company.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={clsx("flex items-center space-x-3 p-3 rounded-lg transition-colors hover:bg-accent", {
                      "bg-accent": isActive(item.href),
                    })}
                  >
                    <span>{item.name}</span>
                  </Link>
                ))}
              </div>

              {/* Auth Actions for Mobile */}
              {!isAuthenticated && (
                <div className="space-y-3 pt-4 border-t">
                  <Link href="/login" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full">
                      Login
                    </Button>
                  </Link>
                  <Link href="/signup" onClick={() => setIsOpen(false)}>
                    <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white">Create Account</Button>
                  </Link>
                </div>
              )}

              {/* Theme Toggle */}
              <div className="pt-4 border-t">
                <ModeToggle />
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  )
}
