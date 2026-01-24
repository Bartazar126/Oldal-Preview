import { supabase } from "@/lib/supabase";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import Image from "next/image";
import { MapPin, ArrowRight, Frown } from "lucide-react";
import HeroSearch from "@/components/sections/HeroSearch";

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage(props: SearchPageProps) {
  const params = await props.searchParams;
  const query = params.q ? decodeURIComponent(params.q) : null;

  let supabaseQuery = supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (query && query !== "undefined") {
    supabaseQuery = supabaseQuery.or(`title.ilike.%${query}%,location.ilike.%${query}%`);
  }

  const { data: products } = await supabaseQuery;
  const displayProducts = products || [];

  return (
    <main className="min-h-screen bg-[#f8f9fa] font-sans text-slate-900">
      <Navbar />

      {/* FIX: Megnöveltük a felső paddingot (pt-44 md:pt-48).
         Így mobilon, ha a Disclaimer 3 soros is, akkor sem takarja ki a címet.
      */}
      <div className="bg-slate-900 text-white pt-44 pb-12 px-4 shadow-lg relative z-10">
          <div className="container mx-auto text-center space-y-6">
              
              {/* Címsor optimalizálás mobilra (kisebb betűméret kis kijelzőn) */}
              <div>
                  <h1 className="text-3xl md:text-5xl font-black mb-2 leading-tight">
                      {query ? <span className="text-slate-200">Results for:</span> : "All Tours & Experiences"} 
                      {query && <span className="block text-white mt-1">"{query}"</span>}
                  </h1>
                  <p className="text-slate-400 text-sm md:text-base max-w-xl mx-auto">
                      {query ? "We found these experiences matching your search." : "Browse our complete collection of skip-the-line tickets and guided tours."}
                  </p>
              </div>

              {/* Kereső doboz - Margóval elválasztva */}
              <div className="max-w-xl mx-auto pt-2">
                 <HeroSearch />
              </div>
          </div>
      </div>

      {/* TERMÉK LISTA */}
      <div className="container mx-auto px-4 py-12">
        {displayProducts.length === 0 ? (
           <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200 shadow-sm max-w-lg mx-auto">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Frown className="w-8 h-8 text-slate-400"/>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">No experiences found</h3>
              <p className="text-slate-500 text-sm px-4">
                  We couldn't find anything matching your search. <br/> Try "Paris", "Rome" or "Museum".
              </p>
           </div>
        ) : (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {displayProducts.map((product) => (
                <Link key={product.id} href={`/product/${product.slug}`} className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-[0_10px_30px_rgba(0,0,0,0.1)] transition-all duration-300 hover:-translate-y-1 flex flex-col h-full">
                    
                    {/* KÉP */}
                    <div className="aspect-[4/3] relative bg-slate-100 shrink-0">
                        {product.images?.[0] && <Image src={product.images[0]} alt={product.title} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />}
                        <div className="absolute top-3 left-3 flex gap-2">
                           {product.is_best_seller && <span className="bg-amber-400 text-slate-900 text-[10px] font-black uppercase px-2 py-1 rounded shadow-sm">Best Seller</span>}
                        </div>
                    </div>

                    {/* TARTALOM */}
                    <div className="p-5 flex flex-col flex-1">
                        <div className="flex items-center gap-1 text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide">
                            <MapPin className="w-3 h-3"/> {product.location}
                        </div>
                        <h3 className="font-bold text-slate-900 text-lg leading-tight mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                            {product.title}
                        </h3>
                        
                        <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
                             <div className="flex flex-col">
                                 <span className="text-[10px] text-slate-400 font-bold uppercase">From</span>
                                 <span className="text-xl font-black text-slate-900">€{product.price}</span>
                             </div>
                             <div className="bg-slate-50 p-2 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors text-slate-400">
                                 <ArrowRight className="w-5 h-5"/>
                             </div>
                        </div>
                    </div>
                </Link>
              ))}
           </div>
        )}
      </div>
      <Footer />
    </main>
  );
}