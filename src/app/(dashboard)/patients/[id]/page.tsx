"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Box } from "lucide-react";
import { patients } from "@/lib/data";
import { MedicalHistory } from "@/components/patient/medical-history";
import { PatientMedications } from "@/components/patient/medications";
import { TestHistory } from "@/components/patient/test-history";
import { PatientVitals } from "@/components/patient/vitals";

export default function PatientDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const patient = patients.find((patient) => patient.id === Number(id));

  if (!patient) {
    notFound();
  }

  return (
    <section className="py-10">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Link
                href="/patients"
                className="text-muted-foreground hover:underline"
              >
                Patients
              </Link>
              <span className="text-muted-foreground">/</span>
              <span>Patient details</span>
            </div>
            <h1 className="text-2xl font-bold">{patient?.name}</h1>
          </div>
          <Button variant="destructive">Delete customer</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Tabs defaultValue="overview">
              <TabsList className="mb-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="medical-history">
                  Medical History
                </TabsTrigger>
                <TabsTrigger value="medications">Medications</TabsTrigger>
                <TabsTrigger value="test-history">Test History</TabsTrigger>
                <TabsTrigger value="vitals">Vitals</TabsTrigger>
                <TabsTrigger value="actions">Actions</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="border rounded-md p-6">
                <div>
                  <h2 className="text-lg font-medium mb-4">
                    Patient Current activities.
                  </h2>
                  <Tabs defaultValue="this-week" className="mb-4">
                    <TabsList>
                      <TabsTrigger value="this-week">This week</TabsTrigger>
                      <TabsTrigger value="next-week">Next week</TabsTrigger>
                    </TabsList>

                    <TabsContent value="this-week">
                      <div className="flex flex-col items-center justify-center py-12">
                        <div className="w-24 h-24 mb-4">
                          <Box className="w-full h-full text-orange-400" />
                        </div>
                        <h3 className="text-lg font-medium">No Data Added</h3>
                        <p className="text-muted-foreground">
                          There is no data available for this week.
                        </p>
                      </div>
                    </TabsContent>

                    <TabsContent value="next-week">
                      <div className="flex flex-col items-center justify-center py-12">
                        <div className="w-24 h-24 mb-4">
                          <Box className="w-full h-full text-orange-400" />
                        </div>
                        <h3 className="text-lg font-medium">No Data Added</h3>
                        <p className="text-muted-foreground">
                          There is no data available for next week.
                        </p>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </TabsContent>

              <TabsContent value="medical-history">
                <MedicalHistory
                  medicalConditions={patient.medicalConditions || []}
                  allergies={patient.allergies || []}
                />
              </TabsContent>

              <TabsContent value="medications">
                <PatientMedications medications={patient.medications || []} />
              </TabsContent>

              <TabsContent value="test-history">
                <TestHistory testHistory={patient.testHistory || []} />
              </TabsContent>

              <TabsContent value="vitals">
                <PatientVitals vitalSigns={patient.vitalSigns || []} />
              </TabsContent>

              <TabsContent value="actions">
                <div className="border rounded-md p-6">
                  <p>Actions content will appear here.</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Contact info</CardTitle>
                <Button variant="ghost" size="sm">
                  Edit
                </Button>
              </CardHeader>
              <CardContent>
                <div className="mb-2">
                  <Badge
                    variant="secondary"
                    className="bg-pink-100 text-pink-800 hover:bg-pink-100"
                  >
                    {patient.id}
                  </Badge>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2">
                    <div className="text-muted-foreground">First name</div>
                    <div className="text-right">{patient.name}</div>
                  </div>

                  {/* <div className="grid grid-cols-2">
                    <div className="text-muted-foreground">Last name</div>
                    <div className="text-right">{patient.lastName}</div>
                  </div> */}

                  <div className="grid grid-cols-2">
                    <div className="text-muted-foreground">Telephone</div>
                    <div className="text-right">{patient.telephone}</div>
                  </div>

                  <div className="grid grid-cols-2">
                    <div className="text-muted-foreground">Gender</div>
                    <div className="text-right">{patient.gender}</div>
                  </div>

                  <div className="grid grid-cols-2">
                    <div className="text-muted-foreground">Date of Birth</div>
                    <div className="text-right">{patient.dateOfBirth}</div>
                  </div>

                  {/* <div className="grid grid-cols-2">
                    <div className="text-muted-foreground">Age</div>
                    <div className="text-right text-pink-500">
                      {patient.age}
                    </div>
                  </div> */}

                  <div className="grid grid-cols-2">
                    <div className="text-muted-foreground">Location</div>
                    <div className="text-right">{patient.location}</div>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="font-medium mb-2">
                    Vitals Signs{" "}
                    <span className="text-green-500 text-sm float-right">
                      view
                    </span>
                  </h3>
                  <div className="space-y-2">
                    <div className="grid grid-cols-2">
                      <div className="text-muted-foreground">
                        Blood Pressure
                      </div>
                      <div className="text-right text-blue-500">
                        {patient.vitalSigns && patient.vitalSigns.length > 0
                          ? patient.vitalSigns[0].bloodPressure || "0/0"
                          : "0/0"}
                      </div>
                    </div>

                    <div className="grid grid-cols-2">
                      <div className="text-muted-foreground">Blood Sugar</div>
                      <div className="text-right">
                        {patient.vitalSigns && patient.vitalSigns.length > 0
                          ? patient.vitalSigns[0].bloodSugar || "0"
                          : "0"}
                      </div>
                    </div>

                    <div className="grid grid-cols-2">
                      <div className="text-muted-foreground">Weight</div>
                      <div className="text-right">
                        {patient.vitalSigns && patient.vitalSigns.length > 0
                          ? patient.vitalSigns[0].weight || "0"
                          : "0"}
                      </div>
                    </div>

                    <div className="grid grid-cols-2">
                      <div className="text-muted-foreground">Height</div>
                      <div className="text-right">
                        {patient.vitalSigns && patient.vitalSigns.length > 0
                          ? patient.vitalSigns[0].height || "0"
                          : "0"}
                      </div>
                    </div>

                    <div className="grid grid-cols-2">
                      <div className="text-muted-foreground">BMI</div>
                      <div className="text-right">
                        {patient.vitalSigns && patient.vitalSigns.length > 0
                          ? `${patient.vitalSigns[0].bmi || "0"}kg/m²`
                          : "0kg/m²"}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="font-medium mb-2">
                    Current RDT{" "}
                    <span className="text-green-500 text-sm float-right">
                      view
                    </span>
                  </h3>
                  <div className="grid grid-cols-2">
                    <div className="text-muted-foreground">Typhoid</div>
                    <div className="text-right text-green-500">Positive</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
