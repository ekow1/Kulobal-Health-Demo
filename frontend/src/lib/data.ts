export interface MedicalCondition {
  id: number;
  condition: string;
  dateRecorded: string;
  remarks: string;
}

export interface Allergy {
  id: number;
  allergy: string;
  severity: "Mild" | "Moderate" | "Severe";
  dateRecorded: string;
  remarks: string;
}

export interface Medication {
  id: number;
  name: string;
  category: string;
  type: string;
  brand: string;
  prescribedBy: string;
  dosage: string;
  route: string;
  dateStarted: string;
  dateEnded?: string;
  status: "Active" | "Discontinued" | "Completed";
}

export interface TestResult {
  id: number;
  testName: string;
  category: string;
  result: string;
  normalRange?: string;
  units?: string;
  date: string;
  orderedBy: string;
  remarks?: string;
}

export interface VitalSign {
  id: number;
  date: string;
  bloodPressure?: string;
  pulse?: number;
  temperature?: number;
  respiratoryRate?: number;
  oxygenSaturation?: number;
  weight?: number;
  height?: number;
  bmi?: number;
  bloodSugar?: number;
  recordedBy: string;
}

export interface Patient {
  id: number;
  name: string;
  telephone: string;
  dateOfBirth: string;
  gender: string;
  location: string;
  status: "active" | "inactive";
  needsRefill: boolean;
  medicalConditions?: MedicalCondition[];
  allergies?: Allergy[];
  medications?: Medication[];
  testHistory?: TestResult[];
  vitalSigns?: VitalSign[];
}

