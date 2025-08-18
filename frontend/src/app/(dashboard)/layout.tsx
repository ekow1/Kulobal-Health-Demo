import type React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { Inter } from "next/font/google"
import Footer from "@/components/dashbord/footer"
import { SidebarProvider, SidebarInset} from "@/components/ui/sidebar"
import { DashboardNavbar } from "@/components/dashbord/navbar"
import { FloatingBottomNavbar } from "@/components/floating-navbar"

const inter = Inter({ subsets: ["latin"] })

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className=" w-full min-h-screen bg-white " style={{ fontFamily: inter.style.fontFamily }}>
      

      <SidebarProvider>
        <SidebarInset>
          <main className="flex min-h-screen b items-center justify-center">
           <DashboardNavbar />
            <div className=" h-full  flex p-4 md:py-24   w-[85%]">
               <AppSidebar />
         
              {children}
            </div>
            <FloatingBottomNavbar />
          </main>
        </SidebarInset>
      </SidebarProvider>

      <Footer />
    </div>
  )
}
