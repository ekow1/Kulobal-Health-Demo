"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChevronLeft, ChevronRight, UserRound, MoreHorizontal, Eye, Plus, Edit, Trash2 } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { patientsData } from "@/lib/patient-data"
import PatientDetailsModal from "./patient-details-modal"
import type { Patient } from "@/lib/patient-data"

interface PatientTableProps {
  searchTerm: string
}

const ITEMS_PER_PAGE = 8

export default function PatientTable({ searchTerm }: PatientTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const filteredData = patientsData.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.condition.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.gender.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE)
  const paginatedPatients = filteredData.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const getGenderColor = (gender: string) => {
    switch (gender.toLowerCase()) {
      case "male":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      case "female":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400"
      default:
        return "bg-green-50 text-green-700 dark:bg-green-900/10 dark:text-green-300"
    }
  }

  const getConditionColor = (condition: string) => {
    const conditionColors: Record<string, string> = {
      asthma: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
      diabetes: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
      hypertension: "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400",
      migraine: "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400",
      arthritis: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
      allergies: "bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-400",
      anxiety: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400",
      depression: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/20 dark:text-cyan-400",
      insomnia: "bg-slate-100 text-slate-800 dark:bg-slate-900/20 dark:text-slate-400",
    }

    const normalizedCondition = condition.toLowerCase().replace(/\s+/g, "")
    return (
      conditionColors[normalizedCondition] || "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
    )
  }

  const handleViewDetails = (patient: Patient) => {
    setSelectedPatient(patient)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedPatient(null)
  }

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

  return (
    <div className="space-y-6">
      {/* Table */}
      <div className="bg-white dark:bg-background rounded-xl border border-green-200 dark:border-green-800 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-green-50 dark:bg-green-950/50 hover:bg-green-50 dark:hover:bg-green-950/50 border-green-200 dark:border-green-800">
              <TableHead className="text-green-900 dark:text-green-100 font-semibold">Patient</TableHead>
              <TableHead className="text-green-900 dark:text-green-100 font-semibold">Date of Birth</TableHead>
              <TableHead className="text-green-900 dark:text-green-100 font-semibold">Gender</TableHead>
              <TableHead className="text-green-900 dark:text-green-100 font-semibold">Contact</TableHead>
              <TableHead className="text-green-900 dark:text-green-100 font-semibold">Condition</TableHead>
              <TableHead className="text-green-900 dark:text-green-100 font-semibold">Last Visit</TableHead>
              <TableHead className="text-green-900 dark:text-green-100 font-semibold text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedPatients.length > 0 ? (
              paginatedPatients.map((patient) => (
                <TableRow
                  key={patient.id}
                  className="hover:bg-green-50/50 dark:hover:bg-green-950/20 border-green-100 dark:border-green-900/50 transition-colors"
                >
                  <TableCell className="py-4">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10 border-2 border-green-200 dark:border-green-700">
                        <AvatarFallback className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 font-medium">
                          {patient.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-gray-100">{patient.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{patient.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-700 dark:text-gray-300">{patient.dob}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={getGenderColor(patient.gender)}>
                      {patient.gender}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-700 dark:text-gray-300 font-mono text-sm">
                    {patient.contact}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={getConditionColor(patient.condition)}>
                      {patient.condition}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-700 dark:text-gray-300">{patient.lastVisit}</TableCell>
                  <TableCell className="text-center">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-green-100 dark:hover:bg-green-900/50 text-gray-500 hover:text-green-700 dark:text-gray-400 dark:hover:text-green-300"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-48 p-2 bg-white dark:bg-background border-green-200 dark:border-green-700">
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100 px-2 py-1 mb-1">
                          Patient Actions
                        </div>
                        <div className="space-y-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start h-8 px-2 hover:bg-green-50 dark:hover:bg-green-900/50 text-gray-700 dark:text-gray-300"
                            onClick={() => handleViewDetails(patient)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start h-8 px-2 hover:bg-green-50 dark:hover:bg-green-900/50 text-gray-700 dark:text-gray-300"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            New Prescription
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start h-8 px-2 hover:bg-green-50 dark:hover:bg-green-900/50 text-gray-700 dark:text-gray-300"
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Patient
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start h-8 px-2 hover:bg-red-50 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Patient
                          </Button>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12">
                  <div className="flex flex-col items-center space-y-2">
                    <UserRound className="h-12 w-12 text-gray-400 dark:text-gray-600" />
                    <p className="text-gray-500 dark:text-gray-400">No patients found</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500">Try adjusting your search criteria</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white dark:bg-background px-6 py-4 rounded-xl  ">
          <div className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300">
            <span>Showing</span>
            <span className="font-medium text-green-700 dark:text-green-400">
              {(currentPage - 1) * ITEMS_PER_PAGE + 1}
            </span>
            <span>to</span>
            <span className="font-medium text-green-700 dark:text-green-400">
              {Math.min(currentPage * ITEMS_PER_PAGE, filteredData.length)}
            </span>
            <span>of</span>
            <span className="font-medium text-green-700 dark:text-green-400">{filteredData.length}</span>
            <span>patients</span>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="border-green-200 dark:border-green-700 hover:bg-green-50 dark:hover:bg-green-900/50 disabled:opacity-50 disabled:bg-transparent rounded-full"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>

            <div className="flex space-x-1">
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

                return (
                  <Button
                    key={pageNum}
                    variant={pageNum === currentPage ? "default" : "outline"}
                    size="sm"
                    onClick={() => goToPage(pageNum)}
                    className={
                      pageNum === currentPage
                        ? "bg-green-600 hover:bg-green-700 text-white border-green-600 rounded-full"
                        : "border-green-200 dark:border-green-700 hover:bg-green-50 dark:hover:bg-green-900/50 text-gray-700 dark:text-gray-300 rounded-full"
                    }
                  >
                    {pageNum}
                  </Button>
                )
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="border-green-200 dark:border-green-700 hover:bg-green-50 dark:hover:bg-green-900/50 disabled:opacity-50 disabled:bg-transparent rounded-full"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
      <PatientDetailsModal patient={selectedPatient} isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  )
}
