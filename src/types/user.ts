export interface User {
  id: string
  businessName: string
  ownerName: string
  location: string
  email: string
  telephone: string
  avatar?: string
  role: "pharmacy" | "supplier" | "otc" | "admin"
  createdAt: string
}

export interface RegisterData {
  businessName: string
  ownerName: string
  location: string
  email: string
  telephone: string
  password: string
  role: "pharmacy" | "supplier" | "otc" | "admin"
}
