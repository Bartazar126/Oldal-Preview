"use client";

import { ShieldCheck, Zap, Smartphone, Headphones } from "lucide-react";
import { motion } from "framer-motion";

export default function WhyUs() {
  const features = [
    {
      icon: <Zap className="w-8 h-8 text-yellow-500" />,
      title: "Skip The Line",
      desc: "Don't waste your holiday waiting. Get priority access to sold-out venues."
    },
    {
      icon: <Smartphone className="w-8 h-8 text-blue-500" />,
      title: "Mobile Tickets",
      desc: "Instant delivery to your phone. No printing required, just scan and go."
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-green-500" />,
      title: "Secure Booking",
      desc: "Authorized independent reseller. 100% valid tickets guaranteed."
    },
    {
      icon: <Headphones className="w-8 h-8 text-purple-500" />,
      title: "24/7 Support",
      desc: "Real human support to help you before, during, and after your trip."
    }
  ];

  return (
    <section id="why-us" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
           <h2 className="text-blue-600 font-bold tracking-widest uppercase mb-3">The Entrigo Difference</h2>
           <h3 className="text-3xl md:text-4xl font-black text-slate-900">Why travelers choose us?</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
           {features.map((f, i) => (
             <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-xl hover:bg-white transition-all duration-300 group"
             >
                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                   {f.icon}
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-3">{f.title}</h4>
                <p className="text-slate-600 leading-relaxed text-sm">
                   {f.desc}
                </p>
             </motion.div>
           ))}
        </div>
      </div>
    </section>
  );
}