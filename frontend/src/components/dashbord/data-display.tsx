"use client"

import { Activity } from "lucide-react"
import { useOrderStats } from "@/hooks/use-order-stats"

export function DataDisplay() {
  const orderStats = useOrderStats()
  
  const data = [
    { label: "Pending Orders", value: orderStats.pendingOrders, percentage: orderStats.totalOrders > 0 ? Math.round((orderStats.pendingOrders / orderStats.totalOrders) * 100) : 0, color: "bg-yellow-500" },
    { label: "Processing Orders", value: orderStats.processingOrders, percentage: orderStats.totalOrders > 0 ? Math.round((orderStats.processingOrders / orderStats.totalOrders) * 100) : 0, color: "bg-blue-500" },
    { label: "Shipped Orders", value: orderStats.shippedOrders, percentage: orderStats.totalOrders > 0 ? Math.round((orderStats.shippedOrders / orderStats.totalOrders) * 100) : 0, color: "bg-orange-500" },
    { label: "Delivered Orders", value: orderStats.deliveredOrders, percentage: orderStats.totalOrders > 0 ? Math.round((orderStats.deliveredOrders / orderStats.totalOrders) * 100) : 0, color: "bg-green-500" },
  ]

  return (
    <div className="bg-white border-2 border-green-100 rounded-2xl p-6 dark:bg-transparent dark:border-gray-800 dark:text-white">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Order Statistics</h3>
        <div className="flex items-center space-x-2 bg-green-50 px-4 py-2 rounded-xl border-2 border-green-200 dark:">
          <Activity className="w-4 h-4 text-green-600" />
          <span className="text-sm font-semibold text-green-800">{orderStats.totalOrders} Total</span>
        </div>
      </div>
      <div className="space-y-6 dark:text-white">
        {data.map((item, index) => (
          <div key={index} className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-gray-700 dark:text-white">{item.label}</span>
              <span className="text-lg font-bold text-gray-900 dark:text-white">{item.value}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 border-2 border-gray-100 dark:bg-transparent dark:text-white">
              <div
                className={`${item.color} h-full rounded-full transition-all duration-500 ease-out`}
                style={{ width: `${item.percentage}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>{item.percentage}% of target</span>
              <span>Target: {Math.round(item.value / (item.percentage / 100))}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
