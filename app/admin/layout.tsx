"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { LayoutDashboard, ShoppingBag, List, Settings, LogOut, Menu, X, User, ChevronRight } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState<any>(null);

  // AUTH CHECK
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
      } else {
        setUser(session.user);
      }
    };
    checkUser();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, href: "/admin" },
    { name: "Products", icon: List, href: "/admin/products" },
    { name: "Orders", icon: ShoppingBag, href: "/admin/orders" },
    { name: "Settings", icon: Settings, href: "/admin/settings" },
  ];

  // Ha még tölt az user, egy üres fehér képernyőt mutatunk, hogy ne villogjon
  if (!user) return <div className="min-h-screen bg-white"></div>;

  return (
    <div className="flex h-screen bg-[#f8f9fa] overflow-hidden font-sans">
      
      {/* SIDEBAR (Fix szélesség) */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-[#1e293b] text-white transition-transform duration-300 shadow-2xl
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
        lg:relative lg:translate-x-0 flex flex-col
      `}>
        
        {/* LOGO */}
        <div className="h-16 flex items-center px-6 border-b border-white/10 bg-[#0f172a]">
          <h1 className="text-xl font-bold tracking-tight text-white">ENTRIGO<span className="text-blue-500">.</span></h1>
          <button className="lg:hidden ml-auto p-1" onClick={() => setSidebarOpen(false)}><X className="w-5 h-5"/></button>
        </div>

        {/* USER INFO */}
        <div className="p-4 border-b border-white/5">
            <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
                <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-xs font-bold text-white shadow-lg shadow-blue-900/50">
                    AD
                </div>
                <div className="overflow-hidden">
                    <p className="text-xs font-bold text-slate-100">Administrator</p>
                    <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                </div>
            </div>
        </div>

        {/* MENÜ */}
        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} className={`
                flex items-center justify-between px-3 py-2.5 rounded-lg transition-all text-sm font-medium group
                ${isActive ? "bg-blue-600 text-white shadow-md shadow-blue-900/20" : "text-slate-400 hover:bg-white/5 hover:text-white"}
              `}>
                <div className="flex items-center gap-3">
                    <item.icon className={`w-4 h-4 transition-colors ${isActive ? "text-white" : "text-slate-500 group-hover:text-slate-300"}`} />
                    {item.name}
                </div>
                {isActive && <ChevronRight className="w-3 h-3 opacity-50"/>}
              </Link>
            );
          })}
        </nav>

        {/* LOGOUT */}
        <div className="p-4 border-t border-white/10 bg-[#0f172a]">
           <button onClick={handleLogout} className="flex items-center justify-center gap-2 w-full px-3 py-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors text-xs font-bold uppercase tracking-wider">
              <LogOut className="w-4 h-4" /> Sign Out
           </button>
        </div>
      </aside>

      {/* TARTALOM (Jobb oldal) */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* MOBIL HEADER */}
        <header className="bg-white border-b border-slate-200 h-16 flex items-center px-4 lg:hidden shrink-0">
            <button onClick={() => setSidebarOpen(true)} className="p-2 -ml-2 text-slate-600"><Menu className="w-6 h-6"/></button>
            <span className="ml-4 font-bold text-slate-900">Admin Panel</span>
        </header>

        {/* SCROLL TERÜLET */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 scroll-smooth">
           <div className="max-w-6xl mx-auto">
              {children}
           </div>
        </main>
      </div>
    </div>
  );
}