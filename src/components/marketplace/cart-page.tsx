"use client"

import { Button } from "@/components/ui/button"
import { Minus, Plus, ArrowLeft, Trash2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { useCartStore } from "@/store/cart-store"
import Link from "next/link"
import { useState } from "react"

export default function CartPage() {
  const { items, updateQuantity, removeItem, totalItems, totalPrice, clearCart } = useCartStore()
  const [showClearConfirm, setShowClearConfirm] = useState(false)

  const handleClearCart = () => {
    setShowClearConfirm(true)
  }

  const confirmClearCart = () => {
    clearCart()
    setShowClearConfirm(false)
  }

  const cancelClearCart = () => {
    setShowClearConfirm(false)
  }

  if (items.length === 0) {
    return (
      <div className="w-full flex items-center justify-center p-6 bg-white min-h-screen dark:bg-background dark:text-foreground h-screen ">
        <div className="text-center py-12">
          <h1 className="text-2xl font-semibold mb-4">Your cart is empty</h1>
          <p className="text-gray-600 mb-6 dark:text-foreground">Add some products to your cart to get started.</p>
          <Link href="/marketplace">
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const subtotal = totalPrice
  const deliveryFee = 10.0
  const tax = 10.0
  const total = subtotal + deliveryFee + tax

  return (
    <>
      {/* Clear Cart Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-black/20 bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Clear Cart?</h3>
                <p className="text-sm text-gray-600">This action cannot be undone</p>
              </div>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to remove all {totalItems} {totalItems === 1 ? "item" : "items"} from your cart?
              You&apos;ll lose all selected products and quantities.
            </p>
            <div className="flex gap-3">
              <button
                onClick={confirmClearCart}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2.5 px-4 rounded-lg font-medium transition-colors"
              >
                Yes, Clear Cart
              </button>
              <button
                onClick={cancelClearCart}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2.5 px-4 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto p-6 bg-white min-h-screen mt-24 cursor-pointer dark:bg-background">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-6">
          <Link href="/marketplace" className="inline-flex items-center text-emerald-600 hover:text-emerald-700">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Continue Shopping
          </Link>

          {/* <Button
            onClick={handleClearCart}
            variant="outline"
            className="border-red-500 text-red-500 hover:bg-red-50 hover:border-red-600"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear Cart
          </Button> */}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 dark:bg-background dark:text-foreground">
          {/* Cart Items Section */}
          <div className="lg:col-span-2 border  rounded-2xl">
            <div className="flex items-center justify-between mb-6 border-b p-4">
              <h1 className="text-2xl font-semibold dark:text-foreground">My Cart ({totalItems})</h1>
            </div>

            <div className="space-y-4 px-6 py-4">
              {items.map((item) => (
                <Card
                  key={item.id}
                  className="bg-white dark:bg-card shadow-none overflow-hidden mb-6 dark:border-border"
                >
                  <CardContent className="p-0">
                    <div className="flex h-[200px]">
                      {/* Product Image - Takes 1/3 */}
                      <div className="w-1/3 bg-gray-50 dark:bg-muted">
                        <div
                          className="w-full h-full"
                          style={{
                            backgroundImage: `url(${item.product.images[0] || "/placeholder.svg?height=200&width=200"})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            backgroundRepeat: "no-repeat",
                          }}
                        />
                      </div>

                      {/* Product Details and Controls - Takes 2/3 */}
                      <div className="w-2/3 p-6 flex justify-between dark:bg-card">
                        {/* Product Details */}
                        <div className="flex flex-col justify-between items-start  px-4">
                          <div className="">
                            <h3 className="text-xl font-black text-gray-900 dark:text-card-foreground mb-1">
                              {item.product.name}
                            </h3>
                            <p className="text-red-500 dark:text-red-400 text-sm mb-3">
                              {item.product.stockQuantity} {item.product.unit} left
                            </p>
                          </div>

                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300 text-sm font-medium underline cursor-pointer"
                          >
                            Remove from cart
                          </button>
                        </div>

                        {/* Price and Quantity */}
                        <div className="w-[40%] flex flex-col items-end gap-10  px-4 ">
                          <div className="text-xl font-black text-gray-900 dark:text-card-foreground">
                            GH₵ {item.product.price.toFixed(2)}
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center bg-gray-200 dark:bg-muted rounded-full border border-gray-200 dark:border-border p-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-10 w-10 rounded-full hover:bg-gray-100 dark:hover:bg-muted-foreground/10 bg-gray-50 dark:bg-muted-foreground/5 "
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="px-4 py-2 min-w-[3rem] text-center font-medium dark:text-card-foreground">
                              {item.quantity}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-10 w-10 rounded-full hover:bg-gray-100 bg-gray-50 dark:text-background"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              disabled={item.quantity >= item.product.stockQuantity}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Cart Summary Section */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <div className="border-b p-4">
                <h2 className="text-lg font-semibold dark:text-foreground">Cart Summary</h2>
              </div>
              <CardContent className="space-y-4 p-6 dark:text-foreground">
                {/* Keep all the existing content inside CardContent */}
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-foreground">Items</span>
                  <span className="font-semibold dark:text-foreground">{totalItems}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-foreground">Subtotal</span>
                  <span className="font-semibold dark:text-foreground">₵ {subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-foreground">Delivery fee</span>
                  <span className="font-semibold dark:text-foreground">₵ {deliveryFee.toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-foreground">Tax</span>
                  <span className="font-semibold dark:text-foreground">₵ {tax.toFixed(2)}</span>
                </div>

                <hr className="my-4" />

                <div className="flex justify-between items-center text-lg">
                  <span className="font-semibold dark:text-foreground">Total</span>
                  <span className="font-bold dark:text-foreground">₵ {total.toFixed(2)}</span>
                </div>

                <div className="flex gap-3 mt-6">
                  <Link href="/checkout">
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3">
                      Continue to checkout
                    </Button>
                  </Link>

                  <Button
                    onClick={handleClearCart}
                    variant="outline"
                    className="w-full border-red-500 text-red-500 hover:bg-red-50 hover:border-red-600 dark:hover:bg-red-500"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear All Items
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}
