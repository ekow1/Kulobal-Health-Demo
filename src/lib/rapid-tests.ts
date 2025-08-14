export interface RapidTest {
  id: number
  name: string
  testType: string
  results: string
  status: string
  date: string
  conductedBy: string
  patientId?: number
  notes?: string
  priority?: string
}

export const rapidTestsData: RapidTest[] = [
  {
    id: 1,
    name: "John Doe",
    testType: "Blood Glucose",
    results: "145mg/dL",
    status: "Normal",
    date: "7th March 2023",
    conductedBy: "Dr. Smith",
    patientId: 1001,
    notes: "Fasting glucose test",
    priority: "routine",
  },
  {
    id: 2,
    name: "Jane Smith",
    testType: "Blood Pressure",
    results: "140/90 mmHg",
    status: "Elevated",
    date: "8th March 2023",
    conductedBy: "Dr. Johnson",
    patientId: 1002,
    notes: "Follow-up required",
    priority: "medium",
  },
  {
    id: 3,
    name: "Mike Wilson",
    testType: "Cholesterol",
    results: "250mg/dL",
    status: "High",
    date: "9th March 2023",
    conductedBy: "Dr. Brown",
    patientId: 1003,
    notes: "Dietary changes recommended",
    priority: "high",
  },
  {
    id: 4,
    name: "Sarah Davis",
    testType: "Blood Sugar",
    results: "180mg/dL",
    status: "BorderLine High",
    date: "10th March 2023",
    conductedBy: "Dr. Wilson",
    patientId: 1004,
    notes: "Monitor closely",
    priority: "medium",
  },
  {
    id: 5,
    name: "Robert Johnson",
    testType: "Hemoglobin",
    results: "12.5g/dL",
    status: "Normal",
    date: "11th March 2023",
    conductedBy: "Dr. Smith",
    patientId: 1005,
    notes: "Within normal range",
    priority: "routine",
  },
  {
    id: 6,
    name: "Emily Brown",
    testType: "Urine Test",
    results: "Protein +1",
    status: "Abnormal",
    date: "12th March 2023",
    conductedBy: "Dr. Davis",
    patientId: 1006,
    notes: "Requires further investigation",
    priority: "high",
  },
  {
    id: 7,
    name: "David Miller",
    testType: "ECG",
    results: "Normal Sinus Rhythm",
    status: "Normal",
    date: "13th March 2023",
    conductedBy: "Dr. Johnson",
    patientId: 1007,
    notes: "Heart rhythm normal",
    priority: "routine",
  },
  {
    id: 8,
    name: "Lisa Anderson",
    testType: "Thyroid Function",
    results: "TSH 8.5 mIU/L",
    status: "High",
    date: "14th March 2023",
    conductedBy: "Dr. Brown",
    patientId: 1008,
    notes: "Hypothyroidism suspected",
    priority: "high",
  },
]
