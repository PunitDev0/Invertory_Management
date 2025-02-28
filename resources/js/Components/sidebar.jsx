"use client";
import { Inertia } from "@inertiajs/inertia";
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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Link } from "@inertiajs/react";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/admin/productname", label: "Product Name", icon: PieChart },
  { href: "/admin/allproducts", label: "All Products", icon: CircleDollarSign },
  { href: "/admin/user", label: "Add Users", icon: User },
  { href: "/admin/allusers", label: "All Users", icon: Users },
  { href: "/admin/category", label: "Category", icon: Package },
  { href: "/admin/branches", label: "Branches", icon: Users },
  { href: "/admin/product", label: "Add Products", icon: PlusCircle },
  { href: "/admin/ordertracking", label: "Order Tracking", icon: MessageCircle },
];

export function Sidebar({ className, user }) {
  const handleLogout = () => {
    Inertia.get("/logout");
  };

  return (
    <div className={cn("flex h-full w-full flex-col bg-[#2D2D2D] text-white z-[1000]", className)}>
      <div className="flex h-16 items-center border-b border-white/10 px-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <span className="text-black font-bold">N</span>
          </div>
          <span className="text-xl font-semibold">Nikatby</span>
        </div>
      </div>
      <div className="flex flex-col items-center p-6">
        <div className="w-24 h-24 rounded-full overflow-hidden mb-4"></div>
        <div className="text-center">
          <div className="text-sm text-gray-400">Welcome Back,</div>
          <div className="font-semibold">{user?.name}</div>
        </div>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href}>
            <NavItem icon={<Icon size={20} />} label={label} />
          </Link>
        ))}
      </nav>
      <div className="border-t border-white/10 p-4">
        <Button
          variant="ghost"
          className="w-full justify-start text-gray-400 hover:text-white hover:bg-white/5"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-5 w-5" />
          Log Out
        </Button>
      </div>
    </div>
  );
}

function NavItem({ icon, label, badge, active, onClick }) {
  return (
    <Button
      variant="ghost"
      className={cn(
        "w-full justify-start",
        active ? "bg-white/10 text-white" : "text-gray-400 hover:text-white hover:bg-white/5"
      )}
      onClick={onClick}
    >
      {icon}
      <span className="ml-3">{label}</span>
      {badge && <span className="ml-auto bg-[#8B8BFF] text-white text-xs px-2 py-1 rounded-full">{badge}</span>}
    </Button>
  );
}