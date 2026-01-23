"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { 
  Search, 
  Trash2, 
  ShoppingBag, 
  Calendar, 
  User, 
  Mail, 
  DollarSign, 
  CheckCircle2, 
  Clock,
  Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // ADATOK LEKÉRÉSE
  const fetchOrders = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false }); // Legújabb elöl

    if (!error) setOrders(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // RENDELÉS TÖRLÉSE
  const handleDelete = async (id: string) => {
    if (!window.confirm("Biztosan törlöd ezt a foglalást?")) return;
    
    const { error } = await supabase.from('bookings').delete().eq('id', id);
    if (!error) {
      setOrders(orders.filter(o => o.id !== id));
    } else {
      alert("Hiba: " + error.message);
    }
  };

  // SZŰRÉS (Kereső)
  const filteredOrders = orders.filter(o => 
    o.customer_name?.toLowerCase().includes(search.toLowerCase()) || 
    o.customer_email?.toLowerCase().includes(search.toLowerCase()) ||
    o.product_title?.toLowerCase().includes(search.toLowerCase())
  );

  // STATISZTIKA SZÁMOLÁS
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total_price || 0), 0);
  const totalGuests = orders.reduce((sum, o) => sum + (o.guests || 0), 0);

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* HEADER & STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
             <h1 className="text-3xl font-black text-slate-900 mb-2">Orders & Bookings</h1>
             <p className="text-slate-500">Manage incoming reservations and track revenue.</p>
          </div>
          
          {/* BEVÉTEL KÁRTYA */}
          <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl flex items-center justify-between">
              <div>
                  <p className="text-slate-400 text-xs font-bold uppercase mb-1">Total Revenue</p>
                  <p className="text-3xl font-black">€{totalRevenue.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-white"/>
              </div>
          </div>
      </div>

      {/* SEARCH BAR */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex gap-4">
         <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input 
                placeholder="Search by name, email or product..." 
                className="pl-10 h-11 bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
         </div>
         <Button variant="outline" className="h-11 px-6 border-slate-200 text-slate-600 hover:bg-slate-50">
            <Filter className="w-4 h-4 mr-2"/> Filters
         </Button>
      </div>

      {/* ORDERS TABLE */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
         <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse">
                 <thead className="bg-slate-50 border-b border-slate-200">
                     <tr>
                         <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500 tracking-wider">Customer</th>
                         <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500 tracking-wider">Product Info</th>
                         <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500 tracking-wider">Date & Time</th>
                         <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500 tracking-wider">Status</th>
                         <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500 tracking-wider text-right">Amount</th>
                         <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500 tracking-wider text-right">Action</th>
                     </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                     {loading ? (
                         <tr><td colSpan={6} className="p-10 text-center text-slate-400">Loading orders...</td></tr>
                     ) : filteredOrders.length === 0 ? (
                         <tr><td colSpan={6} className="p-10 text-center text-slate-500">No orders found.</td></tr>
                     ) : (
                         filteredOrders.map((order) => (
                             <tr key={order.id} className="hover:bg-slate-50 transition-colors group">
                                 
                                 {/* CUSTOMER */}
                                 <td className="px-6 py-4">
                                     <div className="flex items-center gap-3">
                                         <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
                                             {order.customer_name?.charAt(0).toUpperCase()}
                                         </div>
                                         <div>
                                             <p className="font-bold text-slate-900 text-sm">{order.customer_name}</p>
                                             <div className="flex items-center gap-1 text-xs text-slate-500">
                                                 <Mail className="w-3 h-3"/> {order.customer_email}
                                             </div>
                                         </div>
                                     </div>
                                 </td>
                                 
                                 {/* PRODUCT */}
                                 <td className="px-6 py-4">
                                     <p className="font-bold text-slate-900 text-sm truncate max-w-[200px]">{order.product_title}</p>
                                     <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                                        <ShoppingBag className="w-3 h-3"/> {order.guests} Guests
                                     </p>
                                 </td>

                                 {/* DATE */}
                                 <td className="px-6 py-4">
                                     <div className="flex flex-col">
                                        <span className="text-sm font-medium text-slate-900 flex items-center gap-2">
                                            <Calendar className="w-3.5 h-3.5 text-slate-400"/> 
                                            {new Date(order.booking_date).toLocaleDateString()}
                                        </span>
                                        <span className="text-xs text-slate-500 flex items-center gap-2 mt-1">
                                            <Clock className="w-3.5 h-3.5 text-slate-400"/> 
                                            {/* Ha mentenél időpontot is, ide írnád ki. Most csak a nap van. */}
                                            All day
                                        </span>
                                     </div>
                                 </td>

                                 {/* STATUS */}
                                 <td className="px-6 py-4">
                                     {order.status === 'paid' ? (
                                         <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200">
                                             <CheckCircle2 className="w-3.5 h-3.5"/> Paid
                                         </span>
                                     ) : (
                                         <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 border border-amber-200">
                                             <Clock className="w-3.5 h-3.5"/> Pending
                                         </span>
                                     )}
                                 </td>

                                 {/* PRICE */}
                                 <td className="px-6 py-4 text-right">
                                     <span className="font-black text-slate-900">€{order.total_price}</span>
                                 </td>

                                 {/* ACTIONS */}
                                 <td className="px-6 py-4 text-right">
                                     <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        onClick={() => handleDelete(order.id)}
                                        className="text-slate-400 hover:text-red-600 hover:bg-red-50"
                                     >
                                         <Trash2 className="w-4 h-4"/>
                                     </Button>
                                 </td>
                             </tr>
                         ))
                     )}
                 </tbody>
             </table>
         </div>
      </div>
    </div>
  );
}