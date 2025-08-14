import fs from "fs/promises"
import path from "path"
import { User } from "./auth"


// Define the database directory and ensure it exists
const DB_DIR = path.join(process.cwd(), "db")
const USERS_FILE = path.join(DB_DIR, "users.json")

// Initialize the database
export async function initDatabase() {
  try {
    await fs.mkdir(DB_DIR, { recursive: true })

    // Check if users.json exists, if not create it with initial data
    try {
      await fs.access(USERS_FILE)
    } catch {
      // Initial seed data
      const initialUsers: User[] = [
        {
          id: "1",
          businessName: "City Pharmacy",
          ownerName: "John Doe",
          location: "Accra, Ghana",
          email: "john@pharmacy.com",
          telephone: "+233 24 123 4567",
          avatar: "/placeholder.svg?height=40&width=40",
          role: "pharmacy",
          createdAt: "2024-01-15T10:00:00Z",
        },
        {
          id: "2",
          businessName: "MedSupply Ghana Ltd",
          ownerName: "Jane Smith",
          location: "Kumasi, Ghana",
          email: "jane@supplier.com",
          telephone: "+233 20 987 6543",
          avatar: "/placeholder.svg?height=40&width=40",
          role: "supplier",
          createdAt: "2024-01-10T08:30:00Z",
        },
        {
          id: "3",
          businessName: "KulobalHealth",
          ownerName: "Admin User",
          location: "Accra, Ghana",
          email: "admin@kulobalhealth.com",
          telephone: "+233 30 555 0000",
          avatar: "/placeholder.svg?height=40&width=40",
          role: "pharmacy",
          createdAt: "2024-01-01T00:00:00Z",
        },
      ]
      await fs.writeFile(USERS_FILE, JSON.stringify(initialUsers, null, 2))
    }
  } catch (error) {
    console.error("Failed to initialize database:", error)
  }
}

// Get all users
export async function getUsers(): Promise<User[]> {
  try {
    const data = await fs.readFile(USERS_FILE, "utf8")
    return JSON.parse(data)
  } catch (error) {
    console.error("Failed to read users:", error)
    return []
  }
}

// Get user by email
export async function getUserByEmail(email: string): Promise<User | undefined> {
  const users = await getUsers()
  return users.find((user) => user.email === email)
}

// Get user by business name
export async function getUserByBusinessName(businessName: string): Promise<User | undefined> {
  const users = await getUsers()
  return users.find((user) => user.businessName.toLowerCase() === businessName.toLowerCase())
}

// Add a new user
export async function addUser(user: User): Promise<User> {
  const users = await getUsers()
  users.push(user)
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2))
  return user
}

// Update a user
export async function updateUser(id: string, userData: Partial<User>): Promise<User | undefined> {
  const users = await getUsers()
  const index = users.findIndex((user) => user.id === id)

  if (index !== -1) {
    users[index] = { ...users[index], ...userData }
    await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2))
    return users[index]
  }

  return undefined
}

// Delete a user
export async function deleteUser(id: string): Promise<boolean> {
  const users = await getUsers()
  const filteredUsers = users.filter((user) => user.id !== id)

  if (filteredUsers.length < users.length) {
    await fs.writeFile(USERS_FILE, JSON.stringify(filteredUsers, null, 2))
    return true
  }

  return false
}
