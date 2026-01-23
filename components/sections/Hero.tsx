"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Calendar } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative pt-32 pb-16 lg:pt-40 lg:pb-24 bg-slate-900">
        
        {/* Háttérkép - Sötétítve, hogy a kereső kiugorjon */}
        <div className="absolute inset-0 w-full h-full">
            <Image
                src="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2000"
                alt="Travel Background"
                fill
                className="object-cover object-center opacity-40"
                priority
            />
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
            
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white mb-6 drop-shadow-md">
                Find Tickets for Your Next Adventure
            </h1>
            <p className="text-lg text-slate-200 mb-10 font-medium max-w-2xl mx-auto">
                Skip the line tickets, guided tours, and exclusive experiences in Paris & Barcelona.
            </p>

            {/* A NAGY KERESŐ WIDGET (White Box) */}
            <div className="bg-white p-2 md:p-4 rounded-xl shadow-2xl max-w-4xl mx-auto flex flex-col md:flex-row gap-2">
                
                {/* 1. Mező: Hova? */}
                <div className="flex-1 flex items-center bg-slate-50 rounded-lg px-4 h-14 border border-slate-200 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
                    <MapPin className="w-5 h-5 text-slate-400 mr-3" />
                    <input type="text" placeholder="Where are you going?" className="bg-transparent w-full h-full outline-none text-slate-900 font-medium placeholder:text-slate-500" suppressHydrationWarning />
                </div>

                {/* 2. Mező: Mikor? */}
                <div className="flex-1 flex items-center bg-slate-50 rounded-lg px-4 h-14 border border-slate-200 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
                    <Calendar className="w-5 h-5 text-slate-400 mr-3" />
                    <input type="text" placeholder="Add dates" className="bg-transparent w-full h-full outline-none text-slate-900 font-medium placeholder:text-slate-500" suppressHydrationWarning />
                </div>

                {/* Gomb */}
                <Button className="h-14 px-8 bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg rounded-lg w-full md:w-auto">
                    Search
                </Button>
            </div>
            
            <div className="mt-8 flex justify-center gap-6 text-white/80 text-sm font-semibold">
               <span>✓ Free Cancellation</span>
               <span>✓ Mobile Tickets</span>
               <span>✓ 24/7 Support</span>
            </div>
        </div>
    </section>
  );
}