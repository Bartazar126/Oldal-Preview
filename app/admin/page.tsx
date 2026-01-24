"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { 
  ShoppingBag, 
  DollarSign, 
  Package, 
  Users, 
  ArrowUpRight, 
  TrendingUp,
  CreditCard,
  Loader2,
  Calendar as CalendarIcon // ÚJ IKON
} from "lucide-react";
import Link from "next/link";

// --- SKELETON LOADER KOMPONENS ---
const DashboardSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    <div className="h-20 bg-slate-200 rounded-xl w-full md:w-1/3"></div>
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
       {[1,2,3,4].map(i => <div key={i} className="h-32 bg-slate-200 rounded-xl"></div>)}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
       <div className="lg:col-span-2 h-64 bg-slate-200 rounded-xl"></div>
       <div className="h-64 bg-slate-200 rounded-xl"></div>
    </div>
  </div>
);

export default function Dashboard() {
  const [stats, setStats] = useState({ 
    products: 0, 
    orders: 0, 
    revenue: 0,
    customers: 0
  });
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      // 1. Termékek száma
      const { count: productsCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });

      // 2. Legutóbbi 5 foglalás
      const { data: recent } = await supabase
        .from('bookings')
        .select('id, customer_name, product_title, total_price, status')
        .order('created_at', { ascending: false })
        .limit(5);

      // 3. Összesítő statisztikák
      const { data: allBookings } = await supabase
        .from('bookings')
        .select('total_price, customer_email');
      
      let totalRevenue = 0;
      let uniqueCustomers = 0;
      let totalOrders = 0;

      if (allBookings) {
        totalOrders = allBookings.length;
        totalRevenue = allBookings.reduce((sum, item) => sum + (Number(item.total_price) || 0), 0);
        uniqueCustomers = new Set(allBookings.map(b => b.customer_email)).size;
      }

      setStats({ 
        products: productsCount || 0, 
        orders: totalOrders, 
        revenue: totalRevenue,
        customers: uniqueCustomers
      });
        
      if (recent) setRecentBookings(recent);
      
      setLoading(false);
    };

    fetchStats();
  }, []);

  if (loading) return <div className="p-4"><DashboardSkeleton /></div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
       
       {/* HEADER */}
       <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-black text-slate-900">Dashboard</h1>
            <p className="text-slate-500 text-xs md:text-sm">Overview of your business performance.</p>
          </div>
          
          <div className="flex items-center gap-3">
             {/* --- ÚJ GOMB AZ AVAILABILITY OLDALHOZ --- */}
             <Link href="/admin/availability">
                <button className="flex items-center gap-2 bg-white text-slate-700 border border-slate-200 px-4 py-2 rounded-full text-xs font-bold shadow-sm hover:bg-slate-50 transition-colors">
                    <CalendarIcon className="w-4 h-4 text-blue-600"/> Manage Availability
                </button>
             </Link>

             {/* Időszak választó */}
             <div className="hidden md:flex items-center gap-2 bg-slate-100 p-1 rounded-full border border-slate-200">
                 <button className="bg-white text-slate-900 px-3 py-1.5 rounded-full text-xs font-bold shadow-sm">Today</button>
                 <button className="text-slate-500 px-3 py-1.5 text-xs font-bold hover:text-slate-700">7 Days</button>
                 <button className="text-slate-500 px-3 py-1.5 text-xs font-bold hover:text-slate-700">Month</button>
             </div>
          </div>
       </div>

       {/* STATS CARDS */}
       <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          
          {/* REVENUE */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm col-span-2 md:col-span-1">
             <div className="flex justify-between items-start mb-2">
                <div className="bg-green-100 p-2 rounded-lg text-green-700"><DollarSign className="w-4 h-4"/></div>
                <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full flex items-center gap-1">+12% <ArrowUpRight className="w-3 h-3"/></span>
             </div>
             <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Revenue</p>
             <h3 className="text-2xl font-black text-slate-900">€{stats.revenue.toLocaleString()}</h3>
          </div>

          {/* ORDERS */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
             <div className="bg-blue-100 p-2 rounded-lg text-blue-700 w-fit mb-2"><ShoppingBag className="w-4 h-4"/></div>
             <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Bookings</p>
             <h3 className="text-xl font-black text-slate-900">{stats.orders}</h3>
          </div>

          {/* CUSTOMERS */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
             <div className="bg-purple-100 p-2 rounded-lg text-purple-700 w-fit mb-2"><Users className="w-4 h-4"/></div>
             <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Clients</p>
             <h3 className="text-xl font-black text-slate-900">{stats.customers}</h3>
          </div>

          {/* PRODUCTS */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm col-span-2 md:col-span-1 flex items-center justify-between">
             <div>
                 <div className="bg-orange-100 p-2 rounded-lg text-orange-700 w-fit mb-2"><Package className="w-4 h-4"/></div>
                 <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Active Products</p>
                 <h3 className="text-xl font-black text-slate-900">{stats.products}</h3>
             </div>
             <Link href="/admin/products/new">
                <button className="bg-slate-900 text-white p-3 rounded-full hover:scale-105 transition-transform shadow-lg">
                    <ArrowUpRight className="w-5 h-5" />
                </button>
             </Link>
          </div>
       </div>

       {/* MAIN CONTENT SPLIT */}
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           
           {/* CHART */}
           <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-slate-900 flex items-center gap-2 text-sm"><TrendingUp className="w-4 h-4 text-slate-400"/> Revenue Trend</h3>
              </div>
              
              <div className="h-48 flex items-end justify-between gap-1 sm:gap-3">
                  {[40, 65, 30, 80, 55, 90, 70, 45, 60, 75, 50, 85].map((h, i) => (
                      <div key={i} className="w-full bg-slate-50 rounded-t-md relative group h-full flex items-end">
                          <div 
                            style={{ height: `${h}%` }} 
                            className="w-full bg-blue-600 rounded-t-sm hover:bg-blue-500 transition-all relative"
                          >
                          </div>
                      </div>
                  ))}
              </div>
              <div className="flex justify-between mt-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <span>Jan</span><span>Dec</span>
              </div>
           </div>

           {/* RECENT SALES */}
           <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2 text-sm">
                  <CreditCard className="w-4 h-4 text-slate-400"/> Recent Bookings
              </h3>
              
              <div className="space-y-4">
                  {recentBookings.length === 0 ? (
                      <div className="text-center py-6 text-slate-400 text-xs">No bookings yet.</div>
                  ) : (
                      recentBookings.map((booking) => (
                          <div key={booking.id} className="flex items-center justify-between border-b border-slate-50 pb-3 last:border-0 last:pb-0">
                              <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center font-bold text-[10px] text-slate-600 border border-white shadow-sm">
                                      {booking.customer_name?.charAt(0) || "G"}
                                  </div>
                                  <div className="flex flex-col">
                                      <p className="text-xs font-bold text-slate-900">{booking.customer_name || "Guest"}</p>
                                      <p className="text-[10px] text-slate-400 truncate max-w-[100px]">{booking.product_title}</p>
                                  </div>
                              </div>
                              <div className="text-right">
                                  <p className="text-xs font-bold text-slate-900">+€{booking.total_price}</p>
                                  <div className="flex items-center justify-end gap-1">
                                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                                      <span className="text-[9px] text-slate-400">Paid</span>
                                  </div>
                              </div>
                          </div>
                      ))
                  )}
              </div>
              
              <Link href="/admin/orders">
                 <button className="w-full mt-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 bg-slate-50 hover:bg-slate-100 transition-colors border border-slate-100">
                     View All
                 </button>
              </Link>
           </div>
       </div>
    </div>
  );
}