"use client";

import Link from "next/link";
import Image from "next/image";
import { Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={cn(
      "fixed top-0 w-full z-50 transition-all duration-300 border-b",
      scrolled 
        ? "bg-white/95 backdrop-blur-md border-slate-200 shadow-sm py-2" 
        : "bg-white border-transparent py-4"
    )}>
      <div className="container mx-auto px-4 flex items-center justify-between">
        
        {/* LOGO */}
        <Link href="/" className="relative h-12 w-48 flex-shrink-0 hover:opacity-90 transition-opacity">
          <Image 
            src="https://res.cloudinary.com/dldgqjxkn/image/upload/v1769166834/ChatGPT_Image_2026._jan._23._12_13_06_nwnf0q.png"
            alt="Entrigo Tickets"
            fill
            className="object-contain object-left"
            priority
          />
        </Link>

        {/* Links - Középen */}
        <div className="hidden lg:flex items-center gap-10">
           <Link href="/paris" className="font-bold text-slate-700 hover:text-blue-600 uppercase text-sm tracking-wide transition-colors">Paris</Link>
           <Link href="/barcelona" className="font-bold text-slate-700 hover:text-blue-600 uppercase text-sm tracking-wide transition-colors">Barcelona</Link>
           <Link href="#why-us" className="font-bold text-slate-700 hover:text-blue-600 uppercase text-sm tracking-wide transition-colors">Why Us</Link>
           <Link href="#faq" className="font-bold text-slate-700 hover:text-blue-600 uppercase text-sm tracking-wide transition-colors">Help</Link>
        </div>

        {/* Action Right - BOOK YOUR TICKETS */}
        <div className="flex items-center gap-4">
           {/* "Manage Booking" link, ha már vásároltak */}
           <Link href="/manage" className="hidden md:flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-800 uppercase">
              My Bookings
           </Link>

           <Button className="bg-blue-600 hover:bg-blue-700 text-white font-black px-8 h-12 rounded-lg shadow-lg hover:shadow-blue-600/20 transition-all active:scale-95 uppercase tracking-wide">
              <Ticket className="w-5 h-5 mr-2" /> Book Your Tickets
           </Button>
        </div>
      </div>
    </nav>
  );
}