"use client"

import { useEffect, useState } from "react"
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
  

  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("/logged-in-user");
        setUser(response.data.user);
        console.log(response);
        
      } catch (err) {
        setError("Failed to fetch user data.");
        // Redirect to login page if not logged in
      }
    };

    fetchUserData();
  }, []);

  return (
    (<div className="flex min-h-screen flex-col bg-[#F8F8F8]">
      <div className="flex-1 flex">
        <aside className="fixed hidden h-full w-64 lg:block">
          <Sidebar setActiveSection={setActiveSection} user={user} />
        </aside>
        <main className="flex-1 lg:pl-64">
           <Navbar className="lg:pl-64" setActiveSection={setActiveSection} />
          {activeSection === "dashboard" && <DashboardContent UserData={UserData} productData={productData} />}
          {activeSection === "add-product" && <MainFrom Id={Id} productData={productData} />}
          {activeSection === "add-user" && <AddUserForm Id={Id} UserData={UserData}/>}
          {activeSection === "order-tracking" && <OrdersTracking />}
          {activeSection === "all-products" && <AllProducts setActiveSection={setActiveSection} setId={setId} setproductData={setproductData}/>}
          {activeSection === "all-users" && <AllUsers setActiveSection={setActiveSection} setId={setId} setuserData={setuserData}/>}
        </main>
      </div>
    </div>)
  );
}

