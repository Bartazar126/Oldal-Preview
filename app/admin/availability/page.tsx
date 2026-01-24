"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Clock, Calendar as CalendarIcon, Save, AlertCircle, CheckCircle2, X, Loader2, CheckSquare, Square, RefreshCcw, Layers } from "lucide-react";

interface ProductSchedule {
  id: string;
  title: string;
  time_slots: string[]; 
  date_overrides: Record<string, string[]>; 
}

export default function AvailabilityPage() {
  const [products, setProducts] = useState<ProductSchedule[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<ProductSchedule | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [bulkUpdating, setBulkUpdating] = useState(false);

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [newTime, setNewTime] = useState("");

  // Betöltés
  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await supabase.from('products').select('id, title, time_slots, date_overrides');
      if (data) {
        setProducts(data);
        if (data.length > 0) {
          setSelectedProductId(data[0].id);
          setSelectedProduct(data[0]);
        }
      }
      setLoading(false);
    };
    fetchProducts();
  }, []);

  // Váltás
  useEffect(() => {
    if (selectedProductId) {
      const found = products.find(p => p.id === selectedProductId);
      if (found) setSelectedProduct({ ...found });
    }
  }, [selectedProductId]);

  // --- ATOMRAKÉTA: MINDEN TERMÉK FRISSÍTÉSE (FÉLÓRÁS) ---
  const applyStandardToALL = async () => {
      if (!confirm("Biztos vagy benne? Ez minden terméknél beállítja a 09:00-17:00 (félórás) sémát!")) return;
      
      setBulkUpdating(true);
      // FÉLÓRÁS IDŐPONTOK
      const standard = [
          "09:00", "09:30", 
          "10:00", "10:30", 
          "11:00", "11:30", 
          "12:00", "12:30", 
          "13:00", "13:30", 
          "14:00", "14:30", 
          "15:00", "15:30", 
          "16:00", "16:30", 
          "17:00"
      ];
      
      const { error } = await supabase
          .from('products')
          .update({ time_slots: standard })
          .neq('id', '00000000-0000-0000-0000-000000000000'); 

      if (!error) {
          const updatedProducts = products.map(p => ({ ...p, time_slots: standard }));
          setProducts(updatedProducts);
          if (selectedProduct) setSelectedProduct({ ...selectedProduct, time_slots: standard });
          alert("Kész! Minden termék frissítve félórás beosztásra.");
      } else {
          alert("Hiba történt.");
          console.error(error);
      }
      setBulkUpdating(false);
  };

  // --- DEFAULT SCHEDULE (EGY TERMÉKRE) ---
  const setStandardHours = () => {
      if (!selectedProduct) return;
      // FÉLÓRÁS IDŐPONTOK ITT IS
      const standard = [
          "09:00", "09:30", 
          "10:00", "10:30", 
          "11:00", "11:30", 
          "12:00", "12:30", 
          "13:00", "13:30", 
          "14:00", "14:30", 
          "15:00", "15:30", 
          "16:00", "16:30", 
          "17:00"
      ];
      setSelectedProduct({ ...selectedProduct, time_slots: standard });
  };

  const addDefaultTime = () => {
    if (newTime && selectedProduct && !selectedProduct.time_slots?.includes(newTime)) {
      const updatedSlots = [...(selectedProduct.time_slots || []), newTime].sort();
      setSelectedProduct({ ...selectedProduct, time_slots: updatedSlots });
      setNewTime("");
    }
  };

  const removeDefaultTime = (time: string) => {
    if (selectedProduct) {
      const updatedSlots = selectedProduct.time_slots.filter(t => t !== time);
      setSelectedProduct({ ...selectedProduct, time_slots: updatedSlots });
    }
  };

  // --- NAPI LOGIKA ---
  const dateKey = selectedDate ? format(selectedDate, "yyyy-MM-dd") : "";
  
  const getCurrentSlotsForDate = () => {
      if (!selectedProduct || !dateKey) return [];
      if (selectedProduct.date_overrides?.[dateKey] !== undefined) {
          return selectedProduct.date_overrides[dateKey];
      }
      return selectedProduct.time_slots || [];
  };

  const currentDaySlots = getCurrentSlotsForDate();
  const isDateBlocked = selectedProduct?.date_overrides?.[dateKey] !== undefined && selectedProduct.date_overrides[dateKey].length === 0;

  const toggleTimeForDate = (time: string) => {
      if (!selectedProduct || !dateKey) return;
      let newSlots = [...currentDaySlots];
      if (newSlots.includes(time)) {
          newSlots = newSlots.filter(t => t !== time);
      } else {
          newSlots = [...newSlots, time].sort();
      }
      const newOverrides = { ...selectedProduct.date_overrides, [dateKey]: newSlots };
      setSelectedProduct({ ...selectedProduct, date_overrides: newOverrides });
  };

  const toggleBlockDate = () => {
    if (!selectedProduct || !dateKey) return;
    const newOverrides = { ...selectedProduct.date_overrides };
    if (isDateBlocked) {
      delete newOverrides[dateKey]; 
    } else {
      newOverrides[dateKey] = []; 
    }
    setSelectedProduct({ ...selectedProduct, date_overrides: newOverrides });
  };

  // Mentés
  const saveChanges = async () => {
    if (!selectedProduct) return;
    setSaving(true);
    const { error } = await supabase
      .from('products')
      .update({ time_slots: selectedProduct.time_slots, date_overrides: selectedProduct.date_overrides })
      .eq('id', selectedProduct.id);

    if (!error) {
      setProducts(prev => prev.map(p => p.id === selectedProduct.id ? selectedProduct : p));
      alert("Mentve!");
    } else {
      alert("Hiba mentéskor.");
    }
    setSaving(false);
  };

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin w-8 h-8 text-slate-400"/></div>;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col h-screen overflow-hidden">
      
      {/* HEADER */}
      <div className="bg-white border-b border-slate-200 px-8 py-5 flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Booking Management</h1>
          <p className="text-sm text-slate-500">Set standard hours and manage daily exceptions.</p>
        </div>
        
        <div className="flex items-center gap-4">
           {/* ATOMRAKÉTA GOMB */}
           <button 
             onClick={applyStandardToALL} 
             disabled={bulkUpdating}
             className="mr-4 bg-slate-100 hover:bg-slate-200 text-slate-600 px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 border border-slate-300"
             title="Set standard 30min slots for EVERY product"
           >
             {bulkUpdating ? <Loader2 className="w-3 h-3 animate-spin"/> : <Layers className="w-3 h-3"/>} 
             Set Standard (All Products)
           </button>

           <select 
             className="bg-slate-100 border border-slate-200 rounded-lg px-4 py-2 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
             value={selectedProductId || ""}
             onChange={(e) => setSelectedProductId(e.target.value)}
           >
             {products.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
           </select>

           <button onClick={saveChanges} disabled={saving} className="bg-green-600 text-white px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50">
             {saving ? <Loader2 className="w-4 h-4 animate-spin"/> : <Save className="w-4 h-4" />} Save Changes
           </button>
        </div>
      </div>

      {/* CONTENT */}
      {selectedProduct && (
        <div className="flex-1 overflow-y-auto p-8">
           <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* 1. DEFAULT SCHEDULE */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                 <div className="flex items-center justify-between border-b pb-4 mb-6">
                     <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2"><Clock className="w-5 h-5 text-blue-600"/> Default Hours</h3>
                     <button onClick={setStandardHours} className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-600 px-2 py-1 rounded font-bold flex items-center gap-1">
                         <RefreshCcw className="w-3 h-3"/> Atomrakéta
                     </button>
                 </div>
                 
                 <p className="text-xs text-slate-500 mb-4">Master hours applied to all future dates.</p>
                 <div className="flex gap-2 mb-4">
                    <input type="time" value={newTime} onChange={(e) => setNewTime(e.target.value)} className="border rounded-lg p-2 text-sm flex-1 font-mono" />
                    <button onClick={addDefaultTime} className="bg-slate-900 text-white px-4 rounded-lg font-bold text-sm">Add</button>
                 </div>
                 <div className="flex flex-wrap gap-2">
                    {selectedProduct.time_slots?.map(time => (
                       <span key={time} className="bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-2">
                          {time} <button onClick={() => removeDefaultTime(time)} className="hover:text-red-500"><X className="w-3 h-3"/></button>
                       </span>
                    ))}
                 </div>
              </div>

              {/* 2. CALENDAR */}
              <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row gap-8">
                 
                 {/* NAPTÁR */}
                 <div className="shrink-0">
                    <h3 className="text-lg font-bold text-slate-900 border-b pb-4 mb-6 flex items-center gap-2"><CalendarIcon className="w-5 h-5 text-purple-600"/> Calendar</h3>
                    <div className="border rounded-xl p-4 inline-block">
                       <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={setSelectedDate}
                          className="rounded-md"
                          modifiers={{
                             blocked: (date) => selectedProduct.date_overrides?.[format(date, "yyyy-MM-dd")]?.length === 0,
                             low: (date) => {
                                 const k = format(date, "yyyy-MM-dd");
                                 const slots = selectedProduct.date_overrides?.[k];
                                 // Sárga csak akkor, ha van override ÉS kevesebb mint 3 slot
                                 return slots !== undefined && slots.length > 0 && slots.length < 3;
                             }
                          }}
                          modifiersStyles={{
                             blocked: { textDecoration: "line-through", color: "red", backgroundColor: "#fef2f2" },
                             low: { border: "2px solid #fcd34d", borderRadius: "100%" }
                          }}
                       />
                    </div>
                 </div>

                 {/* NAPI SZERKESZTŐ */}
                 <div className="flex-1">
                    <div className="bg-slate-50 rounded-xl p-6 h-full border border-slate-100">
                        <h4 className="text-md font-bold text-slate-900 mb-1">{selectedDate ? format(selectedDate, "MMMM d, yyyy") : "Selected Date"}</h4>
                        <p className="text-xs text-slate-500 mb-6">Modify default hours for this specific date.</p>

                        {selectedDate ? (
                           <div className="space-y-6">
                              {/* FŐKAPCSOLÓ */}
                              <div className={`p-4 rounded-xl border flex items-center gap-4 ${isDateBlocked ? 'bg-red-50 border-red-200' : 'bg-white border-slate-200'}`}>
                                  {isDateBlocked ? <AlertCircle className="w-8 h-8 text-red-500"/> : <CheckCircle2 className="w-8 h-8 text-green-600"/>}
                                  <div>
                                     <p className={`font-bold ${isDateBlocked ? 'text-red-700' : 'text-slate-900'}`}>{isDateBlocked ? "Day Closed" : "Day Open"}</p>
                                     <p className="text-xs opacity-70">{isDateBlocked ? "No bookings allowed." : `${currentDaySlots.length} slots active.`}</p>
                                  </div>
                                  <button onClick={toggleBlockDate} className="ml-auto px-3 py-1.5 rounded-lg text-xs font-bold border bg-white hover:bg-slate-50">{isDateBlocked ? "Re-open Day" : "Close Day"}</button>
                              </div>

                              {/* SLOT LISTA */}
                              {!isDateBlocked && (
                                  <div>
                                      <h5 className="text-xs font-bold uppercase text-slate-400 mb-3">Active Slots</h5>
                                      <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto">
                                          {Array.from(new Set([...(selectedProduct.time_slots || []), ...currentDaySlots])).sort().map(time => {
                                              const isActive = currentDaySlots.includes(time);
                                              return (
                                                  <button 
                                                    key={time}
                                                    onClick={() => toggleTimeForDate(time)}
                                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border text-sm font-bold transition-all text-left ${isActive ? 'bg-white border-green-200 text-slate-900 shadow-sm' : 'bg-slate-100/50 border-transparent text-slate-400'}`}
                                                  >
                                                      {isActive ? <CheckSquare className="w-4 h-4 text-green-600 shrink-0"/> : <Square className="w-4 h-4 shrink-0"/>}
                                                      {time}
                                                  </button>
                                              )
                                          })}
                                      </div>
                                  </div>
                              )}
                           </div>
                        ) : <div className="text-slate-400 text-sm flex items-center justify-center h-40">Select a date to edit.</div>}
                    </div>
                 </div>

              </div>
           </div>
        </div>
      )}
    </div>
  );
}