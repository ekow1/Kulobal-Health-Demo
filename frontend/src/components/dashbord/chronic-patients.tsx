import { Heart, AlertCircle } from "lucide-react"

export default function ChronicPatients() {
  const patients = [
    { name: "Kwame Asante", condition: "Diabetes Type 2", status: "stable", lastVisit: "2 days ago", riskLevel: "low" },
    {
      name: "Akosua Mensah",
      condition: "Hypertension",
      status: "attention",
      lastVisit: "1 week ago",
      riskLevel: "medium",
    },
    { name: "Kofi Osei", condition: "Asthma", status: "stable", lastVisit: "3 days ago", riskLevel: "low" },
    { name: "Ama Boateng", condition: "Heart Disease", status: "critical", lastVisit: "Today", riskLevel: "high" },
    { name: "Yaw Adjei", condition: "Diabetes Type 1", status: "stable", lastVisit: "5 days ago", riskLevel: "low" },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "stable":
        return "text-green-700 bg-green-100 border-green-200"
      case "attention":
        return "text-yellow-700 bg-yellow-100 border-yellow-200"
      case "critical":
        return "text-red-700 bg-red-100 border-red-200"
      default:
        return "text-gray-700 bg-gray-100 border-gray-200"
    }
  }

  const getRiskIcon = (riskLevel: string) => {
    if (riskLevel === "high") {
      return <AlertCircle className="w-4 h-4 text-red-600" />
    }
    return <Heart className="w-4 h-4 text-green-600" />
  }

  return (
    <div className="bg-white border-2 border-green-100 rounded-2xl p-6 dark:bg-transparent dark:border-gray-800">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Chronic Patients</h3>
        <div className="flex items-center space-x-2 bg-green-50 px-4 py-2 rounded-xl border-2 border-green-200">
          <Heart className="w-4 h-4 text-green-600" />
          <span className="text-sm font-semibold text-green-800">{patients.length} Patients</span>
        </div>
      </div>
      <div className="space-y-4">
        {patients.map((patient, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 bg-gray-50 dark:bg-transparent dark:text-white rounded-xl border-2 border-transparent hover:border-green-200 transition-all duration-200"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center border-2 border-green-200">
                <span className="text-green-700 font-bold text-sm">
                  {patient.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </span>
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">{patient.name}</p>
                <p className="text-sm text-gray-600 dark:text-white">{patient.condition}</p>
                <p className="text-xs text-gray-500 mt-1 dark:text-white">Last visit: {patient.lastVisit}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {getRiskIcon(patient.riskLevel)}
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold border-2 ${getStatusColor(patient.status)}`}
              >
                {patient.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
