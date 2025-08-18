"use client"

import type React from "react"
import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AppBadge } from "@/components/ui/custom-badge"
import { ChevronLeft, ChevronRight, MoreHorizontal, Eye, Plus, Search, Calendar, Filter, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { prescriptionData, searchPrescriptions } from "@/lib/prescription"

const ITEMS_PER_PAGE = 10

export default function Prescriptions() {
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value.toLowerCase())
    setCurrentPage(1) // Reset to page 1 on new search
  }

  const filteredData = searchTerm ? searchPrescriptions(searchTerm) : prescriptionData

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE)
  const paginatedOrders = filteredData.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  // Function to get initials from patient name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
  }

  // Get statistics
  const activeCount = prescriptionData.filter((p) => p.status === "Active").length
  const completedCount = prescriptionData.filter((p) => p.status === "Completed").length
  const ongoingCount = prescriptionData.filter((p) => p.status === "Ongoing").length

  return (
    <div className="min-h-screen bg-white dark:bg-transparent ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-green-600 dark:text-green-400">
                Prescription Management
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                Manage your prescriptions effectively and track patient medication schedules
              </p>
            </div>

            {/* Quick Stats */}
            <div className="flex gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">{activeCount}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Active</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">{ongoingCount}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Ongoing</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">{completedCount}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Completed</div>
              </div>
            </div>
          </div>
        </div>

        {/* Controls Section */}
        <Card className="mb-6 border-green-200 dark:border-green-800 bg-white dark:bg-transparent">
          <CardHeader className="pb-4">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-3 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                  <Input
                    placeholder="Search by patient, medication, or dosage..."
                    onChange={handleSearch}
                    className="pl-10 bg-white dark:bg-transparent border-gray-200 dark:border-gray-700 focus:border-green-500 dark:focus:border-green-400"
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-green-200 dark:border-green-700 text-green-700 dark:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/20"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-green-200 dark:border-green-700 text-green-700 dark:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/20"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
                <Button
                  onClick={() => router.push("/prescriptions/new-prescription")}
                  className="bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white transition-all duration-200"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Prescription
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Table Section */}
        <Card className="overflow-hidden border-green-200 dark:border-green-800 bg-white dark:bg-transparent">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-green-100 dark:bg-green-900/40">
                  <TableRow className="border-green-200 dark:border-green-800">
                    <TableHead className="font-semibold text-gray-800 dark:text-gray-200 py-4">Patient</TableHead>
                    <TableHead className="font-semibold text-gray-800 dark:text-gray-200">Medication</TableHead>
                    <TableHead className="font-semibold text-gray-800 dark:text-gray-200">Dosage</TableHead>
                    <TableHead className="font-semibold text-gray-800 dark:text-gray-200">Frequency</TableHead>
                    <TableHead className="font-semibold text-gray-800 dark:text-gray-200">Start Date</TableHead>
                    <TableHead className="font-semibold text-gray-800 dark:text-gray-200">End Date</TableHead>
                    <TableHead className="font-semibold text-gray-800 dark:text-gray-200">Status</TableHead>
                    <TableHead className="font-semibold text-gray-800 dark:text-gray-200">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedOrders.map((order) => (
                    <TableRow
                      key={order.id}
                      className="hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-200 border-gray-100 dark:border-gray-800"
                    >
                      <TableCell className="py-4">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10 bg-green-200 dark:bg-green-700">
                            <AvatarFallback className="text-green-800 dark:text-green-200 text-sm font-semibold">
                              {getInitials(order.patientName)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-semibold text-gray-900 dark:text-gray-100">{order.patientName}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              ID: {order.id.toString().padStart(3, "0")}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-gray-900 dark:text-gray-100">{order.medication}</div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className="bg-gray-100 dark:bg-transparent text-gray-700 dark:text-gray-300"
                        >
                          {order.dosage}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-700 dark:text-gray-300">{order.frequency}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3.5 w-3.5 text-green-500 dark:text-green-400" />
                          <span className="text-gray-700 dark:text-gray-300">{order.startDate}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3.5 w-3.5 text-green-500 dark:text-green-400" />
                          <span className="text-gray-700 dark:text-gray-300">{order.endDate}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <AppBadge type={order.status} />
                      </TableCell>
                      <TableCell>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-full hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent
                            className="w-56 p-2 bg-white dark:bg-background border-green-200 dark:border-green-700"
                            align="end"
                          >
                            <div className="font-medium text-sm px-2 py-1.5 text-gray-900 dark:text-gray-100 border-b border-gray-100 dark:border-gray-700 mb-2">
                              Actions
                            </div>
                            <div className="space-y-1 text-sm">
                              <Button
                                variant="ghost"
                                className="flex items-center gap-2 w-full justify-start px-2 py-1.5 h-9 hover:bg-green-50 dark:hover:bg-green-900/20"
                              >
                                <Eye className="w-4 h-4" /> View Details
                              </Button>
                              <Button
                                variant="ghost"
                                className="flex items-center gap-2 w-full justify-start px-2 py-1.5 h-9 hover:bg-green-50 dark:hover:bg-green-900/20"
                              >
                                <Plus className="w-4 h-4" /> New Prescription
                              </Button>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Pagination Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center mt-8 gap-4">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="rounded-full border-green-300 dark:border-green-600 text-gray-700 dark:text-gray-200 disabled:opacity-50 disabled:bg-transparent hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Previous
            </Button>

            <div className="text-sm text-gray-600 dark:text-gray-300 bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded-full">
              Page {currentPage} of {totalPages}
            </div>
          </div>

          <div className="flex items-center space-x-1">
            {/* First page */}
            {currentPage > 3 && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToPage(1)}
                  className="rounded-full w-10 h-10 p-0 border-green-300 dark:border-green-600 text-gray-700 dark:text-gray-200 hover:bg-green-50 dark:hover:bg-green-900/20"
                >
                  1
                </Button>
                {currentPage > 4 && <span className="text-gray-400 dark:text-gray-500 px-1">...</span>}
              </>
            )}

            {/* Page numbers around current page */}
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum
              if (totalPages <= 5) {
                pageNum = i + 1
              } else if (currentPage <= 3) {
                pageNum = i + 1
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i
              } else {
                pageNum = currentPage - 2 + i
              }

              if (pageNum < 1 || pageNum > totalPages) return null
              if (totalPages > 5 && currentPage > 3 && pageNum === 1) return null
              if (totalPages > 5 && currentPage < totalPages - 2 && pageNum === totalPages) return null

              return (
                <Button
                  key={pageNum}
                  variant={pageNum === currentPage ? "default" : "outline"}
                  size="sm"
                  onClick={() => goToPage(pageNum)}
                  className={
                    pageNum === currentPage
                      ? "rounded-full w-10 h-10 p-0 bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white"
                      : "rounded-full w-10 h-10 p-0 border-green-300 dark:border-green-600 text-gray-700 dark:text-gray-200 hover:bg-green-50 dark:hover:bg-green-900/20"
                  }
                >
                  {pageNum}
                </Button>
              )
            })}

            {/* Last page */}
            {currentPage < totalPages - 2 && totalPages > 5 && (
              <>
                {currentPage < totalPages - 3 && <span className="text-gray-400 dark:text-gray-500 px-1">...</span>}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToPage(totalPages)}
                  className="rounded-full w-10 h-10 p-0 border-green-300 dark:border-green-600 text-gray-700 dark:text-gray-200 hover:bg-green-50 dark:hover:bg-green-900/20"
                >
                  {totalPages}
                </Button>
              </>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-600 dark:text-gray-300 bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded-full">
              Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
              {Math.min(currentPage * ITEMS_PER_PAGE, filteredData.length)} of {filteredData.length} results
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="rounded-full border-green-300 dark:border-green-600 text-gray-700 dark:text-gray-200 disabled:opacity-50 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors disabled:bg-transparent"
            >
              Next <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
