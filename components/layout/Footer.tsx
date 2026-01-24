import Link from "next/link";
import { Mail, ShieldAlert, CheckCircle2 } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0B1120] text-slate-400 py-16 border-t border-slate-800 text-sm font-sans">
      <div className="container mx-auto px-4">
        
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            
            {/* Brand */}
            <div className="space-y-6">
                {/* LOGO (Szöveges, fehér) */}
                <Link href="/" className="text-2xl font-black tracking-tighter text-white block">
                    ENTRIGO
                </Link>
                
                <p className="leading-relaxed text-slate-500 text-xs">
                    Your trusted partner for European adventures. We make booking skip-the-line tickets simple, fast, and secure.
                </p>
            </div>
            
            {/* Links */}
            <div>
                <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-xs">Destinations</h4>
                <ul className="space-y-3">
                    <li><Link href="/city/Paris" className="hover:text-white transition-colors">Paris Attractions</Link></li>
                    <li><Link href="/city/Barcelona" className="hover:text-white transition-colors">Barcelona Attractions</Link></li>
                    <li><Link href="/city/London" className="hover:text-white transition-colors">London Attractions</Link></li>
                    <li><Link href="/city/Rome" className="hover:text-white transition-colors">Rome Attractions</Link></li>
                </ul>
            </div>
            
            {/* Support */}
            <div>
                <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-xs">Customer Support</h4>
                <ul className="space-y-3">
                    <li><Link href="#" className="hover:text-white transition-colors flex items-center gap-2"><Mail className="w-3 h-3"/> Contact Us</Link></li>
                    <li><Link href="#" className="hover:text-white transition-colors">FAQ</Link></li>
                    <li><Link href="#" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
                    <li><Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                </ul>
            </div>

            {/* Payment */}
            <div>
                <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-xs">Secure Payment</h4>
                <p className="mb-4 text-xs text-slate-500">Transactions are encrypted and processed securely.</p>
                
                <div className="flex flex-wrap gap-2">
                    <div className="bg-white text-slate-900 px-2 py-1 rounded text-[10px] font-black tracking-tighter h-6 flex items-center border border-slate-300">VISA</div>
                    <div className="bg-white text-slate-900 px-2 py-1 rounded text-[10px] font-bold h-6 flex items-center border border-slate-300">Mastercard</div>
                    <div className="bg-[#635BFF] text-white px-2 py-1 rounded text-[10px] font-bold h-6 flex items-center gap-1">Stripe</div>
                </div>
                <div className="mt-4 flex items-center gap-2 text-[10px] text-green-500 font-bold">
                    <CheckCircle2 className="w-3 h-3"/> SSL Encrypted Checkout
                </div>
            </div>
        </div>

        {/* DISCLAIMER BOX */}
        <div className="border-t border-slate-800 pt-8 mt-8">
            <div className="bg-amber-950/30 p-6 rounded-xl border border-amber-900/50 shadow-inner">
                <div className="flex gap-4">
                    <ShieldAlert className="w-6 h-6 text-amber-500 shrink-0 mt-1" />
                    <div className="text-[11px] text-slate-400 leading-relaxed">
                        <strong className="text-amber-500 block mb-1 text-xs uppercase tracking-wide">Important Notice & Disclaimer</strong>
                        We are an <span className="text-slate-200 font-bold">independent ticket reseller</span> and experience provider. 
                        This website is <span className="text-white font-bold underline decoration-red-500 decoration-2 underline-offset-2">not affiliated with, sponsored by, authorized by, or operated by</span> the Louvre Museum, the Eiffel Tower/SETE, or Bateaux Parisiens. 
                        Tickets are sourced via official or authorized channels. 
                        Prices shown may include a <span className="text-slate-200 font-bold">reseller service fee</span> (e.g., for early availability, secure processing, customer support, and digital materials such as guides). 
                        Trademarks, logos, and official names remain the property of their respective owners and are used <span className="text-slate-200">for identification purposes only</span>, without any intent to imply endorsement or official status.
                    </div>
                </div>
            </div>
            
            {/* COPYRIGHT */}
            <div className="mt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-600">
                <p>&copy; {currentYear} Entrigo Tickets. All rights reserved.</p>
                <div className="mt-2 md:mt-0">
                    Made with ❤️ for Travelers.
                </div>
            </div>
        </div>
      </div>
    </footer>
  );
}