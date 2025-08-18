"use client"

import { ShoppingCart, Minus, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCartStore } from "@/store/cart-store"
import Link from "next/link"
import { useState } from "react"

export function CartSummary() {
  const { items, totalItems, totalPrice, updateQuantity, removeItem } = useCartStore()
  const [isExpanded, setIsExpanded] = useState(false)

  if (totalItems === 0) return null

  return (
    <>
      {/* Backdrop */}
      {isExpanded && <div className="fixed inset-0 bg-black/50 bg-opacity-20 z-40" onClick={() => setIsExpanded(false)} />}

      {/* Cart Summary */}
      <div className={`fixed bottom-4 right-4 z-50 transition-all duration-300 ${isExpanded ? "w-96" : "w-72"}`}>
        <div className="bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden dark:border-background ">
          {/* Header */}
          <div
            className="p-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white cursor-pointer dark:bg-background dark:text-foreground"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <ShoppingCart className="w-6 h-6" />
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {totalItems}
                  </span>
                </div>
                <div>
                  <p className="font-semibold">Shopping Cart</p>
                  <p className="text-sm opacity-90">
                    {totalItems} {totalItems === 1 ? "item" : "items"}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg">₵{totalPrice.toFixed(2)}</p>
                <p className="text-xs opacity-90">{isExpanded ? "Click to collapse" : "Click to expand"}</p>
              </div>
            </div>
          </div>

          {/* Expanded Content */}
          {isExpanded && (
            <div className="max-h-96 overflow-y-auto dark:bg-background dark:text-foreground">
              {/* Cart Items */}
              <div className="p-4 space-y-3">
                {items.slice(0, 3).map((item) => (
                  <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg dark:bg-background dark:text-foreground">
                    {/* Product Image */}
                    <div
                      className="w-12 h-12 bg-gray-200 rounded-lg flex-shrink-0"
                      style={{
                        backgroundImage: `url(${item.product.images[0] || "/placeholder.svg"})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    />

                    {/* Product Info */}
                    <div className="flex-1 min-w-0 dark:text-foreground">
                      <h4 className="font-medium text-sm truncate">{item.product.name}</h4>
                      <p className="text-xs text-gray-600 dark:text-foreground">{item.product.brand}</p>
                      <p className="text-sm font-semibold text-emerald-600 dark:text-foreground">₵{item.product.price.toFixed(2)}</p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center dark:bg-white dark:text-background"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center dark:bg-white dark:text-background"
                        disabled={item.quantity >= item.product.stockQuantity}
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeItem(item.id)}
                      className="w-6 h-6 rounded-full bg-red-100 hover:bg-red-200 text-red-600 flex items-center justify-center"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}

                {/* Show more items indicator */}
                {items.length > 3 && (
                  <div className="text-center py-2">
                    <p className="text-sm text-gray-500">
                      +{items.length - 3} more {items.length - 3 === 1 ? "item" : "items"}
                    </p>
                  </div>
                )}
              </div>

              {/* Summary */}
              <div className="border-t border-gray-100 p-4 space-y-2 dark:text-foreground">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600  dark:text-foreground">Subtotal</span>
                  <span className="font-medium dark:text-foreground">₵{totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-foreground">Delivery</span>
                  <span className="font-medium dark:text-foreground">₵10.00</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-foreground">Tax</span>
                  <span className="font-medium dark:text-foreground">₵10.00</span>
                </div>
                <div className="border-t border-gray-200 pt-2 flex justify-between font-bold">
                  <span>Total</span>
                  <span>₵{(totalPrice + 20).toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="p-4 bg-gray-50 space-y-2 dark:bg-background ">
            <Link href="/cart" className="block">
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium">
                View Full Cart
              </Button>
            </Link>
            {isExpanded && (
              <Link href="/checkout" className="block">
                <Button variant="outline" className="w-full border-emerald-600 text-emerald-600 hover:bg-emerald-50">
                  Quick Checkout
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
