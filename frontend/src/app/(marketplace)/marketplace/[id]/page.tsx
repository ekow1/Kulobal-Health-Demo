"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, ShieldCheck } from "lucide-react"
import { notFound, useParams } from "next/navigation"

import { products } from "@/lib/products"
import { Button } from "@/components/ui/button"
import { useCartStore } from "@/store/cart-store"
import { CartNotification } from "@/components/marketplace/cart-notification"
import { CartSummary } from "@/components/marketplace/cart-summary"
import { FloatingCartButton } from "@/components/marketplace/floating-cart-button"

export default function ProductDetail() {
  const [selectedImage, setSelectedImage] = useState(0)
  const [notification, setNotification] = useState<{ show: boolean; productName: string; message?: string }>({
    show: false,
    productName: "",
    message: "",
  })

  const { addItem, totalItems } = useCartStore()
  const { id } = useParams()

  const product = products.find((p) => p.id === id)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!product) return

    const wasEmpty = totalItems === 0
    addItem(product)
    setNotification({
      show: true,
      productName: product.name,
      message: wasEmpty ? "Added to Cart!" : "Updated Cart!",
    })

    // Auto-hide notification after 3 seconds
    setTimeout(() => {
      setNotification({ show: false, productName: "", message: "" })
    }, 3000)
  }

  if (!product) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-white dark:bg-background">
      {/* Full Size Image Modal */}
      {/* Modal code removed as per updates */}

      <div className="max-w-7xl mx-auto px-6 py-8 mt-16">
        {/* Back Button */}
        <div className="mb-8">
          <Link
            href="/marketplace"
            className="flex items-center gap-2 text-lg font-medium text-gray-900 hover:text-gray-700 dark:text-foreground dark:hover:text-foreground/80"
          >
            <ArrowLeft className="h-5 w-5" />
            Back
          </Link>
        </div>

        {/* Debug Info - Remove this in production */}
        {/* Debug info code removed as per updates */}

        <div className="grid grid-cols-12 gap-4">
          {/* Thumbnail Gallery - Left Side */}
          <div className="col-span-2  ">
            <div className="w-full space-y-4 flex flex-col items-center  h-[70%]">
              {product.images.map((image, index) => (
                <button
                  key={`thumbnail-${index}`}
                  onClick={() => setSelectedImage(index)}
                  className={`w-[90%]  aspect-square rounded-lg border-2 overflow-hidden transition-all ${
                    selectedImage === index
                      ? "border-emerald-500 ring-2 ring-emerald-200"
                      : "border-gray-200 hover:border-gray-300 dark:border-border"
                  }`}
                >
                  <div
                    className="w-full h-full bg-gray-50 dark:bg-muted"
                    style={{
                      backgroundImage: `url(${image || "/placeholder.svg?height=120&width=120"})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                    }}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Main Product Image - Center */}
          <div className="col-span-6">
            <div className="aspect-square bg-gray-50 dark:bg-muted rounded-lg overflow-hidden">
              <div
                className="w-full h-full"
                style={{
                  backgroundImage: `url(${product.images[selectedImage] || "/placeholder.svg?height=600&width=600"})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              />
            </div>
          </div>

          {/* Product Information - Right Side */}
          <div className="col-span-4 space-y-6 items-center px-10">
            {/* Product Title and Price */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-foreground mb-2">{product.name}</h1>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-2xl font-bold text-gray-900 dark:text-foreground">
                  GH₵ {product.price.toFixed(2)}
                </span>
                <span className="text-gray-500 dark:text-muted-foreground flex items-center gap-1">
                  <span className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                  Per {product.unit || "Box"}
                </span>
              </div>
            </div>

            {/* Brand */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-foreground mb-2">Brand</h3>
              <p className="text-gray-600 dark:text-muted-foreground">{product.brand}</p>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-foreground mb-3">Description</h3>
              <p className="text-gray-600 dark:text-muted-foreground">{product.description}</p>
            </div>

            {/* Add to Cart Button */}
            <Button
              onClick={handleAddToCart}
              className="w-[80%] bg-emerald-600 hover:bg-emerald-700 text-white py-8 text-lg font-semibold rounded-lg"
              disabled={product.stockQuantity === 0}
            >
              {product.stockQuantity > 0 ? "Add to cart" : "Out of Stock"}
            </Button>

            {/* Secured Payment */}
            <div className="flex items-center gap-2 text-gray-600 dark:text-muted-foreground">
              <ShieldCheck className="w-5 h-5" />
              <span className="text-sm">100% Secured Payment</span>
            </div>

            {/* Product Details */}
            <div className="border-t dark:border-border pt-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-foreground mb-3">Product Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-muted-foreground">Product ID:</span>
                  <span className="font-medium dark:text-foreground">{product.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-muted-foreground">Category:</span>
                  <span className="font-medium dark:text-foreground">{product.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-muted-foreground">Stock:</span>
                  <span className="font-medium dark:text-foreground">
                    {product.stockQuantity} {product.unit || "items"} available
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cart Notification */}
      <CartNotification
        show={notification.show}
        productName={notification.productName}
        message={notification.message}
        onClose={() => setNotification({ show: false, productName: "", message: "" })}
      />
       {/* Cart Summary */}
            <CartSummary />
            {/* Floating Cart Button for Mobile */}
            <FloatingCartButton />
    </div>
  )
}
