"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, ShoppingBag, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full z-50 flex flex-col font-sans">
      
      {/* --- KREATÍV DISCLAIMER BAR (KOMPAKT MOBIL VERZIÓ) --- */}
      <div className="bg-slate-900 text-white relative overflow-hidden">
          <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-blue-500 via-amber-500 to-blue-500 opacity-70"></div>
          
          {/* JAVÍTÁS: py-1.5 mobilon (kisebb térköz), items-start hogy a szöveg jól tördelődjön */}
          <div className="container mx-auto px-3 py-2 md:py-2.5 flex items-start md:items-center justify-center gap-2 md:gap-3 text-[9px] md:text-xs leading-tight md:leading-relaxed">
              
              {/* IKON - Mobilon csak az ikon marad, a keret nem kell, hogy helyet spóroljunk */}
              <div className="shrink-0 mt-0.5 md:mt-0 md:bg-white/10 md:px-2 md:py-0.5 md:rounded md:border md:border-white/10 md:backdrop-blur-sm flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                  <span className="hidden md:inline font-bold text-amber-400 uppercase tracking-wider">Disclaimer</span>
              </div>

              {/* SZÖVEG - Kicsit tömörebb mobilon */}
              <p className="opacity-90 max-w-4xl text-left md:text-center">
                  <span className="font-bold text-white">Independent Reseller:</span> We are <span className="font-bold underline decoration-amber-500/50">not affiliated</span> with the Louvre or Eiffel Tower. 
                  Official tickets. Prices incl. <span className="font-bold text-amber-200">service fee</span>.
              </p>
          </div>
      </div>

      {/* --- NORMAL NAVBAR --- */}
      <nav className={`w-full transition-all duration-300 border-b ${scrolled ? "bg-white/95 backdrop-blur-md border-slate-200 shadow-sm py-2" : "bg-white border-transparent py-3 md:py-4"}`}>
        <div className="container mx-auto px-4 flex justify-between items-center">
          
          {/* LOGO */}
          <Link href="/" className="text-xl md:text-2xl font-black tracking-tighter text-slate-900 flex items-center gap-1 group z-50">
            ENTRIGO<span className="text-blue-600 group-hover:animate-bounce">.</span>
          </Link>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors">Destinations</Link>
            <Link href="/search" className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors">Tours</Link>
            <Link href="#" className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors">Help</Link>
            <div className="h-4 w-px bg-slate-300 mx-2"></div>
            <Link href="/login"><Button variant="ghost" className="font-bold text-slate-900 hover:bg-slate-100">Sign In</Button></Link>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl px-6 shadow-lg shadow-blue-600/20 transition-transform active:scale-95">
                <ShoppingBag className="w-4 h-4 mr-2"/> My Tickets
            </Button>
          </div>

          {/* MOBILE MENU BUTTON */}
          <button className="md:hidden text-slate-900 p-1" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* MOBILE DROPDOWN */}
        {isOpen && (
          <div className="md:hidden bg-white border-t border-slate-100 absolute top-full left-0 w-full shadow-2xl p-4 flex flex-col gap-2 animate-in slide-in-from-top-2 z-40">
            <Link href="/" onClick={() => setIsOpen(false)} className="p-3 rounded-lg hover:bg-slate-50 font-bold text-slate-800">Destinations</Link>
            <Link href="/search" onClick={() => setIsOpen(false)} className="p-3 rounded-lg hover:bg-slate-50 font-bold text-slate-800">All Tours</Link>
            <Link href="/login" onClick={() => setIsOpen(false)} className="p-3 rounded-lg hover:bg-slate-50 font-bold text-slate-800">Sign In</Link>
          </div>
        )}
      </nav>
    </div>
  );
}