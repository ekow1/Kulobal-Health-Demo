"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronRight, Clock, Truck, CheckCircle, XCircle } from "lucide-react"
import type { Order } from "@/store/orders-store"

interface OrderCardProps {
  order: Order
  onViewDetails: (order: Order) => void
}

export default function OrderCard({ order, onViewDetails }: OrderCardProps) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "pending":
        return {
          color: "bg-yellow-50 text-yellow-700 dark:bg-yellow-950/50 dark:text-yellow-300",
          dotColor: "bg-yellow-500",
          icon: <Clock className="w-3 h-3" />,
        }
      case "processing":
        return {
          color: "bg-blue-50 text-blue-700  dark:bg-blue-950/50 dark:text-blue-300 ",
          dotColor: "bg-blue-500",
          icon: <Clock className="w-3 h-3" />,
        }
      case "shipped":
        return {
          color:
            "bg-orange-50 text-orange-700  dark:bg-orange-950/60 dark:text-orange-300 dark:",
          dotColor: "bg-orange-500",
          icon: <Truck className="w-3 h-3" />,
        }
      case "delivered":
        return {
          color:
            "bg-green-50 text-green-700  dark:bg-green-950/50 dark:text-green-300 ",
          dotColor: "bg-green-500",
          icon: <CheckCircle className="w-3 h-3" />,
        }
      case "cancelled":
        return {
          color: "bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-300 ",
          dotColor: "bg-red-500",
          icon: <XCircle className="w-3 h-3" />,
        }
      default:
        return {
          color: "bg-gray-50 text-gray-700 dark:bg-gray-900 dark:text-gray-300 ",
          dotColor: "bg-gray-500",
          icon: <Clock className="w-3 h-3" />,
        }
    }
  }

  const statusConfig = getStatusConfig(order.status)

  // Get the first item for display
  const firstItem = order.items[0]
  const itemsCount = order.items.length
  const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0)
  
  // Format date
  const orderDate = new Date(order.createdAt).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })

  return (
    <Card className="bg-white dark:bg-background shadow-none overflow-hidden w-full mb-4 ">
      <CardContent className="p-0">
        <div className="flex h-[200px]">
          {/* Order Details - Takes full width */}
          <div className="w-full p-8 flex items-center justify-between">
            <div className="flex-grow">
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 leading-tight">
                  {itemsCount === 1 
                    ? firstItem?.name 
                    : `${firstItem?.name} + ${itemsCount - 1} more items`
                  }
                </h3>
                <p className="text-base text-gray-600 dark:text-gray-400">
                  Order No.&nbsp;&nbsp;
                  <span className="font-medium text-gray-800 dark:text-gray-200">{order.orderNumber}</span>
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Total: GH₵ {order.total.toFixed(2)} • {totalItems} items
                </p>
              </div>

              <div className="mt-6 space-y-3">
                <Badge
                  className={`${statusConfig.color} hover:${statusConfig.color} px-2 py-1.5 text-xs font-light inline-flex items-center w-fit shadow-none rounded-full`}
                >
                  {statusConfig.icon}
                  <span className="ml-2">{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
                </Badge>
                <div className="text-base text-gray-600 dark:text-gray-400 font-medium">{orderDate}</div>
              </div>
            </div>

            {/* View Details Button */}
            <div className="flex-shrink-0 ml-8">
              <Button
                variant="outline"
                onClick={() => onViewDetails(order)}
                className="border-green-600 dark:border-green-500 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-950 flex items-center gap-2 px-6 py-3 text-base font-medium transition-colors duration-200"
              >
                View details
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
