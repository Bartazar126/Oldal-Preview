import Link from "next/link";
import Image from "next/image";
import { Mail, CreditCard, Facebook, Instagram, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#0B1120] text-slate-400 py-16 border-t border-slate-800 text-sm">
      <div className="container mx-auto px-4">
        
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div className="space-y-6">
            <div className="relative h-10 w-40 opacity-90">
                <Image 
                    src="https://res.cloudinary.com/dldgqjxkn/image/upload/v1769166834/ChatGPT_Image_2026._jan._23._12_13_06_nwnf0q.png"
                    alt="Logo" fill className="object-contain object-left"
                />
            </div>
            <p className="leading-relaxed text-slate-500">
                Your trusted partner for European adventures. We make booking tickets simple, fast, and secure.
            </p>
            <div className="flex gap-4">
                <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors cursor-pointer"><Facebook className="w-4 h-4"/></div>
                <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center hover:bg-pink-600 hover:text-white transition-colors cursor-pointer"><Instagram className="w-4 h-4"/></div>
                <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center hover:bg-sky-500 hover:text-white transition-colors cursor-pointer"><Twitter className="w-4 h-4"/></div>
            </div>
            </div>
            
            {/* Links */}
            <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-xs">Destinations</h4>
            <ul className="space-y-3">
                <li><Link href="/paris" className="hover:text-white transition-colors">Paris Attractions</Link></li>
                <li><Link href="/barcelona" className="hover:text-white transition-colors">Barcelona Attractions</Link></li>
                <li><Link href="/london" className="hover:text-white transition-colors">London Attractions</Link></li>
            </ul>
            </div>
            
            {/* Support */}
            <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-xs">Customer Support</h4>
            <ul className="space-y-3">
                <li><Link href="/contact" className="hover:text-white transition-colors flex items-center gap-2"><Mail className="w-3 h-3"/> Contact Us</Link></li>
                <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            </ul>
            </div>

            {/* Payment */}
            <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-xs">Secure Payment</h4>
            <p className="mb-4 text-xs">All transactions are encrypted and 100% secure.</p>
            <div className="flex gap-2 text-slate-500">
                <div className="bg-white/10 p-2 rounded"><CreditCard className="w-6 h-6"/></div>
            </div>
            </div>
        </div>

        {/* DISCLAIMER - Fontos a Google Ads miatt */}
        <div className="border-t border-slate-800 pt-8 mt-8">
            <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
                <p className="text-[11px] text-slate-500 leading-relaxed text-center">
                    <strong>DISCLAIMER:</strong> Entrigo Tickets is a private, independent booking service and is not affiliated with, associated with, or endorsed by the Eiffel Tower, the Louvre Museum, Sagrada Família, or any other venue. We act as a third-party booking agent to provide a convenient service. The price of tickets includes a service fee.
                </p>
            </div>
            <p className="mt-8 text-xs text-slate-600 text-center">&copy; 2024 Entrigo Tickets. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}