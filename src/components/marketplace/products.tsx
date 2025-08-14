"use client"

import type React from "react"

import { useState } from "react"
import { LayoutGrid, List, Search, Trash2Icon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MarketplaceFilters } from "@/components/market-filters"
import { Pagination } from "@/components/pagination"
import { Icons } from "@/components/ui/icons"
import { useMarketplace } from "@/hooks/use-marketplace"
import { useCartStore } from "@/store/cart-store"
import { CartNotification } from "@/components/marketplace/cart-notification"
import { CartSummary } from "@/components/marketplace/cart-summary"
import { FloatingCartButton } from "@/components/marketplace/floating-cart-button"
import Link from "next/link"
import type { Product } from "@/lib/products"

export default function Marketplace() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const {
    filters,
    searchQuery,
    currentPage,
    totalPages,
    paginatedProducts,
    totalProducts,
    handleFiltersChange,
    handleCategoryTabChange,
    handleSearch,
    setSearchQuery,
    clearSearch,
    setCurrentPage,
  } = useMarketplace()

  const { addItem, getItemQuantity, removeItem, totalItems } = useCartStore()
  const [notification, setNotification] = useState<{ show: boolean; productName: string; message?: string }>({
    show: false,
    productName: "",
    message: "",
  })

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault() // Prevent navigation when clicking add to cart
    e.stopPropagation()
    const wasEmpty = totalItems === 0
    addItem(product)
    setNotification({
      show: true,
      productName: product.name,
      message: wasEmpty ? "Added to Cart!" : "Updated Cart!",
    })
  }

  const handleRemoveFromCart = (e: React.MouseEvent, productId: string) => {
    e.preventDefault()
    e.stopPropagation()
    removeItem(productId)
  }

  const categoryTabs = [
    { label: "All Products", value: "All Products" },
    { label: "Rapid Test Kits", value: "Testing Kits" },
    { label: "Vital Monitoring Devices", value: "Vital Monitoring Devices" },
    { label: "Medical Materials", value: "Medical Materials" },
    { label: "Vaccines Antidotes", value: "Vaccines" },
  ]

  return (
    <div className="w-full flex flex-col min-h-screen bg-gray-50 dark:bg-background dark:text-foreground">
      {/* Search Section */}
      <section className="bg-green-50 py-6 md:py-8 px-4 relative dark:bg-primary-900 my-4 md:my-7">
        <div className="absolute inset-0">
          <Icons.Banner className="h-full opacity-20 dark:bg-primary-900 text-green-600" />
        </div>
        <div className="container mx-auto max-w-6xl relative z-10">
          <h1 className="text-center text-xl md:text-2xl font-medium text-green-600 mb-2">
            What product are you looking for?
          </h1>
          <p className="text-center text-xs md:text-sm text-gray-600 mb-4 dark:text-white px-2">
            One-Stop Med Supply Ordering. Find all the medical supplies you need for your pharmacy in one place.
          </p>
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row max-w-xl mx-auto gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for product"
                className="w-full rounded-md border border-gray-300 py-3 md:py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-green-500 text-base"
              />
            </div>
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 md:py-2 rounded-md transition-colors font-medium"
            >
              Search
            </button>
          </form>
          {searchQuery && (
            <div className="flex justify-center mt-4">
              <button onClick={clearSearch} className="text-sm text-gray-600 hover:text-gray-800 underline">
                Clear search
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Main Content */}
      <div className="w-[75%] mx-auto  flex flex-col lg:flex-row gap-4 lg:gap-6 p-4 md:p-6">
        {/* Filters Sidebar - Hidden on mobile, shown as modal or collapsible */}
        <div className=" lg:flex-shrink-0 sm:mb-0 mb-16">
          <MarketplaceFilters onFiltersChange={handleFiltersChange} initialFilters={filters} />
        </div>

        {/* Products Section */}
        <div className="flex-1 space-y-4 md:space-y-6 lg:px-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-lg md:text-xl font-semibold">
              {searchQuery
                ? `Search results for "${searchQuery}" (${totalProducts})`
                : `Featured Products (${totalProducts})`}
            </h2>
            <div className="flex gap-2 self-start sm:self-auto">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("grid")}
                className="bg-emerald-600 hover:bg-emerald-700 h-9 w-9 md:h-10 md:w-10"
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("list")}
                className="h-9 w-9 md:h-10 md:w-10"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex gap-2 flex-wrap">
            {categoryTabs.map((tab) => (
              <Button
                key={tab.value}
                variant={
                  (tab.value === "All Products" && filters.selectedCategories.length === 0) ||
                  filters.selectedCategories.includes(tab.value)
                    ? "default"
                    : "outline"
                }
                onClick={() => handleCategoryTabChange(tab.value)}
                className={`${
                  (tab.value === "All Products" && filters.selectedCategories.length === 0) ||
                  filters.selectedCategories.includes(tab.value)
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-600 dark:hover:bg-emerald-700"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 dark:bg-background"
                } px-3 md:px-4 py-2 rounded-lg font-medium text-sm dark:text-foreground`}
              >
                {tab.label}
              </Button>
            ))}
          </div>

          {/* Active Filters Display */}
          {(searchQuery ||
            filters.selectedCategories.length > 0 ||
            filters.selectedBrands.length > 0 ||
            filters.selectedPriceRange ||
            filters.minPrice ||
            filters.maxPrice) && (
            <div className="flex flex-wrap gap-2">
              {searchQuery && (
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs md:text-sm">
                  Search: &quot;{searchQuery}&quot;
                  <button onClick={clearSearch} className="ml-1 text-green-600 hover:text-green-800">
                    ×
                  </button>
                </span>
              )}
              {filters.selectedCategories.map((category) => (
                <span
                  key={category}
                  className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full text-xs md:text-sm"
                >
                  {category}
                  <button
                    onClick={() =>
                      handleFiltersChange({
                        ...filters,
                        selectedCategories: filters.selectedCategories.filter((c) => c !== category),
                      })
                    }
                    className="ml-1 text-emerald-600 hover:text-emerald-800"
                  >
                    ×
                  </button>
                </span>
              ))}
              {filters.selectedBrands.map((brand) => (
                <span key={brand} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs md:text-sm">
                  {brand}
                  <button
                    onClick={() =>
                      handleFiltersChange({
                        ...filters,
                        selectedBrands: filters.selectedBrands.filter((b) => b !== brand),
                      })
                    }
                    className="ml-1 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              ))}
              {filters.selectedPriceRange && (
                <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs md:text-sm">
                  ₵{filters.selectedPriceRange.replace("-", " - ₵")}
                  <button
                    onClick={() => handleFiltersChange({ ...filters, selectedPriceRange: "" })}
                    className="ml-1 text-purple-600 hover:text-purple-800"
                  >
                    ×
                  </button>
                </span>
              )}
            </div>
          )}

          {/* Products Grid/List */}
          {viewMode === "list" ? (
            <div className="space-y-4">
              {paginatedProducts.map((product) => (
                <div key={product.id} className="relative">
                  <Link href={`/marketplace/${product.id}`} className="block">
                    <div className="border rounded-lg p-4 md:p-6 bg-white hover:shadow-lg transition-shadow cursor-pointer dark:bg-background dark:text-foreground">
                      <div className="flex flex-row gap-4 md:gap-6 items-start">
                        {/* Product Image */}
                        <div
                          className="w-[120px] sm:w-[150px] md:w-[200px] h-[150px] bg-gray-50 rounded-lg flex-shrink-0"
                          style={{
                            backgroundImage: `url(${product.images[0] || "/placeholder.svg"})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            backgroundRepeat: "no-repeat",
                          }}
                        ></div>

                        {/* Product Info */}
                        <div className="flex-1 space-y-3">
                          <div>
                            <h3 className="text-base md:text-lg font-medium text-gray-900 dark:text-card-foreground">
                              {product.name}
                            </h3>
                            <p className="text-sm text-gray-600">{product.brand}</p>
                          </div>

                          <div className="flex flex-col gap-2">
                            <p className="text-lg font-semibold text-gray-900 dark:text-card-foreground">
                              GH₵ {product.price.toFixed(2)}
                            </p>
                            <span
                              className={`text-sm font-medium ${product.stockQuantity > 0 ? "text-orange-600" : "text-red-600"}`}
                            >
                              {product.stockQuantity > 0
                                ? `${product.stockQuantity} ${product.unit || "items"} left`
                                : "out of stock"}
                            </span>
                          </div>

                          <p className="text-sm text-gray-600 leading-relaxed dark:text-card-foreground line-clamp-2 md:line-clamp-none">
                            {product.description}
                          </p>

                          <div className="flex flex-col gap-2" onClick={(e) => e.stopPropagation()}>
                            {getItemQuantity(product.id) > 0 ? (
                              <>
                                <Button
                                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 text-sm md:text-base"
                                  onClick={(e) => handleAddToCart(e, product)}
                                >
                                  In Cart ({getItemQuantity(product.id)})
                                </Button>
                                <Button
                                  variant="outline"
                                  className="border-red-500 text-red-500 hover:bg-red-50 px-4 py-2 text-sm md:text-base"
                                  onClick={(e) => handleRemoveFromCart(e, product.id)}
                                >
                                  Remove
                                </Button>
                              </>
                            ) : (
                              <Button
                                className={`${
                                  product.inStock
                                    ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                } px-6 py-2 text-sm md:text-base`}
                                disabled={!product.inStock}
                                onClick={(e) => handleAddToCart(e, product)}
                              >
                                Add to Cart
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 md:gap-6">
              {paginatedProducts.map((product) => (
                <div key={product.id} className="relative">
                  <Link href={`/marketplace/${product.id}`}>
                    <Card className="w-full overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow">
                      <div
                        className="w-full h-[180px] md:h-[200px] bg-gray-50 dark:bg-neutral-900 relative flex items-center justify-center"
                        style={{
                          backgroundImage: `url(${product.images[0] || "/placeholder.svg"})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          backgroundRepeat: "no-repeat",
                        }}
                      ></div>
                      <CardContent className="p-3 md:p-4 flex-1 flex flex-col justify-between">
                        <h3 className="font-medium group-hover:text-emerald-600 transition-colors text-sm md:text-base line-clamp-2">
                          {product.name}
                        </h3>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-2 gap-1">
                          <p className="font-medium text-sm md:text-base">GH₵ {product.price.toFixed(2)}</p>
                          <span
                            className={`text-xs md:text-sm ${product.stockQuantity > 0 ? "text-orange-600" : "text-red-600"}`}
                          >
                            {product.stockQuantity > 0
                              ? `${product.stockQuantity} ${product.unit || "items"} left`
                              : "out of stock"}
                          </span>
                        </div>
                        <div className="flex  gap-2 mt-3" onClick={(e) => e.stopPropagation()}>
                          {getItemQuantity(product.id) > 0 ? (
                            <>
                              <Button
                                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs md:text-sm py-2 flex-1"
                                onClick={(e) => handleAddToCart(e, product)}
                              >
                                In Cart ({getItemQuantity(product.id)})
                              </Button>
                              <Button
                             
                              
                                className="bg-red-700/70 text-white text-xs py-2"
                                onClick={(e) => handleRemoveFromCart(e, product.id)}
                              >
                               <Trash2Icon/> Remove
                              </Button>
                            </>
                          ) : (
                            <Button
                              className={`w-full text-xs md:text-sm py-2 ${
                                product.inStock
                                  ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
                              }`}
                              disabled={!product.inStock}
                              onClick={(e) => handleAddToCart(e, product)}
                            >
                              Add to cart
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

          {paginatedProducts.length === 0 && (
            <div className="text-center py-8 md:py-12 px-4">
              <p className="text-gray-500 text-base md:text-lg mb-4">
                {searchQuery ? `No products found for "${searchQuery}"` : "No products found matching your filters."}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {searchQuery && (
                  <Button onClick={clearSearch} variant="outline" className="text-sm md:text-base">
                    Clear Search
                  </Button>
                )}
                <Button
                  onClick={() =>
                    handleFiltersChange({
                      selectedCategories: [],
                      selectedBrands: [],
                      selectedPriceRange: "",
                      minPrice: "",
                      maxPrice: "",
                      sortBy: "default",
                    })
                  }
                  variant="outline"
                  className="text-sm md:text-base"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          )}
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
