"use client"

import { useState } from "react"
import { Navbar } from "./navbar"
import { Sidebar } from "./sidebar"
import { DashboardContent } from "./dashboard-content"
import MainFrom from "./main-form"
import AddUserForm from "./add-user-form"
import OrdersTracking from "./order-tracking"

export function DashboardPage() {
  const [activeSection, setActiveSection] = useState("dashboard")

  return (
    (<div className="flex min-h-screen flex-col bg-[#F8F8F8]">
      <div className="flex-1 flex">
        <aside className="fixed hidden h-full w-64 lg:block">
          <Sidebar setActiveSection={setActiveSection} />
        </aside>
        <main className="flex-1 lg:pl-64">
           <Navbar className="lg:pl-64" />
          {activeSection === "dashboard" && <DashboardContent />}
          {activeSection === "add-product" && <MainFrom />}
          {activeSection === "add-user" && <AddUserForm />}
          {activeSection === "order-tracking" && <OrdersTracking />}
        </main>
      </div>
    </div>)
  );
}

