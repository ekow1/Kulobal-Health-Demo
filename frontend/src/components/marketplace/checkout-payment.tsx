"use client"

import type React from "react"

import { useState, useEffect, useCallback, useMemo, useRef } from "react"
import Link from "next/link"
import { ArrowLeft, Smartphone, CreditCard, Check, X } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useCartStore } from "@/store/cart-store"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { useAuthStore } from "@/store/auth-store"
import { Button } from "@/components/ui/button"
import { usePaymentStore } from "@/store/payment-store"
import { useOrdersStore } from "@/store/orders-store"
import type { Payment } from "@/types/payment"


export default function CheckoutPage() {
  const { totalItems, totalPrice, items, clearCart } = useCartStore()
  const { createNewPayment, isLoading: paymentLoading } = usePaymentStore()
  const { createOrder, isLoading: orderLoading } = useOrdersStore()

  // Use refs to track if operations are in progress
  const isProcessingRef = useRef<boolean>(false)
  const hasInitializedRef = useRef<boolean>(false)

  const [paymentType, setPaymentType] = useState<string>("")
  const [paymentMethod, setPaymentMethod] = useState<string>("")
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)
  const [selectedPaymentOption, setSelectedPaymentOption] = useState<string>("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [installmentPercentage, setInstallmentPercentage] = useState<number>(0)
  const [selectedNetwork, setSelectedNetwork] = useState<string>("")
  const [completedPayment, setCompletedPayment] = useState<Payment | null>(null)
  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvv: "",
    name: "",
  })
  const [momoDetails, setMomoDetails] = useState({
    phoneNumber: "",
    network: "",
  })

  const user = useAuthStore((state) => state.user)
  const updateProfile = useAuthStore((state) => state.updateProfile)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  
  // Use authenticated user data instead of user store
  const userdetails = user
  console.log("Authenticated user details:", userdetails)

  // Initialize shipping details only once
  const [shippingDetails, setShippingDetails] = useState(() => ({
    pharmacyName: "",
    phoneNumber: "",
    pharmacyEmail: "",
    pharmacyLocation: "",
    streetAddress: "",
    gpsAddress: "",
  }))

  // Initialize shipping details from user data only once
  useEffect(() => {
    console.log("useEffect triggered with userdetails:", userdetails)
    console.log("hasInitializedRef.current:", hasInitializedRef.current)
    if (userdetails && Object.keys(userdetails).length > 0 && !hasInitializedRef.current) {
      console.log("Initializing shipping details from user data")
      const newShippingDetails = {
        pharmacyName: userdetails.businessName || "",
        phoneNumber: userdetails.telephone || "",
        pharmacyEmail: userdetails.email || "",
        pharmacyLocation: userdetails.location || "",
        streetAddress: "", // Not available in auth user data
        gpsAddress: "", // Not available in auth user data
      }
      console.log("Setting shipping details to:", newShippingDetails)
      setShippingDetails(newShippingDetails)
      hasInitializedRef.current = true
    }
  }, [userdetails])

  // Memoize calculated values to prevent unnecessary recalculations
  const calculations = useMemo(() => {
    const subtotal = totalPrice || 0
    const deliveryFeePercentage = 5
    const taxPercentage = 12.5
    const deliveryFee = subtotal > 0 ? (subtotal * deliveryFeePercentage) / 100 : 0
    const tax = subtotal > 0 ? (subtotal * taxPercentage) / 100 : 0
    const total = subtotal + deliveryFee + tax

    return {
      subtotal,
      deliveryFee,
      tax,
      total,
      deliveryFeePercentage,
      taxPercentage,
    }
  }, [totalPrice])

  const { subtotal, deliveryFee, tax, total, deliveryFeePercentage, taxPercentage } = calculations

  // Get items summary for display
  const itemsSummary = useMemo(() => {
    return items.map((item) => `${item.name} (x${item.quantity})`).join(", ")
  }, [items])

  // Prevent automatic function calls by using useCallback properly
  const handlePaymentTypeChange = useCallback((type: string) => {
    console.log("Payment type changed to:", type)
    setPaymentType(type)
    if (type !== "installment-payment") {
      setInstallmentPercentage(0)
    }
  }, [])

  const handlePaymentMethodChange = useCallback((method: string) => {
    console.log("Payment method changed to:", method)
    setPaymentMethod(method)
  }, [])

  // Debounced profile update - only update when user actually changes something
  const updateProfileDebounced = useCallback(
    (() => {
      let timeoutId: NodeJS.Timeout
      return (details: typeof shippingDetails) => {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => {
          if (updateProfile && user && hasInitializedRef.current) {
            console.log("Updating user profile with shipping details")
            updateProfile({
              ...user,
              businessName: details.pharmacyName,
              telephone: details.phoneNumber,
              email: details.pharmacyEmail,
              location: details.pharmacyLocation,
            })
          }
        }, 1000) // Increased debounce time
      }
    })(),
    [updateProfile, user],
  )

  // Only update profile when shipping details actually change (not on initial load)
  const prevShippingDetailsRef = useRef<typeof shippingDetails | undefined>(undefined)
  useEffect(() => {
    if (hasInitializedRef.current && prevShippingDetailsRef.current) {
      const hasChanged = JSON.stringify(prevShippingDetailsRef.current) !== JSON.stringify(shippingDetails)
      if (hasChanged) {
        console.log("Shipping details changed, updating profile")
        updateProfileDebounced(shippingDetails)
      }
    }
    prevShippingDetailsRef.current = shippingDetails
  }, [shippingDetails, updateProfileDebounced])

  // Prevent automatic submission by adding explicit checks
  const handleSubmit = useCallback(
    (event?: React.FormEvent) => {
      // Prevent form submission if this is a form event
      if (event) {
        event.preventDefault()
        event.stopPropagation()
      }

      // Prevent multiple submissions
      if (isProcessingRef.current || isProcessing) {
        console.log("Already processing, ignoring submit")
        return
      }

      console.log("Handle submit called with:", { paymentType, paymentMethod, installmentPercentage })

      // Validate required fields
      if (!paymentType) {
        alert("Please select a payment type")
        return
      }

      if (paymentType !== "credit" && !paymentMethod) {
        alert("Please select a payment method")
        return
      }

      if (paymentType === "installment-payment" && installmentPercentage === 0) {
        alert("Please select an installment percentage")
        return
      }

      const shouldShowPaymentDialog =
        (paymentType === "full-payment" || (paymentType === "installment-payment" && installmentPercentage > 0)) &&
        paymentMethod === "pay-online"

      if (shouldShowPaymentDialog) {
        console.log("Showing payment dialog")
        setShowPaymentDialog(true)
        return
      }

      // Process other payment types
      console.log("Processing payment directly")
      processPayment()
    },
    [paymentType, paymentMethod, installmentPercentage, isProcessing],
  )

  const processPayment = useCallback(async () => {
    // Prevent multiple calls
    if (isProcessingRef.current || isProcessing) {
      console.log("Payment already in progress, skipping")
      return
    }

    console.log("Starting payment processing")
    isProcessingRef.current = true
    setIsProcessing(true)

    try {
      let paymentAmount = total
      let description = `${itemsSummary}`

      // Calculate payment amount based on type
      if (paymentType === "installment-payment" && installmentPercentage > 0) {
        paymentAmount = (total * installmentPercentage) / 100
        description = `${itemsSummary} - half-installment`
      } else if (paymentType === "full-payment") {
        description = `${itemsSummary}` // Only item summary for full payment
      } else if (paymentType === "credit") {
        description = `${itemsSummary}` // Only item summary for credit
      } else if (paymentMethod === "pay-on-delivery") {
        // Filter out pay-on-delivery entries - skip processing
        console.log("Filtering out pay-on-delivery payment")
        return
      }

      // Determine payment method for metadata
      let finalPaymentMethod: string
      if (paymentMethod === "pay-online") {
        finalPaymentMethod = "pay-online"
      } else if (paymentMethod === "pay-on-delivery") {
        finalPaymentMethod = "cash-on-delivery"
      } else if (paymentType === "credit") {
        finalPaymentMethod = "credit"
      } else {
        finalPaymentMethod = "unknown"
      }

      // Determine specific payment option for pay-online
      let paymentOption: string | undefined
      if (paymentMethod === "pay-online") {
        if (selectedPaymentOption === "card") {
          paymentOption = "card"
        } else if (selectedPaymentOption === "mobile-money") {
          paymentOption = "MoMo"
        }
      }

      // Create payment metadata
      const metadata = {
        orderId: `ORD_${Date.now()}`,
        paymentType: paymentType as "full-payment" | "partial-payment" | "deposit" | "installment-payment",
        paymentMethod: finalPaymentMethod as "pay-on-delivery" | "online-payment" | "mobile-money" | "cash-on-delivery" | "pay-online",
        pharmacyName: shippingDetails.pharmacyName,
        shippingDetails,
        items: items.map((item) => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        itemsSummary,
        ...(paymentType === "installment-payment" && {
          installmentPercentage,
          remainingBalance: total - paymentAmount,
        }),
        ...(selectedPaymentOption === "card" && {
          cardType: getCardType(cardDetails.number),
          last4Digits: cardDetails.number.slice(-4),
          cardholderName: cardDetails.name,
        }),
        ...(selectedPaymentOption === "mobile-money" && {
          network: selectedNetwork,
          phoneNumber: momoDetails.phoneNumber,
        }),
      }

      console.log("Processing payment with metadata:", metadata, "and amount:", paymentAmount)

      // Use the payment store to create the payment
      // Filter out pay-on-delivery entries - skip processing
      // Determine payment type for database
      let dbPaymentType: "card" | "mobile_money" | "cash on delivery" | "credit"
      if (paymentMethod === "pay-online") {
        dbPaymentType = selectedPaymentOption === "card" ? "card" : "mobile_money"
      } else if (paymentMethod === "pay-on-delivery") {
           dbPaymentType = "cash on delivery"
      }else{
         dbPaymentType = "credit"
      }
        // Fallback to a valid value; you may want to handle other cases differently if needed
     
      

      const payment = await createNewPayment({
        amount: paymentAmount,
        currency: 'GHS',
        paymentType: dbPaymentType,
        paymentMethod: {
          type: dbPaymentType === 'card' ? 'card' : dbPaymentType === 'mobile_money' ? 'mobile_money' : 'cash',
          cardType: dbPaymentType === 'card' ? getCardType(cardDetails.number) : undefined,
          last4Digits: dbPaymentType === 'card' ? cardDetails.number.slice(-4) : undefined,
          expiryMonth: dbPaymentType === 'card' ? cardDetails.expiry.split('/')[0] : undefined,
          expiryYear: dbPaymentType === 'card' ? cardDetails.expiry.split('/')[1] : undefined,
          cardholderName: dbPaymentType === 'card' ? cardDetails.name : undefined,
          network: dbPaymentType === 'mobile_money' ? selectedNetwork as 'mtn' | 'vodafone' | 'airteltigo' | 'telecel' : undefined,
          phoneNumber: dbPaymentType === 'mobile_money' ? momoDetails.phoneNumber : undefined,
          accountName: dbPaymentType === 'mobile_money' ? shippingDetails.pharmacyName : undefined,
        },
        description: description,
        metadata: metadata
      })
      console.log("Payment processed successfully:", payment)

      // Create order after successful payment
      const order = await createOrder({
        items: items.map((item) => ({
          productId: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        subtotal: subtotal,
        deliveryFee: deliveryFee,
        tax: tax,
        total: total,
        currency: 'GHS',
        shippingDetails: shippingDetails,
        paymentDetails: {
          paymentType: paymentType as 'full-payment' | 'partial-payment' | 'deposit' | 'credit',
          paymentMethod: finalPaymentMethod as 'pay-on-delivery' | 'online-payment' | 'mobile-money',
          amount: paymentAmount,
          currency: 'GHS',
          transactionId: payment.transactionId,
        },
        notes: `Payment ID: ${payment.id}`,
        estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
      })
      console.log("Order created successfully:", order)

      setCompletedPayment(payment)
      clearCart()
      setShowSuccessModal(true)
    } catch (error) {
      console.error("Payment processing failed:", error)
      alert(`Payment failed: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      console.log("Payment processing completed")
      isProcessingRef.current = false
      setIsProcessing(false)
    }
  }, [
    total,
    paymentType,
    installmentPercentage,
    paymentMethod,
    selectedPaymentOption,
    shippingDetails,
    items,
    itemsSummary,
    cardDetails,
    selectedNetwork,
    momoDetails,
    createNewPayment,
    createOrder,
    user,
    clearCart,
    isProcessing,
  ])

  const handlePaymentDialogConfirm = useCallback(
    async (event?: React.FormEvent) => {
      if (event) {
        event.preventDefault()
        event.stopPropagation()
      }

      if (!selectedPaymentOption) {
        alert("Please select a payment option")
        return
      }

      console.log("Payment dialog confirmed")
      setShowPaymentDialog(false)
      await processPayment()
    },
    [selectedPaymentOption, processPayment],
  )

  const closeSuccessModal = useCallback(() => {
    console.log("Closing success modal")
    setShowSuccessModal(false)
    setCompletedPayment(null)
  }, [])

  const closePaymentDialog = useCallback(() => {
    console.log("Closing payment dialog")
    setShowPaymentDialog(false)
    setSelectedPaymentOption("")
    setSelectedNetwork("")
    setCardDetails({
      number: "",
      expiry: "",
      cvv: "",
      name: "",
    })
    setMomoDetails({
      phoneNumber: "",
      network: "",
    })
  }, [])

  // Helper function to determine card type
  const getCardType = useCallback((cardNumber: string): "visa" | "mastercard" | "american_express" | "discover" => {
    const number = cardNumber.replace(/\s/g, "")
    if (number.startsWith("4")) return "visa"
    if (number.startsWith("5") || number.startsWith("2")) return "mastercard"
    if (number.startsWith("3")) return "american_express"
    return "visa" // default
  }, [])

  // Calculate payment amount for dialog
  const getPaymentAmount = useCallback(() => {
    if (paymentType === "full-payment") {
      return total
    } else if (paymentType === "installment-payment" && installmentPercentage > 0) {
      return (total * installmentPercentage) / 100
    }
    return 0
  }, [paymentType, total, installmentPercentage])

  const getPaymentTypeLabel = useCallback(() => {
    if (paymentType === "full-payment") {
      return "Full Payment"
    } else if (paymentType === "installment-payment") {
      return `Installment Payment (${installmentPercentage}%)`
    }
    return ""
  }, [paymentType, installmentPercentage])

  // Calculate installment payment amounts
  const amountPaid = useMemo(() => {
    return installmentPercentage > 0 ? (total * installmentPercentage) / 100 : 0
  }, [installmentPercentage, total])

  const remainingBalance = useMemo(() => {
    return total - amountPaid
  }, [total, amountPaid])

  // Memoized shipping details update handler
  const updateShippingDetails = useCallback((field: string, value: string) => {
    console.log(`Updating shipping detail: ${field} = ${value}`)
    setShippingDetails((prev) => ({
      ...prev,
      [field]: value,
    }))
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isProcessingRef.current = false
    }
  }, [])

  return (
    <div className="w-full min-h-screen mt-24 bg-gray-50 dark:bg-background">
      {/* Payment Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="sm:max-w-lg p-0 gap-0 max-h-[90vh] overflow-y-auto bg-white dark:bg-green-950/90">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Complete Payment</h3>
              <button
                type="button"
                onClick={closePaymentDialog}
                className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </button>
            </div>

            {/* Payment Summary */}
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600 dark:text-white">Amount to Pay</span>
                <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                  GH₵ {getPaymentAmount().toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600 dark:text-white">Payment Type</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{getPaymentTypeLabel()}</span>
              </div>
              <div className="mt-3">
                <span className="text-sm text-gray-600 dark:text-white">Items:</span>
                <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">{itemsSummary}</p>
              </div>
            </div>

            {/* Payment Options */}
            <div className="space-y-4 mb-6">
              <h4 className="font-medium text-gray-900 dark:text-white">Select Payment Option</h4>

              <label className="flex items-center justify-between border-2 border-gray-200 dark:border-green-800 rounded-xl p-4 cursor-pointer hover:border-green-300 dark:hover:border-green-600 transition-colors has-[:checked]:border-green-500 has-[:checked]:bg-green-50 dark:has-[:checked]:bg-green-900/30">
                <div className="flex items-center gap-3">
                  <div className="bg-green-500 h-10 w-10 rounded-lg flex items-center justify-center">
                    <Smartphone className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Mobile Money</p>
                    <p className="text-sm text-gray-600 dark:text-green-200/70">MTN, AirtelTigo, Telecel</p>
                  </div>
                </div>
                <input
                  type="radio"
                  name="payment-option"
                  value="mobile-money"
                  checked={selectedPaymentOption === "mobile-money"}
                  onChange={(e) => setSelectedPaymentOption(e.target.value)}
                  className="h-4 w-4 text-green-600 focus:ring-green-500"
                />
              </label>

              <label className="flex items-center justify-between border-2 border-gray-200 dark:border-green-800 rounded-xl p-4 cursor-pointer hover:border-green-300 dark:hover:border-green-600 transition-colors has-[:checked]:border-green-500 has-[:checked]:bg-green-50 dark:has-[:checked]:bg-green-900/30">
                <div className="flex items-center gap-3">
                  <div className="bg-green-500 h-10 w-10 rounded-lg flex items-center justify-center">
                    <CreditCard className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Card Payment</p>
                    <p className="text-sm text-gray-600 dark:text-green-200/70">Visa, Mastercard, Verve</p>
                  </div>
                </div>
                <input
                  type="radio"
                  name="payment-option"
                  value="card"
                  checked={selectedPaymentOption === "card"}
                  onChange={(e) => setSelectedPaymentOption(e.target.value)}
                  className="h-4 w-4 text-green-600 focus:ring-green-500"
                />
              </label>
            </div>

            {/* Mobile Money Form */}
            {selectedPaymentOption === "mobile-money" && (
              <div className="space-y-4 mb-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <h5 className="font-medium text-gray-900 dark:text-white">Mobile Money Details</h5>

                {/* Network Selection */}
                <div>
                  <label className="block text-sm font-medium mb-3 text-gray-700 dark:text-white">
                    Select Network*
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: "mtn", label: "MTN" },
                      { value: "airteltigo", label: "AirtelTigo" },
                      { value: "telecel", label: "Telecel" },
                    ].map((network) => (
                      <label
                        key={network.value}
                        className="flex items-center justify-between p-3 rounded-lg border-2 border-gray-200 dark:border-green-800 cursor-pointer hover:border-green-300 dark:hover:border-green-600 transition-colors has-[:checked]:border-green-500 has-[:checked]:bg-green-50 dark:has-[:checked]:bg-green-900/30"
                      >
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{network.label}</span>
                        <input
                          type="radio"
                          name="momo-network"
                          value={network.value}
                          checked={selectedNetwork === network.value}
                          onChange={(e) => {
                            setSelectedNetwork(e.target.value)
                            setMomoDetails({ ...momoDetails, network: e.target.value })
                          }}
                          className="h-4 w-4 text-green-600 focus:ring-green-500"
                        />
                      </label>
                    ))}
                  </div>
                </div>

                {/* Phone Number Input */}
                <div>
                  <label htmlFor="momo-phone" className="block text-sm font-medium mb-2 text-gray-700 dark:text-white">
                    Phone Number*
                  </label>
                  <input
                    type="tel"
                    id="momo-phone"
                    value={momoDetails.phoneNumber}
                    onChange={(e) => setMomoDetails({ ...momoDetails, phoneNumber: e.target.value })}
                    className="w-full border border-gray-300 dark:border-green-800 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-green-950/50 dark:text-white"
                    placeholder="e.g. 0241234567"
                  />
                  <p className="text-xs text-gray-500 dark:text-green-200/70 mt-1">
                    Enter the phone number registered with your mobile money account
                  </p>
                </div>
              </div>
            )}

            {/* Card Payment Form */}
            {selectedPaymentOption === "card" && (
              <div className="space-y-4 mb-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <h5 className="font-medium text-gray-900 dark:text-white">Card Details</h5>

                {/* Card Number */}
                <div>
                  <label htmlFor="card-number" className="block text-sm font-medium mb-2 text-gray-700 dark:text-white">
                    Card Number*
                  </label>
                  <input
                    type="text"
                    id="card-number"
                    value={cardDetails.number}
                    onChange={(e) => {
                      const value = e.target.value
                        .replace(/\s/g, "")
                        .replace(/(.{4})/g, "$1 ")
                        .trim()
                      if (value.replace(/\s/g, "").length <= 16) {
                        setCardDetails({ ...cardDetails, number: value })
                      }
                    }}
                    className="w-full border border-gray-300 dark:border-green-800 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-green-950/50 dark:text-white"
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                  />
                </div>

                {/* Cardholder Name */}
                <div>
                  <label htmlFor="card-name" className="block text-sm font-medium mb-2 text-gray-700 dark:text-white">
                    Cardholder Name*
                  </label>
                  <input
                    type="text"
                    id="card-name"
                    value={cardDetails.name}
                    onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value.toUpperCase() })}
                    className="w-full border border-gray-300 dark:border-green-800 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-green-950/50 dark:text-white"
                    placeholder="JOHN DOE"
                  />
                </div>

                {/* Expiry and CVV */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="card-expiry"
                      className="block text-sm font-medium mb-2 text-gray-700 dark:text-white"
                    >
                      Expiry Date*
                    </label>
                    <input
                      type="text"
                      id="card-expiry"
                      value={cardDetails.expiry}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "").replace(/(\d{2})(\d)/, "$1/$2")
                        if (value.length <= 5) {
                          setCardDetails({ ...cardDetails, expiry: value })
                        }
                      }}
                      className="w-full border border-gray-300 dark:border-green-800 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-green-950/50 dark:text-white"
                      placeholder="MM/YY"
                      maxLength={5}
                    />
                  </div>
                  <div>
                    <label htmlFor="card-cvv" className="block text-sm font-medium mb-2 text-gray-700 dark:text-white">
                      CVV*
                    </label>
                    <input
                      type="text"
                      id="card-cvv"
                      value={cardDetails.cvv}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "")
                        if (value.length <= 4) {
                          setCardDetails({ ...cardDetails, cvv: value })
                        }
                      }}
                      className="w-full border border-gray-300 dark:border-green-800 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-green-950/50 dark:text-white"
                      placeholder="123"
                      maxLength={4}
                    />
                  </div>
                </div>

                {/* Accepted Cards */}
                <div className="flex items-center gap-2 pt-2">
                  <span className="text-xs text-gray-500 dark:text-green-200/70">Accepted cards:</span>
                  <div className="flex gap-1">
                    <div className="w-8 h-5 bg-green-600 rounded text-white text-xs flex items-center justify-center font-bold">
                      VISA
                    </div>
                    <div className="w-8 h-5 bg-green-600 rounded text-white text-xs flex items-center justify-center font-bold">
                      MC
                    </div>
                    <div className="w-8 h-5 bg-green-600 rounded text-white text-xs flex items-center justify-center font-bold">
                      V
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={closePaymentDialog}
                className="flex-1 border-green-200 dark:border-green-800 dark:text-white"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handlePaymentDialogConfirm}
                disabled={
                  !selectedPaymentOption ||
                  isProcessing ||
                  paymentLoading ||
                  orderLoading ||
                  (selectedPaymentOption === "mobile-money" && (!selectedNetwork || !momoDetails.phoneNumber)) ||
                  (selectedPaymentOption === "card" &&
                    (!cardDetails.number || !cardDetails.name || !cardDetails.expiry || !cardDetails.cvv))
                }
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              >
                {isProcessing || paymentLoading || orderLoading ? "Processing..." : "Pay Now"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Enhanced Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="sm:max-w-md p-0 gap-0">
          <div className="p-6 text-center">
            <button
              type="button"
              onClick={closeSuccessModal}
              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>

            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center">
                <Check className="h-6 w-6 text-white" />
              </div>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-foreground mb-2">
              {paymentType === "credit" ? "Order placed on credit" : "Payment successful"}
            </h3>
            <p className="text-gray-600 dark:text-muted-foreground mb-4">
              {paymentType === "credit"
                ? "Your order has been placed on credit terms."
                : paymentMethod === "pay-on-delivery"
                  ? "Your order will be processed. Payment due on delivery."
                  : "Your payment has been processed successfully."}
            </p>

            {/* Payment Details */}
            {completedPayment && (
              <div className="bg-gray-50 dark:bg-muted/20 rounded-lg p-4 mb-6 text-left">
                <h4 className="font-medium text-gray-900 dark:text-foreground mb-2">Payment Details</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-muted-foreground">Transaction ID:</span>
                    <span className="font-mono text-gray-900 dark:text-foreground">
                      {completedPayment.transactionId}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-muted-foreground">Amount:</span>
                    <span className="font-medium text-gray-900 dark:text-foreground">
                      GH₵ {completedPayment.amount.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-muted-foreground">Status:</span>
                    <span
                      className={`font-medium ${
                        completedPayment.status === "completed"
                          ? "text-green-600"
                          : completedPayment.status === "pending"
                            ? "text-yellow-600"
                            : "text-red-600"
                      }`}
                    >
                      {completedPayment.status.charAt(0).toUpperCase() + completedPayment.status.slice(1)}
                    </span>
                  </div>
                  <div className="mt-3">
                    <span className="text-gray-600 dark:text-muted-foreground">Items:</span>
                    <p className="text-sm text-gray-900 dark:text-foreground mt-1">{itemsSummary}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/orders">
                <button
                  type="button"
                  className="px-6 py-2.5 border border-gray-300 dark:border-border rounded-full text-gray-700 dark:text-foreground font-medium hover:bg-gray-50 dark:hover:bg-muted/50 transition-colors"
                  onClick={closeSuccessModal}
                >
                  Track order
                </button>
              </Link>
              <Link href="/marketplace/payments">
                <button
                  type="button"
                  className="px-6 py-2.5 bg-emerald-500 rounded-full text-white font-medium hover:bg-emerald-600 transition-colors"
                  onClick={closeSuccessModal}
                >
                  View Payments
                </button>
              </Link>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Main Content */}
      <main className="flex-1 py-6 px-4 sm:px-6 items-center justify-center">
        <div className="max-w-6xl mx-auto">
          <Link
            href="/cart"
            className="flex items-center gap-2 mb-6 text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-foreground dark:hover:text-foreground/80"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Left Column - Shipping & Payment */}
            <div className="md:col-span-2 space-y-8">
              {/* Shipping & Delivery Address */}
              <Card>
                <CardHeader className="border-b">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg font-semibold">Shipping & Delivery Address</CardTitle>
                    <button
                      type="button"
                      className="text-emerald-600 text-sm font-medium hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
                    >
                      Edit
                    </button>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  {!userdetails ? (
                                          <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
                        <span className="ml-2 text-gray-600 dark:text-gray-400">Please log in to continue...</span>
                      </div>
                  ) : (
                  <div className="grid gap-4">
                    <div>
                      <label
                        htmlFor="pharmacy-name"
                        className="block text-sm font-medium mb-2 text-gray-700 dark:text-foreground"
                      >
                        Pharmacy Name*
                      </label>
                      <input
                        type="text"
                        id="pharmacy-name"
                        value={shippingDetails.pharmacyName}
                        onChange={(e) => updateShippingDetails("pharmacyName", e.target.value)}
                        className="w-full border border-gray-300 dark:border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-background dark:text-foreground"
                        placeholder="Enter pharmacy name"
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="phone"
                          className="block text-sm font-medium mb-2 text-gray-700 dark:text-foreground"
                        >
                          Phone Number*
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          value={shippingDetails.phoneNumber}
                          onChange={(e) => updateShippingDetails("phoneNumber", e.target.value)}
                          className="w-full border border-gray-300 dark:border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-background dark:text-foreground"
                          placeholder="Enter phone number"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium mb-2 text-gray-700 dark:text-foreground"
                        >
                          Email*
                        </label>
                        <input
                          type="email"
                          id="email"
                          value={shippingDetails.pharmacyEmail}
                          onChange={(e) => updateShippingDetails("pharmacyEmail", e.target.value)}
                          className="w-full border border-gray-300 dark:border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-background dark:text-foreground"
                          placeholder="Enter email address"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="pharmacy-location"
                        className="block text-sm font-medium mb-2 text-gray-700 dark:text-foreground"
                      >
                        Pharmacy Location*
                      </label>
                      <input
                        type="text"
                        id="pharmacy-location"
                        value={shippingDetails.pharmacyLocation}
                        onChange={(e) => updateShippingDetails("pharmacyLocation", e.target.value)}
                        className="w-full border border-gray-300 dark:border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-background dark:text-foreground"
                        placeholder="Enter pharmacy location"
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="street-address"
                          className="block text-sm font-medium mb-2 text-gray-700 dark:text-foreground"
                        >
                          Street Address*
                        </label>
                        <input
                          type="text"
                          id="street-address"
                          value={shippingDetails.streetAddress}
                          onChange={(e) => updateShippingDetails("streetAddress", e.target.value)}
                          className="w-full border border-gray-300 dark:border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-background dark:text-foreground"
                          placeholder="Enter street address"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="gps-address"
                          className="block text-sm font-medium mb-2 text-gray-700 dark:text-foreground"
                        >
                          GPS Address (Optional)
                        </label>
                        <input
                          type="text"
                          id="gps-address"
                          value={shippingDetails.gpsAddress}
                          onChange={(e) => updateShippingDetails("gpsAddress", e.target.value)}
                          className="w-full border border-gray-300 dark:border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-background dark:text-foreground"
                          placeholder="e.g. GA-492-9735"
                        />
                      </div>
                    </div>
                  </div>
                  )}
                </CardContent>
              </Card>

              {/* Payment Method - Only show if not Credit */}
              {paymentType !== "credit" && (
                <Card>
                  <CardHeader className="border-b">
                    <CardTitle className="text-lg font-semibold">Payment Method</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <p className="text-sm mb-4 text-gray-600 dark:text-muted-foreground">
                      Select the type of payment method you want to proceed.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <label className="flex items-center justify-between border-2 border-gray-200 dark:border-border rounded-xl p-4 cursor-pointer hover:border-emerald-300 dark:hover:border-emerald-400 transition-colors has-[:checked]:border-emerald-500 has-[:checked]:bg-emerald-50 dark:has-[:checked]:bg-emerald-950/20 bg-white dark:bg-card">
                        <div className="flex items-center gap-3">
                          <div className="bg-green-500 h-10 w-10 rounded-lg flex items-center justify-center">
                            <CreditCard className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-card-foreground">Pay Online</p>
                            <p className="text-sm text-gray-600 dark:text-muted-foreground">Pay now online</p>
                          </div>
                        </div>
                        <input
                          type="radio"
                          name="payment-method"
                          value="pay-online"
                          checked={paymentMethod === "pay-online"}
                          onChange={() => handlePaymentMethodChange("pay-online")}
                          className="h-4 w-4 text-emerald-600 focus:ring-emerald-500"
                        />
                      </label>

                      <label className="flex items-center justify-between border-2 border-gray-200 dark:border-border rounded-xl p-4 cursor-pointer hover:border-emerald-300 dark:hover:border-emerald-400 transition-colors has-[:checked]:border-emerald-500 has-[:checked]:bg-emerald-50 dark:has-[:checked]:bg-emerald-950/20 bg-white dark:bg-card">
                        <div className="flex items-center gap-3">
                          <div className="bg-orange-500 h-10 w-10 rounded-lg flex items-center justify-center">
                            <Smartphone className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-card-foreground">Pay on Delivery</p>
                            <p className="text-sm text-gray-600 dark:text-muted-foreground">Cash on delivery</p>
                          </div>
                        </div>
                        <input
                          type="radio"
                          name="payment-method"
                          value="pay-on-delivery"
                          checked={paymentMethod === "pay-on-delivery"}
                          onChange={() => handlePaymentMethodChange("pay-on-delivery")}
                          className="h-4 w-4 text-emerald-600 focus:ring-emerald-500"
                        />
                      </label>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Column - Cart Summary */}
            <div>
              <Card className="sticky top-6">
                <CardHeader className="border-b">
                  <CardTitle className="text-lg font-semibold">Cart Summary</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-muted-foreground">Items</span>
                      <span className="font-medium text-gray-900 dark:text-foreground">{totalItems}</span>
                    </div>

                    {/* Items List */}
                    <div className="border-t border-gray-200 dark:border-border pt-4">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-foreground mb-2">Order Items:</h4>
                      <div className="space-y-1">
                        {items.map((item, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-muted-foreground">
                              {item.name} (x{item.quantity})
                            </span>
                            <span className="font-medium text-gray-900 dark:text-foreground">
                              GH₵ {(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-muted-foreground">
                        Delivery fee ({deliveryFeePercentage}%)
                      </span>
                      <span className="font-medium text-gray-900 dark:text-foreground">
                        GH₵ {deliveryFee.toFixed(2)}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-muted-foreground">Subtotal</span>
                      <span className="font-medium text-gray-900 dark:text-foreground">GH₵ {subtotal.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-muted-foreground">Tax ({taxPercentage}%)</span>
                      <span className="font-medium text-gray-900 dark:text-foreground">GH₵ {tax.toFixed(2)}</span>
                    </div>

                    <div className="pt-4 border-t border-gray-200 dark:border-border flex justify-between">
                      <span className="font-semibold text-gray-900 dark:text-foreground">Total</span>
                      <span className="font-bold text-lg text-gray-900 dark:text-foreground">
                        GH₵ {total.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Installment Payment Breakdown */}
                  {paymentType === "installment-payment" && installmentPercentage > 0 && (
                    <div className="pt-4 border-t border-gray-200 dark:border-border">
                      <h4 className="font-medium text-gray-900 dark:text-foreground mb-3">Payment Breakdown</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600 dark:text-muted-foreground">
                            Paying Now ({installmentPercentage}%)
                          </span>
                          <span className="font-medium text-emerald-600 dark:text-emerald-400">
                            GH₵ {amountPaid.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600 dark:text-muted-foreground">
                            Remaining Balance ({100 - installmentPercentage}%)
                          </span>
                          <span className="font-medium text-orange-600 dark:text-orange-400">
                            GH₵ {remainingBalance.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mt-6 space-y-4">
                    <h3 className="font-semibold text-gray-900 dark:text-foreground">Payment Type</h3>

                    <div className="space-y-2">
                      <label className="group flex items-center gap-2 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-muted/50 cursor-pointer">
                        <div className="relative flex items-center justify-center">
                          <input
                            type="radio"
                            name="payment-type"
                            value="full-payment"
                            checked={paymentType === "full-payment"}
                            onChange={(e) => handlePaymentTypeChange(e.target.value)}
                            className="sr-only peer"
                          />
                          <div className="w-5 h-5 border-2 border-gray-300 dark:border-border rounded-full bg-white dark:bg-background transition-all duration-200 peer-checked:bg-emerald-500 peer-checked:border-emerald-500 group-hover:border-emerald-400"></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-foreground">Full payment</span>
                      </label>

                      <label className="group flex items-center gap-3 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-muted/50 cursor-pointer">
                        <div className="relative flex items-center justify-center">
                          <input
                            type="radio"
                            name="payment-type"
                            value="installment-payment"
                            checked={paymentType === "installment-payment"}
                            onChange={(e) => handlePaymentTypeChange(e.target.value)}
                            className="sr-only peer"
                          />
                          <div className="w-5 h-5 border-2 border-gray-300 dark:border-border rounded-full bg-white dark:bg-background transition-all duration-200 peer-checked:bg-emerald-500 peer-checked:border-emerald-500 group-hover:border-emerald-400"></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-foreground">
                          Installment payment
                        </span>
                      </label>

                      {paymentType === "installment-payment" && (
                        <div className="ml-8 mt-3 mb-4">
                          <label className="block text-sm font-medium mb-3 text-gray-700 dark:text-foreground">
                            Select Payment Percentage*
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            {[50, 60, 70, 80, 90].map((percentage) => (
                              <label
                                key={percentage}
                                className="flex items-center gap-2 p-3 rounded-lg border border-gray-200 dark:border-border hover:bg-gray-50 dark:hover:bg-muted/50 cursor-pointer has-[:checked]:border-emerald-500 has-[:checked]:bg-emerald-50 dark:has-[:checked]:bg-emerald-950/20"
                              >
                                <input
                                  type="radio"
                                  name="installment-percentage"
                                  value={percentage}
                                  checked={installmentPercentage === percentage}
                                  onChange={() => setInstallmentPercentage(percentage)}
                                  className="h-4 w-4 text-emerald-600 focus:ring-emerald-500"
                                />
                                <span className="text-sm font-medium text-gray-900 dark:text-foreground">
                                  {percentage}%
                                </span>
                                <span className="text-xs text-gray-500 dark:text-muted-foreground ml-auto">
                                  GH₵ {((total * percentage) / 100).toFixed(2)}
                                </span>
                              </label>
                            ))}
                          </div>
                          <p className="text-xs text-gray-500 dark:text-muted-foreground mt-2">
                            Choose the percentage you want to pay now
                          </p>
                        </div>
                      )}

                      <label className="group flex items-center gap-3 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-muted/50 cursor-pointer">
                        <div className="relative flex items-center justify-center">
                          <input
                            type="radio"
                            name="payment-type"
                            value="credit"
                            checked={paymentType === "credit"}
                            onChange={(e) => handlePaymentTypeChange(e.target.value)}
                            className="sr-only peer"
                          />
                          <div className="w-5 h-5 border-2 border-gray-300 dark:border-border rounded-full bg-white dark:bg-background transition-all duration-200 peer-checked:bg-emerald-500 peer-checked:border-emerald-500 group-hover:border-emerald-400"></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-foreground">Credit</span>
                      </label>

                      {paymentType === "credit" && (
                        <div className="ml-8 mt-3 mb-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                          <p className="text-sm text-blue-800 dark:text-blue-200">
                            <strong>Credit Payment Selected</strong>
                          </p>
                          <p className="text-xs text-blue-600 dark:text-blue-300 mt-1">
                            No immediate payment required. Order will be processed on credit terms.
                          </p>
                        </div>
                      )}
                    </div>

                    <Button
                      type="button"
                      className="w-full font-semibold py-3 mt-6"
                      disabled={
                        isProcessing ||
                        paymentLoading ||
                        orderLoading ||
                        (paymentType === "installment-payment" && installmentPercentage === 0) ||
                        (!paymentMethod && paymentType !== "credit") ||
                        totalItems === 0 ||
                        !total
                      }
                      onClick={handleSubmit}
                    >
                      {isProcessing || paymentLoading || orderLoading ? "Processing..." : "Confirm Order"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
