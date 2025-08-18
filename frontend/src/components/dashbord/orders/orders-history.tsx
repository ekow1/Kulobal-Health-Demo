"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Filter, Loader2 } from "lucide-react"
import { useOrdersStore, type Order } from "@/store/orders-store"
import OrderCard from "./order-cards"
import OrderDetails from "./order-details"

type TabType = "all" | "pending" | "processing" | "shipped" | "delivered" | "cancelled"

export default function Component() {
  const [activeTab, setActiveTab] = useState<TabType>("all")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const { orders, isLoading, error, fetchOrders } = useOrdersStore()

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order)
  }

  const handleBack = () => {
    setSelectedOrder(null)
  }

  const filteredOrders = activeTab === "all" ? orders : orders.filter((order) => order.status === activeTab)

  const getTabCount = (tab: TabType) => {
    if (tab === "all") return orders.length
    return orders.filter((order) => order.status === tab).length
  }

  const tabs = [
    { key: "all" as TabType, label: "All Orders" },
    { key: "pending" as TabType, label: "Pending" },
    { key: "processing" as TabType, label: "Processing" },
    { key: "shipped" as TabType, label: "Shipped" },
    { key: "delivered" as TabType, label: "Delivered" },
    { key: "cancelled" as TabType, label: "Cancelled" },
  ]

  if (selectedOrder) {
    return <OrderDetails order={selectedOrder} onBack={handleBack} />
  }

  if (isLoading) {
    return (
      <div className="w-full mx-auto p-6 bg-background min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading orders...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full mx-auto p-6 bg-background min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-4">Error: {error}</p>
          <Button onClick={fetchOrders} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full mx-auto p-6 bg-background min-h-screen">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6 dark:text-white ">Orders & Purchase History</h1>

      {/* Navigation Tabs */}
      <div className="flex items-center justify-between mb-6 dark:text-white">
        <div className="flex items-center space-x-2 dark:text-white">
          {tabs.map((tab) => (
            <Button
              key={tab.key}
              variant={activeTab === tab.key ? "default" : "ghost"}
              className={`rounded-full ${
                activeTab === tab.key
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "text-gray-600 hover:text-gray-900 dark:text-white"
              }`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label} ({getTabCount(tab.key)})
            </Button>
          ))}
        </div>

        <Button variant="outline" className="flex items-center gap-2 text-gray-600 dark:text-white dark:border-0">
          Filter by:
           <Filter className="w-4 h-4" />
        </Button>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => <OrderCard key={order._id} order={order} onViewDetails={handleViewDetails} />)
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No orders found for this category.</p>
          </div>
        )}
      </div>
    </div>
  )
}
