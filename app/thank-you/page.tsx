"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Mail, MapPin, ArrowLeft } from "lucide-react";

export default function ThankYouPage() {
  return (
    <div className="min-h-screen relative flex items-center justify-center font-sans overflow-hidden">
      
      {/* HÁTTÉRKÉP (Louvre vagy Párizs) */}
      <div className="absolute inset-0 z-0">
        <Image 
            src="https://images.unsplash.com/photo-1478391679964-1309b79af3d3?q=80&w=2940&auto=format&fit=crop" 
            alt="Paris Background" 
            fill 
            className="object-cover"
            priority
        />
        {/* SÖTÉTKÉK OVERLAY - Hogy olvasható legyen a szöveg */}
        <div className="absolute inset-0 bg-[#0f172a]/90 mix-blend-multiply" />
        <div className="absolute inset-0 bg-blue-900/40" /> {/* Extra kék tónus */}
      </div>

      {/* TARTALOM DOBOZ */}
      <div className="relative z-10 max-w-2xl w-full mx-4 text-center text-white animate-in zoom-in duration-500">
          
          {/* LOGO HELYE */}
          <div className="mb-8 flex justify-center">
              <h1 className="text-4xl font-black tracking-tighter">ENTRIGO<span className="text-blue-400">.</span></h1>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 md:p-12 rounded-3xl shadow-2xl">
              
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/30">
                  <CheckCircle2 className="w-10 h-10 text-white" />
              </div>

              <h2 className="text-3xl md:text-5xl font-black mb-4 uppercase tracking-wide">Thank You for Your Booking!</h2>
              
              <p className="text-lg text-slate-200 mb-8 font-medium">
                  Your reservation has been successfully received. <br className="hidden md:block"/>
                  A confirmation email has just been sent to your inbox.
              </p>

              <div className="text-left bg-black/20 rounded-xl p-6 mb-8 border border-white/10">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <Mail className="w-5 h-5 text-blue-300"/> What's next?
                  </h3>
                  <ul className="space-y-4 text-slate-200 text-sm md:text-base">
                      <li className="flex items-start gap-3">
                          <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 shrink-0" />
                          <span>Check your email for your tickets and confirmation details.</span>
                      </li>
                      <li className="flex items-start gap-3">
                          <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 shrink-0" />
                          <span>Please arrive on time for your selected slot (15 mins early recommended).</span>
                      </li>
                      <li className="flex items-start gap-3">
                          <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 shrink-0" />
                          <span>Show your ticket (printed or digital) at the entrance.</span>
                      </li>
                  </ul>
              </div>

              <div className="flex flex-col gap-4">
                  <p className="font-bold text-lg flex items-center justify-center gap-2">
                      <MapPin className="w-5 h-5 text-blue-400"/> Plan your next adventure
                  </p>
                  <Link href="/">
                      <Button className="w-full h-14 bg-white text-slate-900 hover:bg-slate-100 font-black text-lg rounded-xl transition-transform active:scale-95 uppercase tracking-wider">
                          <ArrowLeft className="w-5 h-5 mr-2"/> Back to Main Page
                      </Button>
                  </Link>
              </div>

          </div>
          
          <p className="mt-8 text-xs text-slate-400 opacity-60">
              Need help? Contact support@entrigo.com
          </p>
      </div>
    </div>
  );
}