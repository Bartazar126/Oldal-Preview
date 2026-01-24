import { supabase } from "@/lib/supabase";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import Image from "next/image";
import { MapPin, ArrowRight, Frown, Star, Search } from "lucide-react";
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
    // Keresés címben VAGY lokációban
    supabaseQuery = supabaseQuery.or(`title.ilike.%${query}%,location.ilike.%${query}%`);
  }

  const { data: products } = await supabaseQuery;
  const displayProducts = products || [];

  return (
    <main className="min-h-screen bg-[#f8f9fa] font-sans text-slate-900">
      <Navbar />

      {/* HEADER SECTION - Finomított dizájn */}
      {/* pt-32 md:pt-44: Helyet hagyunk a Navbar-nak és a Disclaimere-nek */}
      <div className="bg-gradient-to-b from-slate-900 to-slate-800 text-white pt-32 pb-16 px-4 shadow-xl relative z-10">
          
          {/* Díszítő háttér elemek (Opcionális textúra) */}
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>

          <div className="container mx-auto text-center space-y-8 relative z-10">
              
              <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 bg-slate-800/50 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest text-blue-400 border border-slate-700/50">
                      <Search className="w-3 h-3" /> Search Results
                  </div>
                  
                  <h1 className="text-3xl md:text-5xl font-black mb-2 leading-tight">
                      {query ? <span className="text-slate-300">Results for:</span> : "All Experiences"} 
                      {query && <span className="block text-white mt-2 decoration-blue-500 underline decoration-4 underline-offset-4">"{query}"</span>}
                  </h1>
                  
                  <p className="text-slate-400 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
                      {query 
                        ? `We found ${displayProducts.length} experience${displayProducts.length !== 1 ? 's' : ''} matching your criteria.` 
                        : "Browse our complete collection of skip-the-line tickets and guided tours."}
                  </p>
              </div>

              {/* Kereső doboz */}
              <div className="max-w-xl mx-auto">
                 <HeroSearch />
              </div>
          </div>
      </div>

      {/* TERMÉK LISTA */}
      <div className="container mx-auto px-4 py-12 md:py-16">
        {displayProducts.length === 0 ? (
           
           /* NO RESULTS STATE - Barátságosabb */
           <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200 shadow-sm max-w-lg mx-auto">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Frown className="w-10 h-10 text-slate-300"/>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">No experiences found</h3>
              <p className="text-slate-500 text-sm px-8 leading-relaxed mb-6">
                  We couldn't find anything matching <strong>"{query}"</strong>. <br/> 
                  Try searching for a city like "Paris" or "Rome".
              </p>
              <Link href="/">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-colors shadow-lg shadow-blue-900/20">
                      Go back Home
                  </button>
              </Link>
           </div>

        ) : (
           
           /* RESULTS GRID - Ugyanaz a stílus mint a főoldalon */
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {displayProducts.map((product) => (
                <Link key={product.id} href={`/product/${product.slug}`} className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] transition-all duration-300 hover:-translate-y-1 flex flex-col h-full">
                    
                    {/* KÉP - Optimalizálva */}
                    <div className="aspect-[4/3] relative bg-slate-100 shrink-0 overflow-hidden">
                        {product.images?.[0] ? (
                            <Image 
                                src={product.images[0]} 
                                alt={product.title} 
                                fill 
                                className="object-cover transition-transform duration-700 group-hover:scale-110" 
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                quality={80}
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full text-slate-300 font-bold uppercase">No Image</div>
                        )}
                        
                        <div className="absolute top-3 left-3 flex gap-2">
                           {product.is_best_seller && <span className="bg-amber-400 text-slate-900 text-[10px] font-black uppercase px-2 py-1 rounded shadow-sm">Best Seller</span>}
                           {product.is_recommended && <span className="bg-blue-600 text-white text-[10px] font-black uppercase px-2 py-1 rounded shadow-sm">Top Pick</span>}
                        </div>
                    </div>

                    {/* TARTALOM */}
                    <div className="p-5 flex flex-col flex-1">
                        <div className="flex items-center gap-1 text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide">
                            <MapPin className="w-3 h-3"/> {product.location}
                        </div>
                        
                        <h3 className="font-bold text-slate-900 text-lg leading-tight mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                            {product.title}
                        </h3>

                        {/* CSILLAGOK (ÚJ!) */}
                        <div className="flex items-center gap-1 mb-4 mt-1">
                             <div className="flex text-amber-400">
                                 {[...Array(5)].map((_, i) => (
                                     <Star key={i} className={`w-3.5 h-3.5 ${i < Math.round(product.rating || 5) ? "fill-current" : "text-slate-200"}`} />
                                 ))}
                             </div>
                             <span className="text-xs text-slate-400 font-medium">({product.reviews})</span>
                        </div>
                        
                        <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
                             <div className="flex flex-col">
                                 <span className="text-[10px] text-slate-400 font-bold uppercase">From</span>
                                 <div className="flex items-center gap-2">
                                     {product.original_price && product.original_price > product.price && (
                                         <span className="text-xs text-slate-300 line-through">€{product.original_price}</span>
                                     )}
                                     <span className="text-xl font-black text-slate-900">€{product.price}</span>
                                 </div>
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