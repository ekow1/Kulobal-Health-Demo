"use client"
import PatientRegistration from "@/components/dashbord/add-patients"
import type React from "react"

import { useState } from "react"
import TableHeaderComponent from "@/components/dashbord/table-header"
import PatientTable from "@/components/dashbord/patients"


export default function Patients() {
  const [searchTerm, setSearchTerm] = useState("")

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
  }

  return (
    <div className="w-full min-h-screen dark:bg-transparent py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <TableHeaderComponent
            handleSearch={handleSearch}
            title="Patient Management"
            text="Manage your patients effectively and track their medical records mb-10"
            component={<PatientRegistration />}
          />

          <PatientTable searchTerm={searchTerm} />
        </div>
      </div>
    </div>
  )
}
