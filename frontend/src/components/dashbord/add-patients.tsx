"use client"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useState } from "react"
import { User } from "lucide-react"

export default function AddPatients() {
    const [allergies, setAllergies] = useState<string[]>([])

    const handleAllergyChange = (allergy: string) => {
        setAllergies(prev =>
            prev.includes(allergy)
                ? prev.filter(a => a !== allergy)
                : [...prev, allergy]
        )
    }

    return (
        <Dialog>
            <DialogTrigger className="btn btn-primary">
                <Button className="bg-emerald-600 text-white w-[200px]">
                    <User width={24} height={24} />
                    Add Patient
                </Button>
            </DialogTrigger>
            <DialogContent className=" min-w-[1000px]  " >
                <DialogHeader>
                    <div className="flex items-center justify-between w-full pb-4 border-b border-b-gray-200">
                        <DialogTitle>Register Patient</DialogTitle>
                    </div>
                    <DialogDescription>
                        Register a new patient and capture their health information.
                    </DialogDescription>
                </DialogHeader>

                {/* Form Fields */}
                <div className="grid grid-cols-2 gap-4 w-full">
                    <div>
                        <Label>First Name</Label>
                        <Input placeholder="Enter your first name" />
                    </div>
                    <div>
                        <Label>Last Name</Label>
                        <Input placeholder="Enter your last name" />
                    </div>
                    <div>
                        <Label>Date of Birth</Label>
                        <Input type="date" />
                    </div>
                    <div>
                        <Label>Gender</Label>
                        <div className="flex gap-4 mt-2">
                            <label className="flex items-center gap-1">
                                <input type="radio" name="gender" value="Male" />
                                Male
                            </label>
                            <label className="flex items-center gap-1">
                                <input type="radio" name="gender" value="Female" />
                                Female
                            </label>
                        </div>
                    </div>
                    <div>
                        <Label>Email</Label>
                        <Input type="email" placeholder="Enter email" />
                    </div>
                    <div>
                        <Label>Phone Number</Label>
                        <div className="flex">
                            <span className="bg-gray-100 px-2 flex items-center rounded-l">+233</span>
                            <Input className="rounded-l-none" placeholder="eg. 0546977343" />
                        </div>
                    </div>
                    <div className="col-span-2">
                        <Label>Address</Label>
                        <Input placeholder="Enter patient's address" />
                    </div>
                    <div className="col-span-2">
                        <Label>Medical History</Label>
                        <Select>
                            <SelectTrigger>
                                <SelectValue placeholder="Medical History" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="diabetes">Diabetes</SelectItem>
                                <SelectItem value="hypertension">Hypertension</SelectItem>
                                <SelectItem value="asthma">Asthma</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="col-span-2">
                        <Label>Allergies</Label>
                        <div className="flex flex-wrap gap-4 mt-2">
                            {["Penicillin", "Sulfa Drugs", "NSAIDs", "Latex"].map(allergy => (
                                <label key={allergy} className="flex items-center gap-2">
                                    <Checkbox
                                        checked={allergies.includes(allergy)}
                                        onCheckedChange={() => handleAllergyChange(allergy)}
                                    />
                                    {allergy}
                                </label>
                            ))}
                        </div>
                    </div>
                </div>


                {/* Add your form inputs here */}

                <DialogFooter className="mt-6 border-t border-t-gray-200 pt-4">
                    <Button variant="ghost">Cancel</Button>
                    <Button type="submit">Register Patient</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
