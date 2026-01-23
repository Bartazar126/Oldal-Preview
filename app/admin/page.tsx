"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { 
  ShoppingBag, 
  DollarSign, 
  Package, 
  Users, 
  ArrowUpRight, 
  ArrowDownRight, 
  Calendar,
  CreditCard,
  TrendingUp
} from "lucide-react";
import Link from "next/link";

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
      // Termékek száma
      const { count: productsCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });

      // Foglalások lekérése (max 5 legutóbbi a listához)
      const { data: bookings, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (!error && bookings) {
        const totalRevenue = bookings.reduce((sum, item) => sum + (Number(item.total_price) || 0), 0);
        // Egyedi vásárlók (email alapján)
        const uniqueCustomers = new Set(bookings.map(b => b.customer_email)).size;

        setStats({ 
          products: productsCount || 0, 
          orders: bookings.length, 
          revenue: totalRevenue,
          customers: uniqueCustomers
        });
        
        setRecentBookings(bookings.slice(0, 5));
      }
      setLoading(false);
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
       
       {/* HEADER */}
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-slate-500 text-sm mt-1">Welcome back! Here's what's happening today.</p>
          </div>
          <div className="flex items-center gap-3 bg-white p-1.5 rounded-lg border border-slate-200 shadow-sm">
             <div className="bg-slate-100 px-3 py-1.5 rounded text-xs font-bold text-slate-600">Today</div>
             <div className="px-3 py-1.5 rounded text-xs font-medium text-slate-400 hover:text-slate-600 cursor-pointer transition">Last 7 Days</div>
             <div className="px-3 py-1.5 rounded text-xs font-medium text-slate-400 hover:text-slate-600 cursor-pointer transition">Month</div>
          </div>
       </div>

       {/* STATS CARDS */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* REVENUE */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
             <div className="flex justify-between items-start mb-4">
                <div className="bg-green-50 p-2 rounded-lg text-green-600"><DollarSign className="w-5 h-5"/></div>
                <span className="flex items-center text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                   +12.5% <ArrowUpRight className="w-3 h-3 ml-1"/>
                </span>
             </div>
             <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Total Revenue</p>
             <h3 className="text-2xl font-black text-slate-900 mt-1">€{stats.revenue.toLocaleString()}</h3>
          </div>

          {/* ORDERS */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
             <div className="flex justify-between items-start mb-4">
                <div className="bg-blue-50 p-2 rounded-lg text-blue-600"><ShoppingBag className="w-5 h-5"/></div>
                <span className="flex items-center text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                   +4 <ArrowUpRight className="w-3 h-3 ml-1"/>
                </span>
             </div>
             <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Bookings</p>
             <h3 className="text-2xl font-black text-slate-900 mt-1">{stats.orders}</h3>
          </div>

          {/* CUSTOMERS */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
             <div className="flex justify-between items-start mb-4">
                <div className="bg-purple-50 p-2 rounded-lg text-purple-600"><Users className="w-5 h-5"/></div>
             </div>
             <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Customers</p>
             <h3 className="text-2xl font-black text-slate-900 mt-1">{stats.customers}</h3>
          </div>

          {/* PRODUCTS */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
             <div className="flex justify-between items-start mb-4">
                <div className="bg-orange-50 p-2 rounded-lg text-orange-600"><Package className="w-5 h-5"/></div>
                <Link href="/admin/products/new" className="text-[10px] font-bold text-blue-600 hover:underline">
                   + Add New
                </Link>
             </div>
             <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Active Products</p>
             <h3 className="text-2xl font-black text-slate-900 mt-1">{stats.products}</h3>
          </div>
       </div>

       {/* MAIN CONTENT SPLIT */}
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           
           {/* LEFT: REVENUE CHART (Fake Visual) */}
           <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-8">
                  <h3 className="font-bold text-slate-900 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-slate-400"/> Revenue Overview</h3>
                  <button className="text-xs font-bold text-slate-400 hover:text-slate-900 border border-slate-200 px-3 py-1 rounded-md">Download Report</button>
              </div>
              
              {/* CSS BAR CHART VISUALIZATION */}
              <div className="h-64 flex items-end justify-between gap-2 md:gap-4 px-2">
                  {[45, 60, 35, 70, 55, 80, 65, 90, 75, 50, 60, 85].map((h, i) => (
                      <div key={i} className="w-full bg-slate-50 rounded-t-lg relative group h-full flex items-end">
                          <div 
                            style={{ height: `${h}%` }} 
                            className="w-full bg-blue-600 rounded-t-sm opacity-80 group-hover:opacity-100 transition-all relative"
                          >
                             <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                €{h * 10}
                             </div>
                          </div>
                      </div>
                  ))}
              </div>
              <div className="flex justify-between mt-4 text-xs font-bold text-slate-400 uppercase tracking-wider px-2">
                  <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
                  <span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
              </div>
           </div>

           {/* RIGHT: RECENT SALES */}
           <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-slate-400"/> Recent Bookings
              </h3>
              
              <div className="space-y-6">
                  {loading ? (
                      <p className="text-sm text-slate-400">Loading...</p>
                  ) : recentBookings.length === 0 ? (
                      <div className="text-center py-8">
                          <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                              <ShoppingBag className="w-5 h-5 text-slate-300"/>
                          </div>
                          <p className="text-sm text-slate-500">No bookings yet.</p>
                      </div>
                  ) : (
                      recentBookings.map((booking) => (
                          <div key={booking.id} className="flex items-center justify-between border-b border-slate-50 pb-4 last:border-0 last:pb-0">
                              <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-500">
                                      {booking.customer_name?.charAt(0) || "G"}
                                  </div>
                                  <div>
                                      <p className="text-sm font-bold text-slate-900">{booking.customer_name || "Guest"}</p>
                                      <p className="text-xs text-slate-400 truncate max-w-[120px]">{booking.product_title}</p>
                                  </div>
                              </div>
                              <div className="text-right">
                                  <p className="text-sm font-bold text-slate-900">+€{booking.total_price}</p>
                                  <p className="text-[10px] text-green-600 font-bold uppercase bg-green-50 px-1.5 py-0.5 rounded inline-block">Paid</p>
                              </div>
                          </div>
                      ))
                  )}
              </div>
              
              {recentBookings.length > 0 && (
                  <Link href="/admin/orders">
                    <button className="w-full mt-6 text-sm font-bold text-slate-500 hover:text-blue-600 flex items-center justify-center gap-1 transition-colors">
                        View All Transactions <ArrowUpRight className="w-3 h-3"/>
                    </button>
                  </Link>
              )}
           </div>

       </div>
    </div>
  );
}