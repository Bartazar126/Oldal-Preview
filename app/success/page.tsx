"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Loader2, Download, Home, Calendar, Clock, Ticket, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!sessionId) return;
    const verifyPayment = async () => {
      try {
        const res = await fetch(`/api/retrieve-session?session_id=${sessionId}`);
        const data = await res.json();
        if (res.ok) setBooking(data.booking);
        else setError(data.error || "Verification failed.");
      } catch (err) { setError("Something went wrong."); } finally { setLoading(false); }
    };
    verifyPayment();
  }, [sessionId]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><Loader2 className="animate-spin text-blue-600 w-12 h-12"/></div>;
  if (error) return <div className="text-center p-10 mt-10"><h1>Something went wrong</h1><p className="text-slate-500">{error}</p><Link href="/"><Button className="mt-4">Home</Button></Link></div>;

  const orderId = booking?.order_number ? String(booking.order_number).padStart(4, '0') : "----";

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 flex flex-col items-center">
      
      <div className="max-w-xl w-full space-y-8">
        
        {/* SUCCESS CARD */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="bg-green-600 p-8 text-center text-white relative">
                <CheckCircle2 className="w-12 h-12 text-white mx-auto mb-4" />
                <h1 className="text-3xl font-black mb-1">Booking Confirmed!</h1>
                <p className="text-green-100 text-sm font-medium">Thank you for your purchase.</p>
            </div>
            <div className="p-8 space-y-6">
                <div className="text-center pb-6 border-b border-dashed border-slate-200">
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Order ID</p>
                    <p className="text-3xl font-mono font-black text-slate-900 select-all">#{orderId}</p>
                </div>

                <div className="space-y-4">
                    <div className="flex items-start gap-4">
                        <div className="bg-blue-50 p-3 rounded-xl"><Ticket className="w-6 h-6 text-blue-600"/></div>
                        <div>
                            <p className="text-xs text-slate-400 font-bold uppercase">Ticket</p>
                            <p className="font-bold text-slate-900 text-lg leading-tight">{booking?.product_title}</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-slate-100 p-2 rounded-lg"><Calendar className="w-4 h-4 text-slate-600"/></div>
                            <div><p className="text-[10px] text-slate-400 font-bold uppercase">Date</p><p className="font-bold text-slate-900 text-sm">{booking?.booking_date}</p></div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="bg-slate-100 p-2 rounded-lg"><Clock className="w-4 h-4 text-slate-600"/></div>
                            <div><p className="text-[10px] text-slate-400 font-bold uppercase">Time</p><p className="font-bold text-slate-900 text-sm">{booking?.booking_time}</p></div>
                        </div>
                    </div>
                </div>

                <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 text-center">
                    <p className="text-amber-800 text-xs font-medium">Confirmation sent to <b>{booking?.customer_email}</b></p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                    <Button variant="outline" className="h-12 rounded-xl border-slate-200 font-bold text-slate-700 hover:bg-slate-50 gap-2"><Download className="w-4 h-4"/> Download PDF</Button>
                    <Link href="/" className="w-full"><Button className="w-full h-12 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 gap-2"><Home className="w-4 h-4"/> Return Home</Button></Link>
                </div>
            </div>
        </div>

        {/* FAQ SECTION (ÚJ!) */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 md:p-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-blue-600"/> Common Questions
            </h3>
            
            <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1" className="border-b-slate-100">
                    <AccordionTrigger className="text-sm font-bold text-slate-700 hover:no-underline">When will I receive my tickets?</AccordionTrigger>
                    <AccordionContent className="text-slate-500 text-sm">
                        Tickets are usually sent instantly to your email address. If you don't see them within 5 minutes, please check your spam folder.
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2" className="border-b-slate-100">
                    <AccordionTrigger className="text-sm font-bold text-slate-700 hover:no-underline">Do I need to print my ticket?</AccordionTrigger>
                    <AccordionContent className="text-slate-500 text-sm">
                        No, you can simply show the QR code on your smartphone at the entrance. Printing is optional.
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3" className="border-b-0">
                    <AccordionTrigger className="text-sm font-bold text-slate-700 hover:no-underline">What if I am late?</AccordionTrigger>
                    <AccordionContent className="text-slate-500 text-sm">
                        Entry times are strict for many attractions. We recommend arriving 15 minutes before your scheduled slot. Late entry is subject to venue capacity.
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>

      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin w-8 h-8 text-slate-400"/></div>}>
      <SuccessContent />
    </Suspense>
  );
}