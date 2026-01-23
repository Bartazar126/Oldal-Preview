"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  ChevronRight, ChevronLeft, Calendar as CalendarIcon, 
  ShieldCheck, Loader2, Clock, Ticket, AlertCircle 
} from "lucide-react";
import { supabase } from "@/lib/supabase";

interface TicketType {
  name: string;
  price: number;
}

interface BookingWidgetProps {
  productId: string;
  productTitle: string;
  basePrice: number;
  ticketTypes: TicketType[];
  reqAllTravelers: boolean;
  defaultTimeSlots: string[];            // <--- ÚJ PROP
  dateOverrides: Record<string, string[]>; // <--- ÚJ PROP
}

export default function BookingWidget({ 
  productId, 
  productTitle, 
  basePrice, 
  ticketTypes, 
  reqAllTravelers,
  defaultTimeSlots, 
  dateOverrides 
}: BookingWidgetProps) {
  
  const router = useRouter();

  // --- STATE ---
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [travelers, setTravelers] = useState<string[]>([]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingTime, setLoadingTime] = useState(false); 
  const [error, setError] = useState<string | null>(null); // <--- HIBA STATE

  // Inicializálás
  useEffect(() => {
    const initQ: Record<string, number> = {};
    ticketTypes?.forEach((t, i) => initQ[t.name] = i === 0 ? 1 : 0);
    setQuantities(initQ);
  }, [ticketTypes]);

  // --- LOGIKA: IDŐPONTOK LEKÉRÉSE ---
  const getAvailableTimeSlots = () => {
      if (!selectedDate) return [];
      
      // Dátum konvertálása YYYY-MM-DD formátumra (Helyi idő szerint!)
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedDate.getDate()).padStart(2, '0');
      const dateString = `${year}-${month}-${day}`;

      // 1. Megnézzük, van-e erre a napra kivétel (Override)
      if (dateOverrides && Array.isArray(dateOverrides[dateString])) {
          return dateOverrides[dateString];
      }

      // 2. Ha nincs kivétel, visszaadjuk az alapértelmezett listát
      return defaultTimeSlots || [];
  };

  const currentSlots = getAvailableTimeSlots();

  // --- KALKULÁCIÓK ---
  const totalPrice = ticketTypes?.reduce((acc, t) => {
    return acc + (quantities[t.name] || 0) * (t.price || basePrice);
  }, 0) || 0;

  const totalPeople = Object.values(quantities).reduce((a, b) => a + b, 0);

  // --- HANDLERS ---

  const handleDateClick = (day: number) => {
    setError(null); // Hiba törlése
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const today = new Date(); today.setHours(0,0,0,0);
    if (newDate < today) return;

    setSelectedDate(newDate);
    setLoadingTime(true);
    
    // Kis trükk: Ha váltunk dátumot, töröljük az előző időpontot
    setSelectedTime(null);

    setTimeout(() => {
        setStep(2); 
        setLoadingTime(false);
    }, 300);
  };

  const handleTimeSelect = (time: string) => {
      setError(null);
      setSelectedTime(time);
      setTimeout(() => setStep(3), 200);
  };

  const handleBooking = async () => {
    setError(null);
    setIsSubmitting(true);
    
    // 1. Validáció: Hiányzó adatok
    if (!email || !phone || !travelers[0]) {
        setError("Please fill in all required fields (Email, Phone, Name).");
        setIsSubmitting(false);
        return;
    }

    // 2. Validáció: Email formátum (Basic check)
    if (!email.includes("@")) {
        setError("Please enter a valid email address.");
        setIsSubmitting(false);
        return;
    }

    // Mentés az adatbázisba
    const { error: dbError } = await supabase.from('bookings').insert([{
        product_id: productId,
        product_title: productTitle,
        customer_name: travelers[0],
        customer_email: email,
        total_price: totalPrice,
        guests: totalPeople,
        booking_date: selectedDate, 
        // Itt már menthetnénk az időt is ha bővítettük az adatbázist
        status: 'paid'
    }]);

    setIsSubmitting(false);
    
    if (dbError) {
        setError("Booking failed: " + dbError.message);
    } else {
        router.push("/thank-you");
    }
  };

  // --- RENDER ---

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden transition-all duration-300">
        
        {/* HEADER SUMMARY */}
        {(step > 1 && selectedDate) && (
            <div className="bg-slate-900 text-white p-4 flex justify-between items-center text-sm animate-in slide-in-from-top duration-300">
                <div>
                    <p className="opacity-70 text-xs uppercase font-bold">Selected</p>
                    <p className="font-bold flex items-center gap-2">
                        {selectedDate.toLocaleDateString(undefined, {month:'short', day:'numeric'})}
                        {selectedTime && <span className="bg-slate-700 px-1.5 py-0.5 rounded text-xs">{selectedTime}</span>}
                    </p>
                </div>
                <button onClick={() => {setStep(1); setSelectedTime(null); setError(null);}} className="text-xs font-bold text-blue-400 hover:text-blue-300 uppercase">Change</button>
            </div>
        )}

        <div className="p-5">
            {/* STEP 1: DATE */}
            {step === 1 && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-slate-900 flex items-center gap-2"><CalendarIcon className="w-5 h-5 text-blue-600"/> Select Date</h3>
                        <div className="flex gap-1">
                            <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))} className="p-1 hover:bg-slate-100 rounded transition-colors"><ChevronLeft className="w-5 h-5"/></button>
                            <span className="text-sm font-bold pt-1 min-w-[80px] text-center">{currentMonth.toLocaleString('default', { month: 'short', year: '2-digit' })}</span>
                            <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))} className="p-1 hover:bg-slate-100 rounded transition-colors"><ChevronRight className="w-5 h-5"/></button>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-7 gap-1 text-center mb-2">
                        {['S','M','T','W','T','F','S'].map(d => <span key={d} className="text-[10px] font-bold text-slate-400">{d}</span>)}
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                        {Array.from({ length: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay() }).map((_, i) => <div key={`e-${i}`} />)}
                        {Array.from({ length: new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate() }).map((_, i) => {
                            const day = i + 1;
                            const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
                            const today = new Date(); today.setHours(0,0,0,0);
                            const isPast = date < today;
                            const isSelected = selectedDate?.toDateString() === date.toDateString();

                            return (
                                <button 
                                    key={day} 
                                    disabled={isPast} 
                                    onClick={() => handleDateClick(day)}
                                    className={`h-9 w-full rounded-md text-sm font-bold transition-all duration-200
                                        ${isSelected ? "bg-blue-600 text-white shadow-lg scale-105" : ""}
                                        ${isPast ? "text-slate-200 cursor-not-allowed" : "hover:bg-blue-50 text-slate-700 hover:scale-110 active:scale-95"}
                                        ${!isPast && !isSelected ? "bg-slate-50" : ""}
                                    `}
                                >
                                    {loadingTime && isSelected ? <Loader2 className="w-4 h-4 animate-spin mx-auto"/> : day}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* STEP 2: TIME SLOTS */}
            {step === 2 && (
                <div className="animate-in fade-in slide-in-from-right-8 duration-300">
                    <div className="flex items-center gap-2 mb-4">
                        <Clock className="w-5 h-5 text-blue-600"/>
                        <h3 className="font-bold text-lg text-slate-900">Select Time</h3>
                    </div>
                    
                    {currentSlots.length === 0 ? (
                        <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                            <p className="text-sm font-bold text-slate-500">No availability for this date.</p>
                            <button onClick={() => setStep(1)} className="text-xs text-blue-600 font-bold mt-2 hover:underline">Choose another date</button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-3 gap-3">
                            {currentSlots.map((time) => (
                                <button 
                                    key={time}
                                    onClick={() => handleTimeSelect(time)}
                                    className={`
                                        py-2.5 rounded-lg border text-sm font-bold transition-all duration-200
                                        ${selectedTime === time 
                                            ? "bg-blue-600 border-blue-600 text-white shadow-md scale-105" 
                                            : "border-slate-200 text-slate-700 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600 active:scale-95 bg-white"}
                                    `}
                                >
                                    {time}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* STEP 3: TICKETS */}
            {step === 3 && (
                <div className="animate-in fade-in slide-in-from-right-8 duration-300">
                    <div className="flex items-center gap-2 mb-6 cursor-pointer group" onClick={() => setStep(2)}>
                        <ChevronLeft className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors"/>
                        <span className="text-xs font-bold text-slate-400 uppercase group-hover:text-slate-600 transition-colors">Back to Time</span>
                    </div>
                    <h3 className="font-bold text-xl text-slate-900 mb-6 flex items-center gap-2"><Ticket className="w-5 h-5 text-blue-600"/> Select Tickets</h3>

                    <div className="space-y-4 mb-8">
                        {ticketTypes?.map((t) => (
                            <div key={t.name} className="flex items-center justify-between border-b border-slate-100 pb-4 last:border-0">
                                <div>
                                    <p className="font-bold text-slate-900">{t.name}</p>
                                    <p className="text-sm text-slate-500">€{t.price || basePrice}</p>
                                </div>
                                <div className="flex items-center gap-3 bg-slate-50 rounded-lg p-1 border border-slate-200">
                                    <button onClick={() => setQuantities({...quantities, [t.name]: Math.max(0, (quantities[t.name] || 0) - 1)})} className="w-8 h-8 flex items-center justify-center bg-white rounded shadow-sm hover:text-blue-600 font-bold transition-all active:scale-90">-</button>
                                    <span className="w-6 text-center font-bold text-sm">{quantities[t.name] || 0}</span>
                                    <button onClick={() => setQuantities({...quantities, [t.name]: (quantities[t.name] || 0) + 1})} className="w-8 h-8 flex items-center justify-center bg-white rounded shadow-sm hover:text-blue-600 font-bold transition-all active:scale-90">+</button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-slate-100 pt-4">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-slate-500 text-sm font-medium">Total Price</span>
                            <span className="text-2xl font-black text-slate-900">€{totalPrice}</span>
                        </div>
                        <Button onClick={() => setStep(4)} disabled={totalPeople === 0} className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg font-bold shadow-lg shadow-blue-500/20 transition-transform active:scale-95">
                            Continue
                        </Button>
                    </div>
                </div>
            )}

            {/* STEP 4: DETAILS */}
            {step === 4 && (
                <div className="animate-in fade-in slide-in-from-right-8 duration-300">
                    <div className="flex items-center gap-2 mb-4 cursor-pointer group" onClick={() => setStep(3)}>
                        <ChevronLeft className="w-4 h-4 text-slate-400 group-hover:text-slate-600"/>
                        <span className="text-xs font-bold text-slate-400 uppercase group-hover:text-slate-600">Back to Tickets</span>
                    </div>
                    <h3 className="font-bold text-xl text-slate-900 mb-6">Enter Details</h3>
                    
                    <div className="space-y-4 mb-6">
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Email</label>
                            <Input 
                                type="email" 
                                value={email} 
                                onChange={(e) => {setError(null); setEmail(e.target.value)}} 
                                placeholder="name@example.com" 
                                className="h-11 bg-slate-50 border-slate-200 focus:bg-white transition-colors" 
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Phone</label>
                            <Input 
                                type="tel" 
                                value={phone} 
                                onChange={(e) => {setError(null); setPhone(e.target.value)}} 
                                placeholder="+1 234 567 89" 
                                className="h-11 bg-slate-50 border-slate-200 focus:bg-white transition-colors" 
                            />
                        </div>
                        
                        {reqAllTravelers ? (
                            <div className="space-y-3 pt-2">
                                <p className="text-sm font-bold text-slate-900 border-b pb-1">Traveler Names</p>
                                {Array.from({ length: totalPeople }).map((_, i) => (
                                    <div key={i} className="animate-in slide-in-from-bottom-2 duration-300" style={{animationDelay: `${i*50}ms`}}>
                                        <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Guest {i+1} {i===0 && "(Lead)"}</label>
                                        <Input 
                                            value={travelers[i] || ""} 
                                            onChange={(e) => {
                                                setError(null);
                                                const newNames = [...travelers];
                                                newNames[i] = e.target.value;
                                                setTravelers(newNames);
                                            }} 
                                            placeholder="Full Name" 
                                            className="bg-slate-50 focus:bg-white"
                                        />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Lead Traveler Name</label>
                                <Input 
                                    value={travelers[0] || ""} 
                                    onChange={(e) => {
                                        setError(null);
                                        const newNames = [...travelers];
                                        newNames[0] = e.target.value;
                                        setTravelers(newNames);
                                    }} 
                                    placeholder="Full Name on ID" 
                                    className="h-11 bg-slate-50 focus:bg-white"
                                />
                            </div>
                        )}
                    </div>
                    
                    {/* INLINE ERROR MESSAGE - Itt jelenik meg a piros hiba */}
                    {error && (
                        <div className="mb-4 bg-red-50 text-red-600 text-sm font-bold p-3 rounded-lg flex items-center gap-2 border border-red-100 animate-in slide-in-from-top-1">
                            <AlertCircle className="w-5 h-5 shrink-0"/>
                            {error}
                        </div>
                    )}

                    <Button onClick={handleBooking} disabled={isSubmitting} className="w-full bg-green-600 hover:bg-green-700 h-14 text-lg font-bold shadow-lg shadow-green-500/20 transition-transform active:scale-95">
                        {isSubmitting ? <Loader2 className="animate-spin"/> : `Pay €${totalPrice}`}
                    </Button>
                    <div className="flex items-center justify-center gap-2 mt-3 text-[10px] text-slate-400">
                        <ShieldCheck className="w-3 h-3"/> SSL Secure Payment
                    </div>
                </div>
            )}
        </div>
    </div>
  );
}