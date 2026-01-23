"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  Star, MapPin, Clock, Zap, CheckCircle2, ChevronRight, 
  Globe, Map, ShieldCheck, Info 
} from "lucide-react";
import BookingWidget from "@/components/product/BookingWidget";

// --- TÍPUSOK (FRISSÍTVE: Itt volt a hiba) ---
interface TicketType {
  name: string;
  price: number;
}

interface ProductDetail {
  id: string;
  slug: string;
  title: string;
  location: string;
  rating: number;
  reviews: number;
  price: number;
  original_price: number;
  short_desc: string;
  full_description: string;
  duration: string;
  confirmation: string;
  languages: string[];
  cancellation: string;
  inclusions: string[];
  exclusions: string[];
  images: string[];
  meeting_point?: string;
  map_url?: string;
  faq?: { q: string; a: string }[];
  ticket_types?: TicketType[];
  req_all_travelers?: boolean;
  // EZ A KETTŐ HIÁNYZOTT:
  time_slots?: string[]; 
  date_overrides?: Record<string, string[]>;
}

export default function ProductPage() {
  const params = useParams();
  const rawSlug = params.slug as string;
  
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSticky, setShowSticky] = useState(false);

  // TERMÉK LEKÉRÉSE
  useEffect(() => {
    const fetchProduct = async () => {
        if (!rawSlug) return;
        const slug = decodeURIComponent(rawSlug);
        
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('slug', slug)
            .single();
            
        if (data) setProduct(data);
        setLoading(false);
    };
    fetchProduct();
  }, [rawSlug]);

  // SCROLL FIGYELÉS (MOBIL STICKY BAR-HOZ)
  useEffect(() => {
    const handleScroll = () => setShowSticky(window.scrollY > 600);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToBooking = () => {
      document.getElementById("booking-widget")?.scrollIntoView({ behavior: "smooth" });
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>;
  if (!product) return <div className="min-h-screen flex items-center justify-center">Product not found</div>;

  return (
    <main className="min-h-screen bg-[#f8f9fa] font-sans text-slate-900 pb-24 md:pb-0">
      <Navbar />

      {/* MOBILE BOTTOM BAR */}
      <div className={`fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 p-3 z-50 md:hidden transition-transform duration-300 ${showSticky ? 'translate-y-0' : 'translate-y-full'} shadow-[0_-5px_20px_rgba(0,0,0,0.1)]`}>
          <div className="flex items-center justify-between gap-3">
              <div className="flex flex-col">
                  <span className="text-[10px] text-slate-500 font-bold uppercase">From</span>
                  <span className="text-xl font-black text-slate-900">€{product.price}</span>
              </div>
              <Button onClick={scrollToBooking} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold h-11 rounded-xl shadow-lg shadow-blue-900/20">
                  Select Dates
              </Button>
          </div>
      </div>

      {/* HEADER SECTION */}
      <div className="bg-white border-b border-slate-200 pt-24 pb-6 md:pt-32 md:pb-8">
         <div className="container mx-auto px-4">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-[10px] md:text-xs text-slate-500 uppercase font-bold tracking-wider mb-4">
                <Link href="/" className="hover:text-blue-600 transition">Home</Link> 
                <ChevronRight className="w-3 h-3" />
                <span className="text-blue-600 truncate max-w-[200px]">{product.location}</span>
            </div>
            
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-black text-slate-900 mb-4 leading-tight">{product.title}</h1>
            
            <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-1 text-amber-400 font-bold bg-amber-50 px-2 py-1 rounded-md border border-amber-100">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-slate-900">{product.rating}</span>
                    <span className="text-slate-400 font-normal">({product.reviews} reviews)</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-600 font-medium text-xs md:text-sm">
                    <MapPin className="w-4 h-4 text-slate-400" /> {product.location}
                </div>
            </div>
         </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="container mx-auto px-4 py-8">
         <div className="flex flex-col lg:flex-row gap-10">
            
            {/* BAL OLDAL (INFORMÁCIÓK) */}
            <div className="lg:w-2/3 space-y-10">
                
                {/* GALÉRIA GRID */}
                <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-2 h-[300px] md:h-[450px] rounded-2xl overflow-hidden shadow-sm">
                    <div className="md:col-span-2 md:row-span-2 relative bg-slate-200 group">
                        {product.images?.[0] && <Image src={product.images[0]} alt="Main" fill className="object-cover transition duration-700 group-hover:scale-105" priority />}
                    </div>
                    <div className="hidden md:block relative bg-slate-200 group">
                        {product.images?.[1] && <Image src={product.images[1]} alt="1" fill className="object-cover transition duration-700 group-hover:scale-105" />}
                    </div>
                    <div className="hidden md:block relative bg-slate-200 group">
                        {product.images?.[2] && <Image src={product.images[2]} alt="2" fill className="object-cover transition duration-700 group-hover:scale-105" />}
                    </div>
                    <div className="hidden md:block relative bg-slate-200 group">
                        {product.images?.[3] ? (
                            <Image src={product.images[3]} alt="3" fill className="object-cover transition duration-700 group-hover:scale-105" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-100 text-xs font-bold uppercase">View Gallery</div>
                        )}
                    </div>
                </div>

                {/* HIGHLIGHTS & SUMMARY */}
                <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm">
                    <p className="text-lg md:text-xl text-slate-700 leading-relaxed mb-8 font-medium">{product.short_desc}</p>
                    
                    <h3 className="font-bold text-slate-900 mb-5 text-sm uppercase tracking-wide flex items-center gap-2">
                        <Zap className="w-4 h-4 text-amber-500"/> Highlights
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {product.inclusions?.slice(0, 6).map((inc, i) => (
                             <div key={i} className="flex items-start gap-3">
                                <div className="mt-0.5 bg-green-100 p-1 rounded-full"><CheckCircle2 className="w-3.5 h-3.5 text-green-700" /></div>
                                <span className="text-slate-700 text-sm font-semibold">{inc}</span>
                             </div>
                        ))}
                    </div>
                </div>

                {/* KEY INFO BAR */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                        <span className="text-slate-400 text-[10px] font-bold uppercase block mb-1">Duration</span>
                        <span className="text-sm font-bold flex items-center gap-1.5"><Clock className="w-4 h-4 text-blue-600"/> {product.duration}</span>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                        <span className="text-slate-400 text-[10px] font-bold uppercase block mb-1">Mobile Ticket</span>
                        <span className="text-sm font-bold flex items-center gap-1.5"><Zap className="w-4 h-4 text-amber-500"/> Accepted</span>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                        <span className="text-slate-400 text-[10px] font-bold uppercase block mb-1">Language</span>
                        <span className="text-sm font-bold flex items-center gap-1.5"><Globe className="w-4 h-4 text-indigo-500"/> {product.languages?.[0]}</span>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                        <span className="text-slate-400 text-[10px] font-bold uppercase block mb-1">Cancellation</span>
                        <span className="text-sm font-bold flex items-center gap-1.5 text-green-600"><ShieldCheck className="w-4 h-4"/> Flexible</span>
                    </div>
                </div>

                {/* FULL DESCRIPTION */}
                <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm">
                    <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-6">About this activity</h2>
                    <div className="prose prose-slate max-w-none text-slate-600 leading-7 text-sm md:text-base whitespace-pre-line">
                        {product.full_description}
                    </div>
                </div>
                 
                 {/* MEETING POINT / MAP */}
                <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900 mb-5 flex items-center gap-2"><Map className="w-5 h-5 text-blue-600"/> Meeting Point</h3>
                    <div className="h-[300px] w-full bg-slate-100 rounded-xl overflow-hidden relative mb-5 border border-slate-200">
                            {product.map_url ? (
                            <iframe src={product.map_url} width="100%" height="100%" style={{border:0}} allowFullScreen loading="lazy"></iframe>
                            ) : (<div className="flex items-center justify-center h-full text-slate-400 font-medium">Map view not available</div>)}
                    </div>
                    <div className="flex items-start gap-3 bg-slate-50 p-4 rounded-xl">
                         <MapPin className="w-5 h-5 text-red-500 mt-0.5 shrink-0"/>
                         <div>
                             <p className="font-bold text-slate-900 text-sm mb-1">Directions</p>
                             <p className="text-slate-600 text-sm leading-relaxed">{product.meeting_point || "Please see your voucher for exact meeting point details."}</p>
                         </div>
                    </div>
                </div>

                {/* FAQ */}
                {product.faq && product.faq.length > 0 && (
                    <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm">
                        <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2"><Info className="w-5 h-5 text-blue-600"/> Frequently Asked Questions</h3>
                        <div className="space-y-4">
                            {product.faq.map((item, i) => (
                                <div key={i} className="border border-slate-100 rounded-xl p-5 bg-slate-50/50">
                                    <p className="font-bold text-slate-900 text-sm mb-2">{item.q}</p>
                                    <p className="text-slate-600 text-sm leading-relaxed">{item.a}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* JOBB OLDAL (WIDGET HELYE) */}
            <div className="lg:w-1/3 relative" id="booking-widget">
                <div className="h-full"> 
                    
                    {/* WIDGET KOMPONENS BEKÖTÉSE - MOST MÁR NEM SÍR A TS */}
                    <BookingWidget 
                        productId={product.id}
                        productTitle={product.title}
                        basePrice={product.price}
                        ticketTypes={product.ticket_types || []}
                        reqAllTravelers={product.req_all_travelers || false}
                        defaultTimeSlots={product.time_slots || []}
                        dateOverrides={product.date_overrides || {}}
                    />

                    {/* Why Us Box */}
                    <div className="mt-6 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                        <p className="font-bold text-sm text-slate-900 mb-3">Why book with Entrigo?</p>
                        <ul className="text-xs text-slate-500 space-y-2.5">
                            <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-green-600"/> Trusted Source</li>
                            <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-green-600"/> Instant Confirmation</li>
                            <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-green-600"/> 24/7 Customer Support</li>
                        </ul>
                    </div>

                </div>
            </div>

         </div>
      </div>
      <Footer />
    </main>
  );
}