export interface Prescription {
  id: number
  patientName: string
  medication: string
  dosage: string
  frequency: string
  startDate: string
  endDate: string
  status: "Active" | "Completed" | "Ongoing"
}

export const prescriptionData: Prescription[] = [
  {
    id: 1,
    patientName: "Kelvin Lee",
    medication: "Paracetamol",
    dosage: "500mg",
    frequency: "Twice a day",
    startDate: "11th Jan 2023",
    endDate: "11th Feb 2023",
    status: "Active",
  },
  {
    id: 2,
    patientName: "Sophia Walker",
    medication: "Amoxicillin",
    dosage: "250mg",
    frequency: "Three times a day",
    startDate: "5th Feb 2023",
    endDate: "15th Feb 2023",
    status: "Completed",
  },
  {
    id: 3,
    patientName: "James Smith",
    medication: "Ibuprofen",
    dosage: "400mg",
    frequency: "Once a day",
    startDate: "10th Mar 2023",
    endDate: "20th Mar 2023",
    status: "Active",
  },
  {
    id: 4,
    patientName: "Linda Johnson",
    medication: "Metformin",
    dosage: "850mg",
    frequency: "Twice a day",
    startDate: "1st Apr 2023",
    endDate: "1st Jul 2023",
    status: "Ongoing",
  },
  {
    id: 5,
    patientName: "Michael Brown",
    medication: "Atorvastatin",
    dosage: "10mg",
    frequency: "Once a day",
    startDate: "15th May 2023",
    endDate: "15th Nov 2023",
    status: "Active",
  },
  {
    id: 6,
    patientName: "Emily Davis",
    medication: "Lisinopril",
    dosage: "20mg",
    frequency: "Once a day",
    startDate: "20th Jun 2023",
    endDate: "20th Dec 2023",
    status: "Ongoing",
  },
  {
    id: 7,
    patientName: "Daniel Martinez",
    medication: "Azithromycin",
    dosage: "500mg",
    frequency: "Once daily for 3 days",
    startDate: "25th Jul 2023",
    endDate: "28th Jul 2023",
    status: "Completed",
  },
  {
    id: 8,
    patientName: "Ava Wilson",
    medication: "Prednisone",
    dosage: "10mg",
    frequency: "Once a day",
    startDate: "1st Aug 2023",
    endDate: "31st Aug 2023",
    status: "Completed",
  },
  {
    id: 9,
    patientName: "Ethan Thomas",
    medication: "Losartan",
    dosage: "50mg",
    frequency: "Once a day",
    startDate: "10th Sep 2023",
    endDate: "10th Mar 2024",
    status: "Active",
  },
  {
    id: 10,
    patientName: "Mia Garcia",
    medication: "Omeprazole",
    dosage: "20mg",
    frequency: "Once before meals",
    startDate: "5th Oct 2023",
    endDate: "5th Nov 2023",
    status: "Completed",
  },
  {
    id: 11,
    patientName: "Alexander Rodriguez",
    medication: "Simvastatin",
    dosage: "40mg",
    frequency: "Once at bedtime",
    startDate: "12th Nov 2023",
    endDate: "12th May 2024",
    status: "Active",
  },
  {
    id: 12,
    patientName: "Isabella Chen",
    medication: "Levothyroxine",
    dosage: "75mcg",
    frequency: "Once daily on empty stomach",
    startDate: "8th Dec 2023",
    endDate: "8th Dec 2024",
    status: "Ongoing",
  },
  {
    id: 13,
    patientName: "William Anderson",
    medication: "Amlodipine",
    dosage: "5mg",
    frequency: "Once daily",
    startDate: "3rd Jan 2024",
    endDate: "3rd Jul 2024",
    status: "Active",
  },
  {
    id: 14,
    patientName: "Charlotte Thompson",
    medication: "Sertraline",
    dosage: "50mg",
    frequency: "Once daily",
    startDate: "15th Jan 2024",
    endDate: "15th Jul 2024",
    status: "Ongoing",
  },
  {
    id: 15,
    patientName: "Benjamin White",
    medication: "Gabapentin",
    dosage: "300mg",
    frequency: "Three times daily",
    startDate: "22nd Feb 2024",
    endDate: "22nd May 2024",
    status: "Completed",
  },
]

// Helper functions for data manipulation
export const getActivePrescrptions = () => {
  return prescriptionData.filter((prescription) => prescription.status === "Active")
}

export const getCompletedPrescriptions = () => {
  return prescriptionData.filter((prescription) => prescription.status === "Completed")
}

export const getOngoingPrescriptions = () => {
  return prescriptionData.filter((prescription) => prescription.status === "Ongoing")
}

export const getPrescriptionById = (id: number) => {
  return prescriptionData.find((prescription) => prescription.id === id)
}

export const searchPrescriptions = (searchTerm: string) => {
  const term = searchTerm.toLowerCase()
  return prescriptionData.filter(
    (prescription) =>
      prescription.patientName.toLowerCase().includes(term) ||
      prescription.medication.toLowerCase().includes(term) ||
      prescription.dosage.toLowerCase().includes(term) ||
      prescription.frequency.toLowerCase().includes(term),
  )
}
