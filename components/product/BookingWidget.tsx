"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { 
  Calendar as CalendarIcon, Clock, ChevronLeft, CheckCircle2, AlertCircle, 
  User, Users, Mail, Phone, CreditCard, Loader2, Lock 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { loadStripe } from "@stripe/stripe-js";
import { cn } from "@/lib/utils";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout
} from '@stripe/react-stripe-js';

// Ha nincs kulcs, nem omlik össze, csak logol
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "");

interface TicketType { name: string; price: number; }

interface BookingWidgetProps {
  productId: string;
  productTitle: string;
  basePrice: number;
  ticketTypes: TicketType[];
  reqAllTravelers?: boolean;
  defaultTimeSlots: string[];
  dateOverrides?: Record<string, string[]>;
}

export default function BookingWidget({
  productId,
  productTitle,
  basePrice,
  ticketTypes = [],
  reqAllTravelers = false,
  defaultTimeSlots = [],
  dateOverrides = {}
}: BookingWidgetProps) {
  
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState<string | null>(null);
  const [tickets, setTickets] = useState<{ [key: string]: number }>({});
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [isPending, setIsPending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  const [leadTraveler, setLeadTraveler] = useState({ name: "", email: "", phone: "" });
  const [allGuestNames, setAllGuestNames] = useState<string[]>([]);

  useEffect(() => {
    const initialTickets: { [key: string]: number } = {};
    if (ticketTypes.length > 0) {
      ticketTypes.forEach(t => initialTickets[t.name] = 0);
      const defaultTicket = ticketTypes.find(t => t.name.toLowerCase().includes('adult')) || ticketTypes[0];
      if (defaultTicket) initialTickets[defaultTicket.name] = 1;
    } else {
      initialTickets["Guest"] = 1;
    }
    setTickets(initialTickets);
  }, [ticketTypes]);

  useEffect(() => {
    let price = 0;
    let count = 0;
    if (ticketTypes.length > 0) {
      Object.entries(tickets).forEach(([name, qty]) => {
        const type = ticketTypes.find(t => t.name === name);
        if (type) price += type.price * qty;
        count += qty;
      });
    } else {
      count = Object.values(tickets).reduce((a, b) => a + b, 0);
      price = count * basePrice;
    }
    setTotalPrice(price);
    setTotalCount(count);
    
    setAllGuestNames(prev => {
        const newArr = new Array(count).fill("");
        for(let i=0; i<Math.min(prev.length, count); i++) newArr[i] = prev[i];
        return newArr;
    });
    setErrorMessage(null);
    if (step === 5) setStep(4); // Ha változik az ár, lépjen vissza
    setClientSecret(null);
  }, [tickets, basePrice, ticketTypes]);

  // Date Logic
  const getSlotCount = (day: Date) => {
      const key = format(day, "yyyy-MM-dd");
      if (dateOverrides && dateOverrides[key] !== undefined) return dateOverrides[key].length;
      return defaultTimeSlots.length;
  };
  const isDateBlocked = (day: Date) => getSlotCount(day) === 0;
  const isLowAvailability = (day: Date) => { const c = getSlotCount(day); return c > 0 && c < 3; };
  
  const getAvailableTimes = () => {
    if (!date) return [];
    const key = format(date, "yyyy-MM-dd");
    return dateOverrides?.[key] ?? defaultTimeSlots;
  };

  const handleGoToPayment = async () => {
    setErrorMessage(null);
    setIsPending(true);

    try {
        const payload = {
            productTitle,
            productId,
            date: date ? format(date, 'yyyy-MM-dd') : null,
            time,
            tickets,
            totalPrice,
            leadTraveler,
            allGuestNames: reqAllTravelers ? allGuestNames : []
        };

        const response = await fetch('/api/create-checkout-session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (data.clientSecret) {
            setClientSecret(data.clientSecret);
            setStep(5);
        } else {
            setErrorMessage(data.error || "Payment initialization failed.");
        }

    } catch (error: any) {
        setErrorMessage("Network error: " + error.message);
    } finally {
        setIsPending(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-slate-100 overflow-hidden sticky top-28">
      
      {/* HEADER */}
      <div className="bg-slate-50 border-b border-slate-100 p-4 flex items-center justify-between">
         <div className="flex items-center gap-2">
             {step > 1 && step < 5 && <button onClick={() => setStep(prev => (prev-1) as any)} className="p-1 rounded-full hover:bg-slate-200"><ChevronLeft className="w-5 h-5 text-slate-600"/></button>}
             {step === 5 && <button onClick={() => setStep(4)} className="p-1 rounded-full hover:bg-slate-200"><ChevronLeft className="w-5 h-5 text-slate-600"/></button>}
             
             <span className="font-bold text-slate-900 truncate max-w-[150px] sm:max-w-none">
                 {step === 1 && "Choose Date"}
                 {step === 2 && "Choose Time"}
                 {step === 3 && "Select Tickets"}
                 {step === 4 && "Your Details"}
                 {step === 5 && "Payment"}
             </span>
         </div>
         <div className="text-xs font-bold text-slate-400 bg-white px-2 py-1 rounded-md border border-slate-200 shrink-0">{step} / 5</div>
      </div>

      {(date || time) && step < 5 && (
          <div className="bg-blue-50/50 px-4 py-2 border-b border-blue-100 flex items-center gap-4 text-xs font-medium text-blue-800 overflow-x-auto whitespace-nowrap scrollbar-hide">
              {date && <span className="flex items-center gap-1 shrink-0"><CalendarIcon className="w-3 h-3"/> {format(date, "MMM d")}</span>}
              {time && <span className="flex items-center gap-1 shrink-0"><Clock className="w-3 h-3"/> {time}</span>}
          </div>
      )}

      <div className={step === 5 ? "p-0" : "p-4 sm:p-6"}>
        
        {/* STEP 1: CALENDAR */}
        {step === 1 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="w-full">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(d) => { if(d) { setDate(d); setTime(null); setStep(2); } }}
                        disabled={(d) => d < new Date(new Date().setHours(0,0,0,0)) || isDateBlocked(d)}
                        className="rounded-xl w-full" 
                        classNames={{
                            months: "w-full",
                            month: "w-full space-y-4",
                            table: "w-full border-collapse space-y-1",
                            head_row: "flex w-full justify-between mb-2",
                            head_cell: "text-muted-foreground rounded-md w-full font-normal text-[0.8rem] text-center",
                            row: "flex w-full justify-between mt-2 gap-1",
                            cell: "text-center text-sm p-0 relative w-full flex justify-center",
                            day: "h-9 w-full p-0 font-medium aria-selected:opacity-100 hover:bg-slate-100 rounded-lg transition-colors text-slate-700",
                            day_selected: "bg-slate-900 text-white hover:bg-slate-800 focus:bg-slate-900 shadow-md",
                            day_today: "bg-slate-50 text-slate-900 font-bold border border-slate-200",
                            day_outside: "text-slate-300 opacity-50",
                            day_disabled: "text-slate-300 opacity-50 cursor-not-allowed hover:bg-transparent decoration-slate-300",
                            day_hidden: "invisible",
                        }}
                        modifiers={{ low: isLowAvailability }}
                        modifiersClassNames={{ low: "bg-amber-100 text-amber-700 font-bold hover:bg-amber-200" }}
                    />
                </div>
                <div className="flex justify-center gap-4 mt-6 pt-4 border-t border-slate-50">
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-medium"><div className="w-2 h-2 rounded-full bg-slate-200"></div> Sold out</div>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-medium"><div className="w-2 h-2 rounded-full bg-amber-100 border border-amber-200"></div> Limited</div>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-medium"><div className="w-2 h-2 rounded-full bg-white border border-slate-200"></div> Available</div>
                </div>
            </div>
        )}

        {/* STEP 2: TIME */}
        {step === 2 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <h4 className="text-sm font-bold text-slate-900 mb-4 text-center">Available slots</h4>
                <div className="grid grid-cols-3 gap-3">
                    {getAvailableTimes().length > 0 ? getAvailableTimes().map((t, i) => (
                        <button key={i} onClick={() => { setTime(t); setStep(3); }} className={`py-3 rounded-xl border text-sm font-bold transition-all hover:scale-105 active:scale-95 ${time === t ? "bg-blue-600 text-white border-blue-600 shadow-lg" : "bg-white text-slate-700 border-slate-200 hover:border-blue-300 hover:bg-blue-50"}`}>
                            {t}
                        </button>
                    )) : <div className="col-span-3 text-center text-slate-400 py-4 text-sm">No slots available.</div>}
                </div>
            </div>
        )}

        {/* STEP 3: TICKETS */}
        {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="space-y-4">
                    {ticketTypes.map((type, i) => (
                        <div key={i} className="flex items-center justify-between">
                            <div><p className="font-bold text-slate-900 text-sm">{type.name}</p><p className="text-xs text-slate-500">€{type.price}</p></div>
                            <div className="flex items-center gap-3 bg-slate-50 rounded-lg p-1 border border-slate-200">
                                <button onClick={() => setTickets(p => ({...p, [type.name]: Math.max(0, (p[type.name]||0)-1)}))} className="w-8 h-8 bg-white rounded shadow-sm font-bold active:scale-95" disabled={tickets[type.name] <= 0}>-</button>
                                <span className="w-6 text-center font-bold text-slate-900 text-sm">{tickets[type.name]}</span>
                                <button onClick={() => setTickets(p => ({...p, [type.name]: (p[type.name]||0)+1}))} className="w-8 h-8 bg-white rounded shadow-sm text-blue-600 font-bold active:scale-95">+</button>
                            </div>
                        </div>
                    ))}
                </div>
                <Button className="w-full h-12 bg-slate-900 text-white font-bold rounded-xl mt-4" disabled={totalPrice === 0} onClick={() => setStep(4)}>
                    Continue
                </Button>
            </div>
        )}

        {/* STEP 4: DETAILS (FIXED FOR MOBILE) */}
        {step === 4 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                
                {/* LEAD TRAVELER INFO */}
                <div>
                    <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2"><User className="w-4 h-4"/> Contact Details</h4>
                    <div className="space-y-3">
                        {/* Name Input - Növelt padding és méret */}
                        <div className="relative">
                            <input 
                                placeholder="Full Name" 
                                className="w-full border rounded-xl p-3 pl-4 text-sm bg-slate-50 focus:bg-white transition-colors outline-none focus:ring-2 focus:ring-blue-500 h-12"
                                value={leadTraveler.name}
                                onChange={(e) => setLeadTraveler({...leadTraveler, name: e.target.value})}
                            />
                        </div>
                        
                        {/* JAVÍTÁS: Mobilon 1 oszlop (egymás alatt), Gépen 2 oszlop */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="relative group">
                                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"/>
                                <input 
                                    placeholder="Email" 
                                    type="email"
                                    className="w-full border rounded-xl pl-10 p-3 text-sm bg-slate-50 focus:bg-white outline-none focus:ring-2 focus:ring-blue-500 h-12"
                                    value={leadTraveler.email}
                                    onChange={(e) => setLeadTraveler({...leadTraveler, email: e.target.value})}
                                />
                            </div>
                            <div className="relative group">
                                <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"/>
                                <input 
                                    placeholder="Phone" 
                                    type="tel"
                                    className="w-full border rounded-xl pl-10 p-3 text-sm bg-slate-50 focus:bg-white outline-none focus:ring-2 focus:ring-blue-500 h-12"
                                    value={leadTraveler.phone}
                                    onChange={(e) => setLeadTraveler({...leadTraveler, phone: e.target.value})}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* ALL TRAVELERS */}
                {reqAllTravelers && totalCount > 0 && (
                    <div className="border-t border-slate-100 pt-4">
                        <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2"><Users className="w-4 h-4"/> Guest Names</h4>
                        <div className="space-y-3 max-h-[200px] overflow-y-auto pr-1">
                            {allGuestNames.map((name, i) => (
                                <div key={i} className="flex items-center gap-2">
                                    <span className="text-xs text-slate-400 w-6 shrink-0 font-mono">#{i+1}</span>
                                    <input 
                                        placeholder={`Guest ${i+1} Name`} 
                                        className="flex-1 border rounded-xl p-3 text-sm bg-slate-50 focus:bg-white outline-none focus:ring-2 focus:ring-blue-500"
                                        value={name}
                                        onChange={(e) => {
                                            const newNames = [...allGuestNames];
                                            newNames[i] = e.target.value;
                                            setAllGuestNames(newNames);
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* SUMMARY & NEXT BUTTON */}
                <div className="pt-4 border-t border-slate-100">
                    <div className="flex justify-between items-end mb-4">
                        <div><span className="text-slate-400 text-xs font-bold uppercase block">Total</span></div>
                        <span className="text-3xl font-black text-slate-900">€{totalPrice}</span>
                    </div>
                    
                    {errorMessage && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                            <p className="text-xs text-red-600 font-bold leading-tight">{errorMessage}</p>
                        </div>
                    )}

                    <Button 
                        className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-lg active:scale-95 transition-all flex items-center gap-2 text-md"
                        disabled={!leadTraveler.name || !leadTraveler.email || isPending}
                        onClick={handleGoToPayment}
                    >
                        {isPending ? <><Loader2 className="w-5 h-5 animate-spin"/> Preparing...</> : <><Lock className="w-4 h-4"/> Go to Payment</>}
                    </Button>
                </div>
            </div>
        )}

        {/* STEP 5: EMBEDDED STRIPE CHECKOUT (FIXED HEIGHT) */}
        {step === 5 && clientSecret && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <EmbeddedCheckoutProvider
                    stripe={stripePromise}
                    options={{ clientSecret }}
                >
                    {/* JAVÍTÁS: Levettük a fix magasságot, így a Stripe akkorára nő, amekkorára kell */}
                    <div className="min-h-[400px]">
                        <EmbeddedCheckout />
                    </div>
                </EmbeddedCheckoutProvider>
            </div>
        )}

      </div>
    </div>
  );
}