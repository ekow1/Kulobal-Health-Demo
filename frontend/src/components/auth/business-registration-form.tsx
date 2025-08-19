"use client"
import { Button } from "@/components/ui/button"
import toast from "react-hot-toast"

import TextInput from "@/components/ui/text-input"
import Loader from "@/components/loader"
import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useAuthStore } from "@/store/auth-store"


// Complete schema for all form fields
const formSchema = z.object({
  businessName: z.string().min(1, "Business name is required"),
  ownerName: z.string().min(1, "Owner/Manager name is required"),
  location: z.string().min(1, "Location is required"),
  email: z.string().email("Please enter a valid email address"),
  telephone: z.string().min(1, "Telephone number is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["pharmacy", "supplier","otc"], {
    required_error: "Please select a role",
  }),
})

type FormData = z.infer<typeof formSchema>

interface BusinessRegistrationFormProps {
  onSuccess?: () => void
}

export default function BusinessRegistrationForm({ onSuccess }: BusinessRegistrationFormProps) {
  const { register, isLoading, error, clearError } = useAuthStore()
  const [currentStep, setCurrentStep] = useState(1)

  const {
    control,
    handleSubmit: hookFormSubmit,
    formState: { errors },
    trigger,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      businessName: "",
      ownerName: "",
      location: "",
      email: "",
      telephone: "",
      password: "",
      role: undefined,
    },
    mode: "onChange",
  })

  const handleNext = async () => {
    const isValid = await trigger(["businessName", "ownerName", "location"])
    if (isValid) {
      setCurrentStep(2)
      toast.success("Step 1 completed! Please fill in your contact details.", {
        icon: "✅",
      })
    } else {
      toast.error("Please fill in all required fields correctly.", {
        icon: "❌",
      })
    }
  }

  const handleBack = () => {
    setCurrentStep(1)
  }

  const onSubmit = async (data: FormData) => {
    clearError()

    // Show loading toast
    const loadingToast = toast.loading("Creating your account...", {
      icon: "⏳",
    })

    const result = await register({
      businessName: data.businessName,
      ownerName: data.ownerName,
      location: data.location,
      email: data.email,
      telephone: data.telephone,
      password: data.password,
      role: data.role,
    })

    // Dismiss loading toast
    toast.dismiss(loadingToast)

    if (result.success) {
      reset()
      onSuccess?.()
    }
  }

  if (currentStep === 1) {
    return (
      <>
        <div className="w-full max-w-sm text-emerald-600 font-bold mt-4 text-sm">
          Business Info <span className="float-right">1/2</span>
        </div>

        <form 
          onSubmit={(e) => {
            e.preventDefault()
            handleNext()
          }}
          className="w-full max-w-sm mt-6 space-y-4"
        >
          <div className="space-y-1">
            <Controller
              name="businessName"
              control={control}
              render={({ field }) => (
                <TextInput
                  placeholder="Enter business name"
                  label="Business Name"
                  value={field.value}
                  onChange={(e) => {
                    field.onChange(e.target.value)
                  }}
                />
              )}
            />
            {errors.businessName && <p className="text-red-500 text-xs mt-1">{errors.businessName.message}</p>}
          </div>

          <div className="space-y-1">
            <Controller
              name="ownerName"
              control={control}
              render={({ field }) => (
                <TextInput
                  placeholder="Enter owner/manager name"
                  label="Business Owner Name / Manager"
                  value={field.value}
                  onChange={(e) => {
                    field.onChange(e.target.value)
                  }}
                />
              )}
            />
            {errors.ownerName && <p className="text-red-500 text-xs mt-1">{errors.ownerName.message}</p>}
          </div>

          <div className="space-y-1">
            <Controller
              name="location"
              control={control}
              render={({ field }) => (
                <TextInput
                  placeholder="Enter location"
                  label="Location"
                  value={field.value}
                  onChange={(e) => {
                    field.onChange(e.target.value)
                  }}
                />
              )}
            />
            {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location.message}</p>}
          </div>

          <Button className="w-full" variant="default" type="submit">
            Continue
          </Button>
        </form>
      </>
    )
  }

  return (
    <>
      {error && (
        <div className="w-full max-w-sm bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded-md text-sm mb-4">
          {error}
        </div>
      )}
      <div className="w-full max-w-sm text-emerald-600 font-bold mt-4 text-sm">
        Contact & Role <span className="float-right">2/2</span>
      </div>

      <form onSubmit={hookFormSubmit(onSubmit)} className="w-full max-w-sm mt-6 space-y-4">
        <div className="space-y-1">
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextInput
                placeholder="Enter business email"
                label="Business Email Address"
                value={field.value}
                onChange={(e) => {
                  field.onChange(e.target.value)
                }}
              />
            )}
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>

        <div className="space-y-1">
          <Controller
            name="telephone"
            control={control}
            render={({ field }) => (
              <TextInput
                placeholder="Enter telephone number"
                label="Telephone Number"
                value={field.value}
                onChange={(e) => {
                  field.onChange(e.target.value)
                }}
              />
            )}
          />
          {errors.telephone && <p className="text-red-500 text-xs mt-1">{errors.telephone.message}</p>}
        </div>

        <div className="space-y-1">
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <TextInput
                placeholder="Enter password"
                label="Password"
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
              />
            )}
          />
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700 mb-3">Select Role</label>
          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <div className="space-y-4">
                <div className="flex py-3 gap-4">
                  <label className="flex items-center gap-3 text-sm cursor-pointer">
                    <input
                      type="radio"
                      value="pharmacy"
                      checked={field.value === "pharmacy"}
                      onChange={(e) => field.onChange(e.target.value)}
                      className="accent-emerald-600 w-4 h-4"
                    />
                    <span>PHARMACY</span>
                  </label>
                  <label className="flex items-center gap-3 text-sm cursor-pointer">
                    <input
                      type="radio"
                      value="supplier"
                      checked={field.value === "supplier"}
                      onChange={(e) => field.onChange(e.target.value)}
                      className="accent-emerald-600 w-4 h-4"
                    />
                    <span>SUPPLIER</span>
                  </label>
                  <label className="flex items-center gap-3 text-sm cursor-pointer">
                    <input
                      type="radio"
                      value="otc"
                      checked={field.value === "otc"}
                      onChange={(e) => field.onChange(e.target.value)}
                      className="accent-emerald-600 w-4 h-4"
                    />
                    <span>OTC</span>
                  </label>
                </div>
              </div>
            )}
          />
          {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role.message}</p>}
        </div>

        <div className="flex gap-3">
          <Button type="button" variant="outline" className="flex-1" onClick={handleBack}>
            Back
          </Button>
          <Button className="flex-1" variant="default" type="submit" disabled={isLoading}>
            {isLoading ? <Loader /> : "Register Business"}
          </Button>
        </div>
      </form>
    </>
  )
} 