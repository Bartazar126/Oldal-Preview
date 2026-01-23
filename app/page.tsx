"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import FAQ from "@/components/sections/FAQ";
import WhyUs from "@/components/sections/WhyUs";
import CityCard from "@/components/CityCard";
import { ShieldCheck, Zap, Clock } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Navbar />
      
      {/* 1. HERO */}
      <Hero />

      {/* 2. TRUST BAR */}
      <div className="bg-white border-b border-slate-200 py-4 shadow-sm relative z-20">
         <div className="container mx-auto flex justify-center gap-4 md:gap-12 text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest text-center">
            <span className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-green-600" /> Secure Payment</span>
            <span className="flex items-center gap-2"><Zap className="w-4 h-4 text-yellow-500" /> Instant Delivery</span>
            <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-blue-600" /> 24/7 Support</span>
         </div>
      </div>

      {/* 3. CITY SELECTION - EZ A LÉNYEG */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
            <div className="text-center mb-16 max-w-3xl mx-auto">
                <h2 className="text-blue-600 font-bold tracking-widest uppercase mb-3">Choose Your Destination</h2>
                <h3 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">Where do you want to go?</h3>
                <p className="text-slate-500 text-lg">
                    Select a city to view available skip-the-line tickets and exclusive experiences.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
                {/* PÁRIZS KÁRTYA */}
                <CityCard 
                    name="Paris" 
                    image="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1200"
                    description="The Louvre, Eiffel Tower, and Seine Cruises."
                    link="/paris"
                />
                
                {/* BARCELONA KÁRTYA */}
                <CityCard 
                    name="Barcelona" 
                    image="https://images.unsplash.com/photo-1583422409516-2895a77efded?q=80&w=1200"
                    description="Sagrada Família, Park Güell, and Casa Batlló."
                    link="/barcelona"
                />
                
                {/* PLACEHOLDERS (Hogy lásd, hogy nézne ki több várossal) */}
                 <CityCard 
                    name="Rome" 
                    image="https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=1200"
                    description="Colosseum, Vatican Museums, and St. Peter's."
                    link="/rome"
                />
                 <CityCard 
                    name="London" 
                    image="https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=1200"
                    description="London Eye, Tower of London, and Madame Tussauds."
                    link="/london"
                />
            </div>
        </div>
      </section>

      {/* 4. WHY US */}
      <WhyUs />

      {/* 5. FAQ */}
      <FAQ />

      <Footer />
    </main>
  );
}