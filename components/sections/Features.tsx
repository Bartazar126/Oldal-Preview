import { ShieldCheck, Zap, Clock, Globe } from "lucide-react";

export default function Features() {
  return (
    <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
           <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl font-black text-slate-900 mb-4">Why book with us?</h2>
              <p className="text-slate-600 text-lg">We simplify the chaos of travel. Secure your spot in seconds, not hours.</p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { icon: <Clock className="w-8 h-8 text-blue-600" />, title: "Skip the Line", desc: "Priority access to save you hours of waiting." },
                { icon: <Zap className="w-8 h-8 text-blue-600" />, title: "Instant Delivery", desc: "Digital tickets sent to your phone immediately." },
                { icon: <ShieldCheck className="w-8 h-8 text-blue-600" />, title: "Secure Payment", desc: "Bank-level encryption for all transactions." },
                { icon: <Globe className="w-8 h-8 text-blue-600" />, title: "Trusted Agency", desc: "Helping 50,000+ travelers every year." }
              ].map((item, i) => (
                <div key={i} className="bg-slate-50 p-8 rounded-[2rem] hover:bg-blue-50 transition-colors text-center md:text-left">
                   <div className="bg-white w-16 h-16 rounded-2xl flex items-center justify-center mb-6 mx-auto md:mx-0 shadow-sm">
                      {item.icon}
                   </div>
                   <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                   <p className="text-slate-600 leading-relaxed text-sm">{item.desc}</p>
                </div>
              ))}
           </div>
        </div>
    </section>
  );
}