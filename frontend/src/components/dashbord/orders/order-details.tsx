"use client"

import { useState } from "react"
import { ArrowLeft, Clock, Truck, CheckCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent,  CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Order } from "@/store/orders-store"
import CancelOrderModal from "./cancel-order-modal"

interface OrderDetailsProps {
  order: Order
  onBack: () => void
}

export default function OrderDetails({ order, onBack }: OrderDetailsProps) {
  const [showCancelModal, setShowCancelModal] = useState(false)

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "pending":
        return {
          color: "bg-yellow-50 text-yellow-700 border-yellow-200",
          dotColor: "bg-yellow-500",
          icon: <Clock className="w-3 h-3" />,
        }
      case "processing":
        return {
          color: "bg-blue-50 text-blue-700 border-blue-200",
          dotColor: "bg-blue-500",
          icon: <Clock className="w-3 h-3" />,
        }
      case "shipped":
        return {
          color: "bg-orange-50 text-orange-700 border-orange-200",
          dotColor: "bg-orange-500",
          icon: <Truck className="w-3 h-3" />,
        }
      case "delivered":
        return {
          color: "bg-green-50 text-green-700 border-green-200",
          dotColor: "bg-green-500",
          icon: <CheckCircle className="w-3 h-3" />,
        }
      case "cancelled":
        return {
          color: "bg-red-50 text-red-700 border-red-200",
          dotColor: "bg-red-500",
          icon: <XCircle className="w-3 h-3" />,
        }
      default:
        return {
          color: "bg-gray-50 text-gray-700 border-gray-200",
          dotColor: "bg-gray-500",
          icon: <Clock className="w-3 h-3" />,
        }
    }
  }



  const handleCancelOrder = () => {
    setShowCancelModal(true)
  }

  const handleConfirmCancel = (reason: string) => {
    console.log("Order cancelled with reason:", reason)
    // Here you would typically make an API call to cancel the order
    // For now, we'll just log the reason
  }

  const statusConfig = getStatusConfig(order.status)
  
  // Format date
  const orderDate = new Date(order.createdAt).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
  
  // Get the first item for display
  const firstItem = order.items[0]
  const itemsCount = order.items.length
  const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className="w-full min-h-screen p-4 border rounded-2xl">
      <div className="max-w-5xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="sm" className="p-0 h-auto" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>

        {/* Order Summary */}
        <Card className="mb-6 shadow-none border-0 bg-transparent">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              {/* Group 1: Order Number */}
              <div className="flex-shrink-0">
                <div>
                  <p className="text-sm text-gray-600">Order No.</p>
                  <p className="font-medium">{order.orderNumber}</p>
                </div>
              </div>

              {/* Group 2: Date and Total (Vertical Stack) */}
              <div className="flex-1 mx-8 flex justify-center">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-gray-600">Date ordered:</p>
                    <p className="font-medium">{orderDate}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-gray-600">Items:</p>
                    <p className="font-medium">{totalItems} items</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-gray-600">Total:</p>
                    <p className="font-medium">GH₵ {order.total.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              {/* Group 3: Cancel Button */}
              <div className="flex-shrink-0">
                <Button className="bg-orange-400 hover:bg-orange-500 text-white" onClick={handleCancelOrder}>
                  Cancel Order
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Product Details */}
        <div className="grid md:grid-cols-1 gap-4 mb-6">

          <Card className="bg-white shadow-none overflow-hidden duration-200">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-gray-900 leading-tight">
                    {itemsCount === 1 
                      ? firstItem?.name 
                      : `${firstItem?.name} + ${itemsCount - 1} more items`
                    }
                  </h3>
                  <p className="text-sm text-gray-600">
                    Order No.&nbsp;&nbsp;<span className="font-medium text-gray-800">{order.orderNumber}</span>
                  </p>
                  <p className="text-sm text-gray-500">
                    Total: GH₵ {order.total.toFixed(2)} • {totalItems} items
                  </p>
                </div>

                <div className="space-y-2">
                  <Badge
                    className={`${statusConfig.color} hover:${statusConfig.color} px-3 py-1.5 text-xs font-light border inline-flex items-center w-fit rounded-full shadow-none`}
                  >
                    {statusConfig.icon}
                    <span className="ml-2">{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
                  </Badge>
                </div>

                {/* Items List */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-900">Items:</h4>
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {item.name} (x{item.quantity})
                      </span>
                      <span className="font-medium text-gray-900">
                        GH₵ {(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment and Delivery Details */}
        <div className="grid md:grid-cols-2 gap-6 ">
          {/* Payment Details */}
          <Card className="bg-white shadow-none ">
            <CardHeader className="border-b border-gray-200 h-[60px] ">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Payment Details</h2>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-8">Payment Details</h3>

              <div className="space-y-8">
                <div className="space-y-3">
                  <h4 className="text-base font-medium text-gray-900">Payment Method</h4>
                  <p className="text-base text-gray-600 pl-1">{order.paymentDetails.paymentMethod}</p>
                </div>

                <div className="space-y-3">
                  <h4 className="text-base font-medium text-gray-900">Payment Type</h4>
                  <p className="text-base text-blue-600 font-medium pl-1">{order.paymentDetails.paymentType}</p>
                </div>

                <div className="space-y-3">
                  <h4 className="text-base font-medium text-gray-900">Payment Status</h4>
                  <p className="text-base text-gray-600 pl-1">{order.paymentDetails.status}</p>
                </div>

                <div className="space-y-4">
                  <h4 className="text-base font-medium text-gray-900">Details</h4>
                  <div className=" rounded-lg p-6 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-base text-gray-600">Items Total</span>
                      <span className="text-base font-medium text-gray-900">GH₵ {order.total.toFixed(2)}</span>
                    </div>
                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-gray-900">Total</span>
                        <span className="text-lg font-bold text-gray-900">GH₵ {order.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Delivery Details */}
          <Card className="bg-white shadow-none transition-shadow duration-200">
            <CardHeader className="border-b border-gray-200 h-[60px] ">
              <div className="flex items-center justify-between">
       <h3 className="text-xl font-semibold text-gray-900 mb-8">Delivery Details</h3>
              </div>
            </CardHeader>
            <CardContent className="p-8">
             

              <div className="space-y-6">
                <div className="space-y-3">
                  <h4 className="text-base font-medium text-gray-900">Delivery Address</h4>
                  <div className=" rounded-lg p-6">
                    <div className="space-y-3 text-base text-gray-700 leading-relaxed">
                      <p className="font-medium">{order.shippingDetails.pharmacyName}</p>
                      <p>{order.shippingDetails.streetAddress}</p>
                      <p>{order.shippingDetails.pharmacyLocation}</p>
                      {order.shippingDetails.gpsAddress && (
                        <p className="text-sm text-gray-500">GPS: {order.shippingDetails.gpsAddress}</p>
                      )}
                      <p className="font-medium text-gray-900">{order.shippingDetails.phoneNumber}</p>
                      <p className="text-sm text-gray-600">{order.shippingDetails.pharmacyEmail}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Cancel Order Modal */}
      <CancelOrderModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleConfirmCancel}
        orderNumber={order.orderNumber}
      />
    </div>
  )
}
