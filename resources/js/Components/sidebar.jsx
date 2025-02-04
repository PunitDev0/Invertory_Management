"use client";
import { Inertia } from "@inertiajs/inertia-react";


import {
  BarChart3,
  CircleDollarSign,
  LogOut,
  MessageCircle,
  Package,
  PieChart,
  Settings,
  Users,
  PlusCircle,
  User,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export function Sidebar({
  className,
  setActiveSection
}) {
  return (
    (<div
      className={cn("flex h-full w-full flex-col bg-[#2D2D2D] text-white", className)}>
      <div className="flex h-16 items-center border-b border-white/10 px-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <span className="text-black font-bold">Z</span>
          </div>
          <span className="text-xl font-semibold">Zarss</span>
        </div>
      </div>
      <div className="flex flex-col items-center p-6">
        <div className="w-24 h-24 rounded-full overflow-hidden mb-4">
        
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-400">Welcome Back,</div>
          <div className="font-semibold">Mark Johnson</div>
        </div>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        <NavItem
          icon={<PieChart size={20} />}
          label="Dashboard"
          onClick={() => setActiveSection("dashboard")} />
        <NavItem icon={<BarChart3 size={20} />} label="Statistics" />
        <NavItem icon={<CircleDollarSign size={20} />} label="Payment" />
        <NavItem icon={<Package size={20} />} label="Transactions" />
        <NavItem
          icon={<PlusCircle size={20} />}
          label="Add Product"
          onClick={() => setActiveSection("add-product")} />
        <NavItem
          icon={<User size={20} />} 
          label="Add User"
          onClick={() => setActiveSection("add-user")} />
        <NavItem
          icon={<User size={20} />} 
          label="Orders&Tracking"
          onClick={() => setActiveSection("order-tracking")} />
        <NavItem icon={<Users size={20} />} label="Customer" />
        <NavItem icon={<MessageCircle size={20} />} label="Messages" badge="5" />
        <NavItem icon={<Settings size={20} />} label="Settings" />
      </nav>
      <div className="border-t border-white/10 p-4">
        <Button
          variant="ghost"
          className="w-full justify-start text-gray-400 hover:text-white hover:bg-white/5">
          <LogOut className="mr-2 h-5 w-5" />
          Log Out
        </Button>
      </div>
    </div>)
  );
}

function NavItem({
  icon,
  label,
  badge,
  active,
  onClick
}) {
  return (
    (<Button
      variant="ghost"
      className={cn(
        "w-full justify-start",
        active ? "bg-white/10 text-white" : "text-gray-400 hover:text-white hover:bg-white/5"
      )}
      onClick={onClick}>
      {icon}
      <span className="ml-3">{label}</span>
      {badge && <span
        className="ml-auto bg-[#8B8BFF] text-white text-xs px-2 py-1 rounded-full">{badge}</span>}
    </Button>)
  );
}

