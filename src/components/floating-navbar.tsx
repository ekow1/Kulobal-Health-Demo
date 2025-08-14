"use client"

import Link from "next/link"
import { Home, Search, ShoppingCart, LayoutDashboard, User } from "lucide-react"
import { usePathname } from "next/navigation"
import clsx from "clsx"
import { useAuthStore } from "@/store/auth-store"
import { useCartStore } from "@/store/cart-store"

const navigationItems = [
  {
    name: "Home",
    href: "/",
    icon: Home,
  },
  {
    name: "Marketplace",
    href: "/marketplace",
    icon: Search,
  },
  {
    name: "Cart",
    href: "/cart",
    icon: ShoppingCart,
    showBadge: true,
  },
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    requireAuth: true,
  },
  {
    name: "Profile",
    href: "/profile",
    icon: User,
    requireAuth: true,
  },
]

export function FloatingBottomNavbar() {
  const { totalItems } = useCartStore()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/"
    }
    return pathname.startsWith(href)
  }

  // Filter items based on authentication
  const visibleItems = navigationItems.filter((item) => !item.requireAuth || (item.requireAuth && isAuthenticated))

  // Don't show if not authenticated and no items to show
  if (!isAuthenticated && visibleItems.length === 0) {
    return null
  }

  return (
    <>
      {/* Bottom padding to prevent content overlap */}
      <div className="h-16 md:hidden" />

      {/* Floating Bottom Navigation */}
      <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-50 md:hidden">
        <nav className="bg-white/10 dark:bg-gray-900/10 backdrop-blur-xl border border-gray-200/30 dark:border-gray-700/40 rounded-2xl shadow-xl shadow-black/10 dark:shadow-black/30">
          <div className="px-2 py-1.5">
            <div className="flex items-center gap-1">
              {visibleItems.map((item) => {
                const isItemActive = isActive(item.href)
                const Icon = item.icon

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={clsx(
                      "relative flex flex-col items-center justify-center px-3 py-2 rounded-xl transition-all duration-200 ease-out min-w-0 group",
                      "hover:bg-emerald-50/70 dark:hover:bg-emerald-950/40",
                      "active:scale-95",
                      {
                        "bg-emerald-500/15 dark:bg-emerald-500/25": isItemActive,
                      },
                    )}
                  >
                    {/* Icon Container */}
                    <div className="relative mb-0.5">
                      <Icon
                        className={clsx("h-5 w-5 transition-all duration-200 ease-out", {
                          "text-emerald-600 dark:text-emerald-400": isItemActive,
                          "text-gray-500 dark:text-gray-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400":
                            !isItemActive,
                        })}
                      />

                      {/* Cart Badge */}
                      {item.showBadge && totalItems > 0 && (
                        <div className="absolute -top-1.5 -right-1.5 bg-emerald-500 text-white text-[10px] font-bold rounded-full min-w-[16px] h-4 flex items-center justify-center px-1 shadow-md ring-2 ring-white dark:ring-gray-900">
                          {totalItems > 99 ? "99+" : totalItems}
                        </div>
                      )}
                    </div>

                    {/* Label */}
                    <span
                      className={clsx("text-[10px] font-medium leading-tight transition-all duration-200 ease-out", {
                        "text-emerald-600 dark:text-emerald-400": isItemActive,
                        "text-gray-500 dark:text-gray-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400":
                          !isItemActive,
                      })}
                    >
                      {item.name}
                    </span>

                    {/* Active Indicator */}
                    {isItemActive && (
                      <div className="absolute inset-0 rounded-xl ring-1 ring-emerald-500/30 dark:ring-emerald-400/30" />
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        </nav>
      </div>
    </>
  )
}
