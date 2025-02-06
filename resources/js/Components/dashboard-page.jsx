"use client"

import { useState } from "react"
import { Navbar } from "./navbar"
import { Sidebar } from "./sidebar"
import { DashboardContent } from "./dashboard-content"
import MainFrom from "./main-form"
import AddUserForm from "./add-user-form"
import OrdersTracking from "./order-tracking"
import AllProducts from "./all-products"
import AllUsers from "./all-users"

export function DashboardPage() {
  const [activeSection, setActiveSection] = useState("dashboard")
  const [Id, setId] = useState()
  const [productData, setproductData] = useState()
  const [UserData, setuserData] = useState()
  console.log(activeSection);
  console.log(UserData);
  
  return (
    (<div className="flex min-h-screen flex-col bg-[#F8F8F8]">
      <div className="flex-1 flex">
        <aside className="fixed hidden h-full w-64 lg:block">
          <Sidebar setActiveSection={setActiveSection} />
        </aside>
        <main className="flex-1 lg:pl-64">
           <Navbar className="lg:pl-64" setActiveSection={setActiveSection} />
          {activeSection === "dashboard" && <DashboardContent />}
          {activeSection === "add-product" && <MainFrom Id={Id} productData={productData}/>}
          {activeSection === "add-user" && <AddUserForm Id={Id} UserData={UserData}/>}
          {activeSection === "order-tracking" && <OrdersTracking />}
          {activeSection === "all-products" && <AllProducts setActiveSection={setActiveSection} setId={setId} setproductData={setproductData}/>}
          {activeSection === "all-users" && <AllUsers setActiveSection={setActiveSection} setId={setId} setuserData={setuserData}/>}
        </main>
      </div>
    </div>)
  );
}

