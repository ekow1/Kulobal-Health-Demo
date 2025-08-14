"use client"

import StatCard from "@/components/dashbord/stats-card"
import { QuickActions } from "@/components/dashbord/quick-actions"
import { DataDisplay } from "@/components/dashbord/data-display"
import InteractiveDatePicker from "@/components/dashbord/date-selector"
import { FilePlus, Package, ShoppingBag, TestTube, Users } from "lucide-react"
import RecentTransactions from "@/components/dashbord/transaction-card"
import SubscriptionStatus from "@/components/dashbord/subscription-status"
import ChronicPatients from "@/components/dashbord/chronic-patients"
import { useOrderStats } from "@/hooks/use-order-stats"
import { useOrdersStore } from "@/store/orders-store"
import { useEffect } from "react"

export default function MedicalDashboard() {
  const { fetchOrders } = useOrdersStore()
  const orderStats = useOrderStats()

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  return (
    <div className="w-full min-h-screen cursor-pointer py-24 lg:py-3 sm:mt-10 lg:mt-0">
      <div className="w-full lg:max-w-7xl mx-auto sm:p-8 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between bg-white border-2 border-green-100 rounded-2xl p-8 lg:px-8  dark:border-0 dark:bg-transparent dark:text-white">
          <div className="mb-4 lg:mb-0">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Medical Dashboard</h1>
            <p className="text-lg text-gray-900  dark:text-white">Manage your practice with ease and efficiency</p>
          </div>
          <InteractiveDatePicker />
        </div>

        {/* Stats Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <StatCard
            title="Total Patients"
            value="128"
            description="Active registered patients"
            icon={<Users className="w-7 h-7" />}
            trend="+12%"
            color="bg-green-500"
          />
          <StatCard
            title="Tests Today"
            value="24"
            description="Rapid tests completed"
            icon={<TestTube className="w-7 h-7" />}
            trend="+8%"
            color="bg-green-600"
          />
          <StatCard
            title="Monthly Revenue"
            value={`GHS ${orderStats.totalRevenue.toFixed(2)}`}
            description="Total earnings from delivered orders"
            icon={<ShoppingBag className="w-7 h-7" />}
            color="bg-green-700"
          />
          <StatCard
            title="Pending Orders"
            value={orderStats.pendingOrders.toString()}
            description="Orders awaiting processing"
            icon={<Package className="w-7 h-7" />}
            color="bg-green-800"
          />
        </section>

        {/* Quick Actions Section */}
        <div className="bg-white border-2 border-green-100 rounded-2xl p-8 dark:border-0 dark:bg-transparent dark:text-white">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 dark:text-white">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <QuickActions
              text="Create Prescription"
              icon={<FilePlus className="w-6 h-6" />}
              color="bg-green-100 hover:bg-green-200 text-green-800"
              description="Write new prescriptions"
            />
            <QuickActions
              text="Rapid Testing"
              icon={<TestTube className="w-6 h-6" />}
              color="bg-green-200 hover:bg-green-300 text-green-900"
              description="Conduct medical tests"
            />
            <QuickActions
              text="Register Patient"
              icon={<Users className="w-6 h-6" />}
              color="bg-green-300 hover:bg-green-400 text-green-900"
              description="Add new patient records"
            />
          </div>
        </div>

        {/* Data Display Section */}
        <section className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <RecentTransactions />
          <DataDisplay />
          <ChronicPatients />
          <SubscriptionStatus />
        </section>
      </div>
    </div>
  )
}
