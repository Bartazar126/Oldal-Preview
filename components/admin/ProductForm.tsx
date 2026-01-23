"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Save, Plus, Trash2, Layout, List, Image as ImageIcon, Settings, HelpCircle, ArrowLeft, Ticket, X, Clock, Calendar as CalendarIcon, Loader2, RotateCcw, CheckCircle2, Ban } from "lucide-react";

// --- TÍPUSOK ---
interface FaqItem { q: string; a: string; }
interface TicketType { name: string; price: number | null; } 

interface ProductFormData {
  title: string; slug: string; location: string;
  price: number; original_price: number; duration: string;
  rating: number; reviews: number;
  short_desc: string; full_description: string;
  images: string[]; inclusions: string[]; exclusions: string[]; languages: string[];
  cancellation: string; confirmation: string; meeting_point: string; map_url: string;
  faq: FaqItem[];
  is_recommended: boolean; is_best_seller: boolean;
  ticket_types: TicketType[];
  req_all_travelers: boolean;
  time_slots: string[]; // ALAP (Default)
  date_overrides: Record<string, string[]>; // KIVÉTELEK
}

// --- SEGÉD KOMPONENS LISTÁKHOZ ---
const DynamicList = ({ items, onChange, placeholder }: any) => { 
  return (
    <div className="space-y-2">
      {items.map((item:any, index:any) => (
        <div key={index} className="flex gap-2">
          <Input value={item} onChange={(e) => { const n = [...items]; n[index] = e.target.value; onChange(n); }} placeholder={placeholder} />
          <Button variant="outline" size="icon" onClick={() => onChange(items.filter((_:any, i:any) => i !== index))} className="shrink-0 text-red-500 hover:bg-red-50"><Trash2 className="w-4 h-4" /></Button>
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={() => onChange([...items, ""])} className="text-blue-600 bg-blue-50 mt-2"><Plus className="w-3 h-3 mr-1" /> Add Item</Button>
    </div>
  );
};

export default function ProductForm({ initialData }: { initialData?: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("general");

  // Generator State
  const [genStart, setGenStart] = useState("09:00");
  const [genEnd, setGenEnd] = useState("17:00");
  const [genInterval, setGenInterval] = useState(30);

  // Date Override State
  const [selectedOverrideDate, setSelectedOverrideDate] = useState("");

  // --- STATE INICIALIZÁLÁS ---
  const [formData, setFormData] = useState<ProductFormData>({
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    location: initialData?.location || "",
    price: initialData?.price || 0,
    original_price: initialData?.original_price || 0,
    duration: initialData?.duration || "",
    rating: initialData?.rating || 5.0,
    reviews: initialData?.reviews || 0,
    short_desc: initialData?.short_desc || "",
    full_description: initialData?.full_description || "",
    images: initialData?.images && initialData.images.length > 0 ? initialData.images : [""],
    inclusions: initialData?.inclusions || [],
    exclusions: initialData?.exclusions || [],
    languages: initialData?.languages || ["English"],
    cancellation: initialData?.cancellation || "Free cancellation up to 24 hours in advance",
    confirmation: initialData?.confirmation || "Instant confirmation",
    meeting_point: initialData?.meeting_point || "",
    map_url: initialData?.map_url || "",
    faq: initialData?.faq || [],
    is_recommended: initialData?.is_recommended || false,
    is_best_seller: initialData?.is_best_seller || false,
    ticket_types: initialData?.ticket_types || [{ name: "Adult", price: initialData?.price || 0 }],
    req_all_travelers: initialData?.req_all_travelers || false,
    time_slots: initialData?.time_slots || [], 
    date_overrides: initialData?.date_overrides || {},
  });

  // --- SLOT GENERÁTOR (ALAP) ---
  const generateSlots = () => {
      const slots = [];
      let current = new Date(`2000-01-01T${genStart}`);
      const end = new Date(`2000-01-01T${genEnd}`);
      while (current <= end) {
          slots.push(current.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }));
          current.setMinutes(current.getMinutes() + Number(genInterval));
      }
      setFormData({...formData, time_slots: slots});
  };

  const toggleDefaultSlot = (slot: string) => {
      if (formData.time_slots.includes(slot)) {
          setFormData({...formData, time_slots: formData.time_slots.filter(s => s !== slot)});
      } else {
          const newSlots = [...formData.time_slots, slot].sort();
          setFormData({...formData, time_slots: newSlots});
      }
  };

  // --- DÁTUM SPECIFIKUS LOGIKA (PIROS/ZÖLD) ---
  
  // Megnézi, hogy egy adott napon mely slotok aktívak
  const getActiveSlotsForDate = (date: string) => {
      if (formData.date_overrides[date]) {
          return formData.date_overrides[date];
      }
      return formData.time_slots; // Ha nincs felülírva, akkor az alapértelmezett érvényes
  };

  // Van-e egyáltalán felülírás a napra?
  const isDateOverridden = (date: string) => {
      return Array.isArray(formData.date_overrides[date]);
  };

  // Slot ki-be kapcsolása (Override létrehozása)
  const toggleOverrideSlot = (date: string, slot: string) => {
      const currentActive = getActiveSlotsForDate(date);
      
      let newActive;
      if (currentActive.includes(slot)) {
          // Ha benne van, kivesszük (LEZÁRJUK -> PIROS LESZ)
          newActive = currentActive.filter(s => s !== slot);
      } else {
          // Ha nincs benne, visszarakjuk (KINYITJUK -> ZÖLD LESZ)
          newActive = [...currentActive, slot].sort();
      }

      setFormData({
          ...formData,
          date_overrides: {
              ...formData.date_overrides,
              [date]: newActive
          }
      });
  };

  const resetOverrideDate = (date: string) => {
      const newOverrides = { ...formData.date_overrides };
      delete newOverrides[date];
      setFormData({ ...formData, date_overrides: newOverrides });
  };

  // --- MENTÉS ---
  const handleSubmit = async () => {
    setLoading(true);
    const cleanData = {
      ...formData,
      images: formData.images.filter((img) => img.trim() !== ""),
      inclusions: formData.inclusions.filter((x) => x.trim() !== ""),
      exclusions: formData.exclusions.filter((x) => x.trim() !== ""),
      languages: formData.languages.filter((x) => x.trim() !== ""),
    };

    let error;
    if (initialData?.id) {
        const { error: err } = await supabase.from('products').update(cleanData).eq('id', initialData.id);
        error = err;
    } else {
        const { error: err } = await supabase.from('products').insert([cleanData]);
        error = err;
    }
    setLoading(false);
    if (error) alert("Error: " + error.message);
    else router.push("/admin/products");
  };

  const tabs = [
    { id: "general", label: "General", icon: Layout },
    { id: "schedule", label: "Schedule", icon: Clock },
    { id: "tickets", label: "Tickets", icon: Ticket },
    { id: "details", label: "Content", icon: List },
    { id: "media", label: "Images", icon: ImageIcon },
    { id: "inclusions", label: "Features", icon: Settings },
    { id: "faq", label: "FAQ", icon: HelpCircle },
  ];

  return (
    <div className="max-w-7xl mx-auto pb-20 font-sans">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6 sticky top-0 bg-[#f8f9fa] z-10 py-4 border-b border-slate-200">
        <div className="flex items-center gap-4">
           <Button variant="ghost" size="icon" onClick={() => router.back()}><ArrowLeft className="w-5 h-5"/></Button>
           <h1 className="text-2xl font-bold text-slate-900">{initialData ? "Edit Product" : "New Product"}</h1>
        </div>
        <Button onClick={handleSubmit} disabled={loading} className="bg-blue-600 hover:bg-blue-700 min-w-[120px]">
             {loading ? <Loader2 className="w-4 h-4 animate-spin"/> : <><Save className="w-4 h-4 mr-2"/> Save Product</>}
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* SIDEBAR TABS */}
        <div className="lg:w-64 flex flex-col gap-2 shrink-0">
           {tabs.map(tab => (
             <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id ? "bg-white shadow-sm text-blue-600 ring-1 ring-slate-200" : "text-slate-500 hover:bg-white"}`}>
               <tab.icon className="w-4 h-4" /> {tab.label}
             </button>
           ))}
        </div>

        {/* CONTENT AREA */}
        <div className="flex-1 space-y-6">
          
          {/* TAB: GENERAL */}
          {activeTab === "general" && (
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6 animate-in fade-in">
                <div className="grid grid-cols-2 gap-6">
                    <div className="col-span-2">
                        <label className="text-xs font-bold text-slate-500 uppercase mb-1">Title</label>
                        <Input value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="font-bold text-lg" />
                    </div>
                    <div><label className="text-xs font-bold text-slate-500 uppercase mb-1">Slug (ID)</label><Input value={formData.slug} onChange={(e) => setFormData({...formData, slug: e.target.value})} /></div>
                    <div><label className="text-xs font-bold text-slate-500 uppercase mb-1">Location</label><Input value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} /></div>
                    <div><label className="text-xs font-bold text-slate-500 uppercase mb-1">Base Price (€)</label><Input type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: Number(e.target.value)})} /></div>
                    <div><label className="text-xs font-bold text-slate-500 uppercase mb-1">Original Price</label><Input type="number" value={formData.original_price} onChange={(e) => setFormData({...formData, original_price: Number(e.target.value)})} /></div>
                    <div><label className="text-xs font-bold text-slate-500 uppercase mb-1">Duration</label><Input value={formData.duration} onChange={(e) => setFormData({...formData, duration: e.target.value})} /></div>
                </div>
                <div className="flex gap-8 border-t border-slate-100 pt-4">
                    <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={formData.is_recommended} onChange={(e) => setFormData({...formData, is_recommended: e.target.checked})} className="rounded text-blue-600"/> <span className="text-sm font-bold">Recommended</span></label>
                    <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={formData.is_best_seller} onChange={(e) => setFormData({...formData, is_best_seller: e.target.checked})} className="rounded text-blue-600"/> <span className="text-sm font-bold">Best Seller</span></label>
                </div>
            </div>
          )}

          {/* TAB: SCHEDULE (A NAGY DOBÁS!) */}
          {activeTab === "schedule" && (
             <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 animate-in fade-in">
                 
                 {/* BAL: DEFAULT */}
                 <div className="space-y-6">
                     <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-full">
                         <div className="flex items-center gap-2 mb-4">
                             <div className="bg-blue-100 p-2 rounded-lg"><Clock className="w-5 h-5 text-blue-600"/></div>
                             <div>
                                 <h3 className="font-bold text-slate-900">Default Schedule</h3>
                                 <p className="text-xs text-slate-500">Applies to every day unless overridden.</p>
                             </div>
                         </div>
                         <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 mb-6">
                             <div className="grid grid-cols-3 gap-2 mb-3">
                                 <div><label className="text-[10px] font-bold uppercase">Start</label><Input type="time" value={genStart} onChange={(e) => setGenStart(e.target.value)} className="bg-white h-8 text-xs" /></div>
                                 <div><label className="text-[10px] font-bold uppercase">End</label><Input type="time" value={genEnd} onChange={(e) => setGenEnd(e.target.value)} className="bg-white h-8 text-xs" /></div>
                                 <div><label className="text-[10px] font-bold uppercase">Min</label><Input type="number" value={genInterval} onChange={(e) => setGenInterval(Number(e.target.value))} className="bg-white h-8 text-xs" /></div>
                             </div>
                             <Button onClick={generateSlots} size="sm" variant="secondary" className="w-full text-xs font-bold border border-slate-300">Generate Defaults</Button>
                         </div>
                         <div className="flex flex-wrap gap-2">
                             {formData.time_slots.length === 0 && <p className="text-xs text-slate-400">No default slots.</p>}
                             {formData.time_slots.map(slot => (
                                 <button key={slot} onClick={() => toggleDefaultSlot(slot)} className="bg-slate-100 hover:bg-red-50 hover:text-red-600 border border-slate-200 text-slate-700 text-xs font-bold px-2 py-1.5 rounded transition-all">
                                     {slot}
                                 </button>
                             ))}
                         </div>
                     </div>
                 </div>

                 {/* JOBB: KIVÉTELEK (PIROS/ZÖLD) */}
                 <div className="space-y-6">
                     <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-full border-l-4 border-l-amber-400">
                         <div className="flex items-center gap-2 mb-6">
                             <div className="bg-amber-100 p-2 rounded-lg"><CalendarIcon className="w-5 h-5 text-amber-600"/></div>
                             <div>
                                 <h3 className="font-bold text-slate-900">Daily Overrides</h3>
                                 <p className="text-xs text-slate-500">Close specific slots for a specific date.</p>
                             </div>
                         </div>

                         <div className="mb-6">
                             <label className="text-xs font-bold uppercase text-slate-500 mb-1 block">Select Date</label>
                             <Input 
                                type="date" 
                                value={selectedOverrideDate} 
                                onChange={(e) => setSelectedOverrideDate(e.target.value)}
                                className="font-bold"
                             />
                         </div>

                         {selectedOverrideDate ? (
                             <div className="animate-in slide-in-from-top-2">
                                 <div className="flex justify-between items-center mb-3">
                                     <span className="text-sm font-bold text-slate-900">
                                         {new Date(selectedOverrideDate).toLocaleDateString()}
                                     </span>
                                     {isDateOverridden(selectedOverrideDate) && (
                                         <Button size="sm" variant="ghost" onClick={() => resetOverrideDate(selectedOverrideDate)} className="text-xs h-7 text-blue-500 hover:bg-blue-50">
                                             <RotateCcw className="w-3 h-3 mr-1"/> Reset
                                         </Button>
                                     )}
                                 </div>

                                 <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                     <div className="flex flex-wrap gap-2">
                                         {/* Itt végigmegyünk az ÖSSZES alap sloton, hogy megmutassuk mi van zárva és mi nyitva */}
                                         {formData.time_slots.map(slot => {
                                             const isActive = getActiveSlotsForDate(selectedOverrideDate).includes(slot);
                                             return (
                                                 <button 
                                                    key={slot} 
                                                    onClick={() => toggleOverrideSlot(selectedOverrideDate, slot)} 
                                                    className={`
                                                        text-xs font-bold px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 border
                                                        ${isActive 
                                                            ? "bg-green-100 text-green-700 border-green-200 hover:opacity-80" // ZÖLD (NYITVA)
                                                            : "bg-red-100 text-red-500 border-red-200 hover:opacity-80 line-through opacity-70" // PIROS (ZÁRVA)
                                                        }
                                                    `}
                                                 >
                                                     {slot} 
                                                     {isActive ? <CheckCircle2 className="w-3 h-3"/> : <Ban className="w-3 h-3"/>}
                                                 </button>
                                             );
                                         })}
                                     </div>
                                 </div>
                             </div>
                         ) : (
                             <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                 <p className="text-slate-400 text-sm">Select a date to manage availability.</p>
                             </div>
                         )}
                     </div>
                 </div>
             </div>
          )}

          {/* TAB: TICKETS */}
          {activeTab === "tickets" && (
             <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6 animate-in fade-in">
                 <div className="flex items-center justify-between">
                     <h3 className="font-bold text-slate-900">Ticket Types</h3>
                     <label className="flex items-center gap-2 cursor-pointer bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                        <input type="checkbox" checked={formData.req_all_travelers} onChange={(e) => setFormData({...formData, req_all_travelers: e.target.checked})} className="rounded text-blue-600" />
                        <span className="text-xs font-bold text-slate-600">Require ALL traveler names</span>
                     </label>
                 </div>
                 
                 <div className="space-y-3">
                     {formData.ticket_types.map((ticket, index) => (
                         <div key={index} className="flex gap-4 items-end bg-slate-50 p-4 rounded-lg border border-slate-200">
                             <div className="flex-1">
                                 <label className="text-[10px] font-bold text-slate-400 uppercase">Ticket Name</label>
                                 <Input value={ticket.name} onChange={(e) => {
                                     const n = [...formData.ticket_types]; n[index].name = e.target.value; setFormData({...formData, ticket_types: n});
                                 }} placeholder="e.g. Adult (18+)" className="bg-white" />
                             </div>
                             <div className="w-32">
                                 <label className="text-[10px] font-bold text-slate-400 uppercase">Price (€)</label>
                                 <Input type="number" value={ticket.price === null ? "" : ticket.price} onChange={(e) => {
                                     const n = [...formData.ticket_types]; n[index].price = e.target.value === "" ? null : Number(e.target.value); setFormData({...formData, ticket_types: n});
                                 }} placeholder="Base Price" className="bg-white" />
                             </div>
                             <Button variant="outline" size="icon" onClick={() => setFormData({...formData, ticket_types: formData.ticket_types.filter((_, i) => i !== index)})} className="text-red-500 hover:bg-red-50"><Trash2 className="w-4 h-4"/></Button>
                         </div>
                     ))}
                     <Button variant="outline" onClick={() => setFormData({...formData, ticket_types: [...formData.ticket_types, {name: "", price: null}]})}>
                         <Plus className="w-4 h-4 mr-2"/> Add Ticket Type
                     </Button>
                 </div>
             </div>
          )}

          {/* TAB: DETAILS */}
          {activeTab === "details" && (
             <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6 animate-in fade-in">
                 <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Short Description</label>
                    <Textarea value={formData.short_desc} onChange={(e) => setFormData({...formData, short_desc: e.target.value})} placeholder="Brief summary (max 2 lines)" className="h-20" />
                 </div>
                 <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Full Description</label>
                    <Textarea value={formData.full_description} onChange={(e) => setFormData({...formData, full_description: e.target.value})} placeholder="Detailed itinerary..." className="h-64 font-mono text-sm leading-relaxed" />
                 </div>
             </div>
          )}

          {/* TAB: MEDIA */}
          {activeTab === "media" && (
             <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6 animate-in fade-in">
                 <h3 className="font-bold text-slate-900">Image URLs</h3>
                 <p className="text-sm text-slate-500 -mt-4 mb-4">Add direct links to images.</p>
                 <DynamicList items={formData.images} onChange={(newImgs:any) => setFormData({...formData, images: newImgs})} placeholder="https://..." />
                 <div className="grid grid-cols-4 gap-4 mt-6">
                    {formData.images.map((img, i) => img && (
                        <div key={i} className="aspect-square bg-slate-100 rounded-lg relative overflow-hidden border border-slate-200">
                             {/* eslint-disable-next-line @next/next/no-img-element */}
                             <img src={img} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                    ))}
                 </div>
             </div>
          )}

          {/* TAB: INCLUSIONS */}
          {activeTab === "inclusions" && (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in">
                 <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                     <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><Settings className="w-4 h-4"/> What's Included</h3>
                     <DynamicList items={formData.inclusions} onChange={(val:any) => setFormData({...formData, inclusions: val})} placeholder="e.g. Skip the line ticket" />
                 </div>
                 <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                     <h3 className="font-bold text-slate-900 mb-4 text-red-600">What's Excluded</h3>
                     <DynamicList items={formData.exclusions} onChange={(val:any) => setFormData({...formData, exclusions: val})} placeholder="e.g. Hotel pickup" />
                 </div>
                 <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm col-span-2">
                     <h3 className="font-bold text-slate-900 mb-4">Languages</h3>
                     <DynamicList items={formData.languages} onChange={(val:any) => setFormData({...formData, languages: val})} placeholder="e.g. English, French" />
                 </div>
             </div>
          )}

          {/* TAB: FAQ */}
          {activeTab === "faq" && (
             <div className="space-y-6 animate-in fade-in">
                 <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                     <h3 className="font-bold text-slate-900">Location Details</h3>
                     <div className="grid grid-cols-2 gap-4">
                         <div><label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Meeting Point</label><Input value={formData.meeting_point} onChange={(e) => setFormData({...formData, meeting_point: e.target.value})} /></div>
                         <div><label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Google Maps Embed URL</label><Input value={formData.map_url} onChange={(e) => setFormData({...formData, map_url: e.target.value})} /></div>
                     </div>
                 </div>

                 <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                     <h3 className="font-bold text-slate-900 mb-4">FAQ</h3>
                     <div className="space-y-4">
                         {formData.faq.map((item, index) => (
                             <div key={index} className="bg-slate-50 p-4 rounded-lg border border-slate-200 relative group">
                                 <button onClick={() => { const newFaq = formData.faq.filter((_, i) => i !== index); setFormData({...formData, faq: newFaq}); }} className="absolute top-2 right-2 text-slate-400 hover:text-red-500"><X className="w-4 h-4"/></button>
                                 <div className="mb-2"><label className="text-[10px] font-bold text-slate-400 uppercase">Question</label><Input value={item.q} onChange={(e) => { const n = [...formData.faq]; n[index].q = e.target.value; setFormData({...formData, faq: n}); }} className="bg-white" /></div>
                                 <div><label className="text-[10px] font-bold text-slate-400 uppercase">Answer</label><Textarea value={item.a} onChange={(e) => { const n = [...formData.faq]; n[index].a = e.target.value; setFormData({...formData, faq: n}); }} className="bg-white h-16" /></div>
                             </div>
                         ))}
                         <Button variant="outline" onClick={() => setFormData({...formData, faq: [...formData.faq, {q: "", a: ""}]})}><Plus className="w-4 h-4 mr-2"/> Add FAQ</Button>
                     </div>
                 </div>
             </div>
          )}

        </div>
      </div>
    </div>
  );
}