export const patients: Patient[] = [
  {
    id: 1,
    name: "James Oduro",
    telephone: "055780874",
    dateOfBirth: "1986-11-05",
    gender: "Male",
    location: "Accra Central",
    status: "active",
    needsRefill: false,
    medicalConditions: [
      {
        id: 1,
        condition: "Hypertension",
        dateRecorded: "2023-05-12",
        remarks: "Stage 1, well managed with medication",
      },
      {
        id: 2,
        condition: "Type 2 Diabetes",
        dateRecorded: "2022-11-03",
        remarks: "HbA1c: 6.8%",
      },
    ],
    allergies: [
      {
        id: 1,
        allergy: "Penicillin",
        severity: "Severe",
        dateRecorded: "2020-03-15",
        remarks: "Rash and difficulty breathing",
      },
    ],
    medications: [
      {
        id: 1,
        name: "Metformin",
        category: "Antidiabetic",
        type: "Oral",
        brand: "Glucophage",
        prescribedBy: "Dr. Asamoah",
        dosage: "500mg twice daily",
        route: "Oral",
        dateStarted: "2022-11-05",
        status: "Active",
      },
      {
        id: 2,
        name: "Lisinopril",
        category: "Antihypertensive",
        type: "Oral",
        brand: "Zestril",
        prescribedBy: "Dr. Asamoah",
        dosage: "10mg once daily",
        route: "Oral",
        dateStarted: "2023-05-15",
        status: "Active",
      },
    ],
    testHistory: [
      {
        id: 1,
        testName: "HbA1c",
        category: "Blood Test",
        result: "6.8%",
        normalRange: "<5.7%",
        date: "2024-02-15",
        orderedBy: "Dr. Asamoah",
        remarks: "Follow-up in 3 months",
      },
      {
        id: 2,
        testName: "Lipid Panel",
        category: "Blood Test",
        result: "LDL: 125 mg/dL, HDL: 45 mg/dL, Triglycerides: 150 mg/dL",
        normalRange: "LDL <100 mg/dL, HDL >40 mg/dL, Triglycerides <150 mg/dL",
        date: "2024-02-15",
        orderedBy: "Dr. Asamoah",
      },
    ],
    vitalSigns: [
      {
        id: 1,
        date: "2024-04-10",
        bloodPressure: "138/88",
        pulse: 72,
        temperature: 36.6,
        respiratoryRate: 16,
        oxygenSaturation: 98,
        weight: 82,
        height: 175,
        bmi: 26.8,
        bloodSugar: 128,
        recordedBy: "Nurse Abigail",
      },
      {
        id: 2,
        date: "2024-01-15",
        bloodPressure: "142/90",
        pulse: 75,
        temperature: 36.7,
        respiratoryRate: 18,
        weight: 84,
        height: 175,
        bmi: 27.4,
        bloodSugar: 135,
        recordedBy: "Nurse Sarah",
      },
    ],
  },
  {
    id: 2,
    name: "Frank Odoi",
    telephone: "0256780758",
    dateOfBirth: "1999-07-19",
    gender: "Male",
    location: "Pokuase",
    status: "active",
    needsRefill: true,
    medicalConditions: [
      {
        id: 1,
        condition: "Asthma",
        dateRecorded: "2018-08-22",
        remarks: "Mild intermittent, triggered by dust and pollen",
      },
    ],
    allergies: [
      {
        id: 1,
        allergy: "Pollen",
        severity: "Moderate",
        dateRecorded: "2018-08-22",
        remarks: "Seasonal allergic rhinitis",
      },
      {
        id: 2,
        allergy: "Dust mites",
        severity: "Moderate",
        dateRecorded: "2018-08-22",
        remarks: "Triggers asthmatic symptoms",
      },
    ],
    medications: [
      {
        id: 1,
        name: "Salbutamol",
        category: "Bronchodilator",
        type: "Inhaler",
        brand: "Ventolin",
        prescribedBy: "Dr. Mensah",
        dosage: "2 puffs as needed",
        route: "Inhalation",
        dateStarted: "2018-08-25",
        status: "Active",
      },
      {
        id: 2,
        name: "Fluticasone",
        category: "Corticosteroid",
        type: "Inhaler",
        brand: "Flonase",
        prescribedBy: "Dr. Mensah",
        dosage: "1 puff twice daily",
        route: "Inhalation",
        dateStarted: "2023-11-10",
        status: "Active",
      },
    ],
    testHistory: [
      {
        id: 1,
        testName: "Spirometry",
        category: "Pulmonary Function Test",
        result: "FEV1: 85% predicted",
        date: "2023-11-05",
        orderedBy: "Dr. Mensah",
        remarks: "Mild airflow obstruction",
      },
    ],
    vitalSigns: [
      {
        id: 1,
        date: "2024-03-20",
        bloodPressure: "118/75",
        pulse: 68,
        temperature: 36.5,
        respiratoryRate: 15,
        oxygenSaturation: 97,
        weight: 70,
        height: 180,
        bmi: 21.6,
        recordedBy: "Nurse Daniel",
      },
    ],
  },
  {
    id: 3,
    name: "John Doe",
    telephone: "0241164088",
    dateOfBirth: "2024-11-01",
    gender: "Male",
    location: "Legon, Accra",
    status: "active",
    needsRefill: false,
    medicalConditions: [],
    allergies: [],
    medications: [],
    testHistory: [],
    vitalSigns: [
      {
        id: 1,
        date: "2024-03-15",
        bloodPressure: "90/60",
        pulse: 120,
        temperature: 36.8,
        respiratoryRate: 30,
        oxygenSaturation: 99,
        weight: 3.8,
        height: 52,
        recordedBy: "Nurse Mary",
      },
    ],
  },
  {
    id: 4,
    name: "Joyce Boadiwaa",
    telephone: "05783884848",
    dateOfBirth: "1984-06-07",
    gender: "Female",
    location: "Pokuase",
    status: "active",
    needsRefill: true,
    medicalConditions: [
      {
        id: 1,
        condition: "Migraine",
        dateRecorded: "2022-01-10",
        remarks: "With aura, triggers include stress and lack of sleep",
      },
      {
        id: 2,
        condition: "Iron deficiency anemia",
        dateRecorded: "2023-05-18",
        remarks: "Supplementing with ferrous sulfate",
      },
    ],
    allergies: [],
    medications: [
      {
        id: 1,
        name: "Sumatriptan",
        category: "Antimigraine",
        type: "Tablet",
        brand: "Imitrex",
        prescribedBy: "Dr. Osei",
        dosage: "50mg as needed",
        route: "Oral",
        dateStarted: "2022-01-15",
        status: "Active",
      },
      {
        id: 2,
        name: "Ferrous Sulfate",
        category: "Iron Supplement",
        type: "Tablet",
        brand: "Feosol",
        prescribedBy: "Dr. Osei",
        dosage: "325mg once daily",
        route: "Oral",
        dateStarted: "2023-05-20",
        status: "Active",
      },
    ],
    testHistory: [
      {
        id: 1,
        testName: "Complete Blood Count",
        category: "Blood Test",
        result: "Hemoglobin: 10.2 g/dL",
        normalRange: "12.0-15.5 g/dL",
        units: "g/dL",
        date: "2024-01-22",
        orderedBy: "Dr. Osei",
        remarks: "Confirmed anemia",
      },
      {
        id: 2,
        testName: "Ferritin",
        category: "Blood Test",
        result: "15 ng/mL",
        normalRange: "20-200 ng/mL",
        units: "ng/mL",
        date: "2024-01-22",
        orderedBy: "Dr. Osei",
        remarks: "Confirming iron deficiency",
      },
    ],
    vitalSigns: [
      {
        id: 1,
        date: "2024-02-10",
        bloodPressure: "110/70",
        pulse: 78,
        temperature: 36.5,
        respiratoryRate: 14,
        oxygenSaturation: 98,
        weight: 65,
        height: 165,
        bmi: 23.9,
        recordedBy: "Nurse Faustina",
      },
    ],
  },
  {
    id: 5,
    name: "Ben Hughes",
    telephone: "0595243502",
    dateOfBirth: "2018-02-27",
    gender: "Male",
    location: "Legon, Accra",
    status: "inactive",
    needsRefill: false,
    medicalConditions: [
      {
        id: 1,
        condition: "Attention Deficit Hyperactivity Disorder (ADHD)",
        dateRecorded: "2023-03-12",
        remarks: "Diagnosed by child psychiatrist",
      },
    ],
    allergies: [
      {
        id: 1,
        allergy: "Eggs",
        severity: "Moderate",
        dateRecorded: "2020-05-30",
        remarks: "Skin rash and hives",
      },
    ],
    medications: [
      {
        id: 1,
        name: "Methylphenidate",
        category: "Stimulant",
        type: "Tablet",
        brand: "Ritalin",
        prescribedBy: "Dr. Addo",
        dosage: "5mg once daily",
        route: "Oral",
        dateStarted: "2023-04-05",
        dateEnded: "2023-12-10",
        status: "Discontinued",
      },
    ],
    testHistory: [
      {
        id: 1,
        testName: "ADHD Assessment",
        category: "Psychiatric Evaluation",
        result: "Positive for ADHD",
        date: "2023-03-10",
        orderedBy: "Dr. Addo",
      },
    ],
    vitalSigns: [
      {
        id: 1,
        date: "2023-12-05",
        bloodPressure: "95/60",
        pulse: 100,
        temperature: 36.7,
        respiratoryRate: 20,
        weight: 22,
        height: 112,
        recordedBy: "Nurse Peter",
      },
    ],
  },
  {
    id: 6,
    name: "Anthony Amponsah",
    telephone: "0594818451",
    dateOfBirth: "1989-02-21",
    gender: "Male",
    location: "Dansoman",
    status: "active",
    needsRefill: true,
    medicalConditions: [
      {
        id: 1,
        condition: "Gastroesophageal Reflux Disease (GERD)",
        dateRecorded: "2023-08-14",
        remarks: "Triggered by spicy foods and stress",
      },
    ],
    allergies: [
      {
        id: 1,
        allergy: "Sulfa drugs",
        severity: "Moderate",
        dateRecorded: "2019-04-23",
        remarks: "Skin rash and itching",
      },
    ],
    medications: [
      {
        id: 1,
        name: "Esomeprazole",
        category: "Proton Pump Inhibitor",
        type: "Capsule",
        brand: "Nexium",
        prescribedBy: "Dr. Kusi",
        dosage: "40mg once daily",
        route: "Oral",
        dateStarted: "2023-08-16",
        status: "Active",
      },
    ],
    testHistory: [
      {
        id: 1,
        testName: "Upper Endoscopy",
        category: "Diagnostic Procedure",
        result: "Mild esophagitis",
        date: "2023-08-10",
        orderedBy: "Dr. Kusi",
        remarks: "Consistent with GERD",
      },
    ],
    vitalSigns: [
      {
        id: 1,
        date: "2024-03-05",
        bloodPressure: "125/82",
        pulse: 76,
        temperature: 36.6,
        respiratoryRate: 14,
        oxygenSaturation: 99,
        weight: 78,
        height: 178,
        bmi: 24.6,
        recordedBy: "Nurse Victoria",
      },
    ],
  },
  {
    id: 7,
    name: "Clifford Obeng",
    telephone: "05532457",
    dateOfBirth: "1991-02-12",
    gender: "Male",
    location: "Mayera",
    status: "active",
    needsRefill: false,
    medicalConditions: [
      {
        id: 1,
        condition: "Lower back pain",
        dateRecorded: "2023-11-30",
        remarks: "Muscular in origin, due to poor posture at work",
      },
    ],
    allergies: [],
    medications: [
      {
        id: 1,
        name: "Diclofenac",
        category: "NSAID",
        type: "Tablet",
        brand: "Voltaren",
        prescribedBy: "Dr. Owusu",
        dosage: "50mg three times daily",
        route: "Oral",
        dateStarted: "2023-11-30",
        dateEnded: "2023-12-14",
        status: "Completed",
      },
    ],
    testHistory: [
      {
        id: 1,
        testName: "Lumbar X-ray",
        category: "Imaging",
        result: "No abnormalities detected",
        date: "2023-11-28",
        orderedBy: "Dr. Owusu",
      },
    ],
    vitalSigns: [
      {
        id: 1,
        date: "2023-11-30",
        bloodPressure: "120/78",
        pulse: 68,
        temperature: 36.5,
        respiratoryRate: 14,
        oxygenSaturation: 99,
        weight: 75,
        height: 182,
        bmi: 22.6,
        recordedBy: "Nurse Jonathan",
      },
    ],
  },
];
