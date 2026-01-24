import { supabase } from "@/lib/supabase";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import Image from "next/image";
import { Star, MapPin, ArrowRight, Search, ShieldCheck, Zap, Clock } from "lucide-react";
import HeroSearch from "@/components/sections/HeroSearch";

// Termékek lekérése a "Trending" szekcióhoz
async function getProducts() {
  const { data } = await supabase
    .from('products')
    .select('*')
    .limit(8)
    .order('created_at', { ascending: false });
  return data || [];
}

// Statikus városlista (ezek a kiemelt úti célok)
const destinations = [
    { name: "Paris", image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=800&auto=format&fit=crop", desc: "The Louvre, Eiffel Tower" },
    { name: "Rome", image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=800&auto=format&fit=crop", desc: "Colosseum, Vatican" },
    { name: "London", image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=800&auto=format&fit=crop", desc: "London Eye, Tower of London" },
    { name: "Barcelona", image: "https://images.unsplash.com/photo-1583422409516-2895a77efded?q=80&w=800&auto=format&fit=crop", desc: "Sagrada Família, Park Güell" },
];

export default async function Home() {
  const products = await getProducts();

  return (
    <main className="min-h-screen bg-[#f8f9fa] font-sans text-slate-900">
      <Navbar />

      {/* 1. HERO SECTION (Keresővel) */}
      <div className="relative h-[600px] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2000&auto=format&fit=crop" 
            alt="Hero" 
            fill 
            className="object-cover brightness-50"
            priority
          />
        </div>

        <div className="relative z-10 text-center w-full space-y-8 mt-10">
          <h1 className="text-4xl md:text-7xl font-black text-white tracking-tight drop-shadow-xl px-4">
            Unforgettable<br/>Experiences
          </h1>
          <p className="text-lg md:text-xl text-slate-100 font-medium drop-shadow-md px-4">
            Book museum tickets, city tours, and day trips worldwide.
          </p>
          
          {/* INTERAKTÍV KERESŐ */}
          <HeroSearch />
        </div>
      </div>

      {/* 2. TRUST BAR */}
      <div className="bg-white border-b border-slate-200 py-4 shadow-sm relative z-20">
         <div className="container mx-auto flex justify-center gap-4 md:gap-12 text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest text-center">
            <span className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-green-600" /> Secure Payment</span>
            <span className="flex items-center gap-2"><Zap className="w-4 h-4 text-yellow-500" /> Instant Delivery</span>
            <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-blue-600" /> 24/7 Support</span>
         </div>
      </div>

      {/* 3. DESTINATIONS (Városválasztó) */}
      <section className="py-16 px-4">
          <div className="container mx-auto">
              <div className="text-center mb-12">
                  <h2 className="text-blue-600 font-bold tracking-widest uppercase mb-2">Choose Your Destination</h2>
                  <h3 className="text-3xl md:text-4xl font-black text-slate-900">Where do you want to go?</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {destinations.map((city) => (
                      <Link key={city.name} href={`/city/${city.name}`} className="group relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                          <Image 
                              src={city.image} 
                              alt={city.name} 
                              fill 
                              className="object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80" />
                          <div className="absolute bottom-0 left-0 p-6 w-full">
                              <h3 className="text-white text-2xl font-black tracking-tight">{city.name}</h3>
                              <p className="text-slate-300 text-sm mt-1 opacity-90">{city.desc}</p>
                              <div className="mt-4 flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0">
                                  View Activities <ArrowRight className="w-3 h-3"/>
                              </div>
                          </div>
                      </Link>
                  ))}
              </div>
          </div>
      </section>

      {/* 4. TRENDING PRODUCTS (Supabase-ből) */}
      <section className="bg-white py-16 border-t border-slate-200">
        <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl md:text-3xl font-black text-slate-900">Trending Experiences</h2>
                <Link href="/search" className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                    View all <ArrowRight className="w-4 h-4"/>
                </Link>
            </div>

            {products.length === 0 ? (
                <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <p className="text-slate-400">No experiences added yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <Link key={product.id} href={`/product/${product.slug}`} className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] transition-all duration-300 hover:-translate-y-1">
                            
                            {/* Kép */}
                            <div className="aspect-[4/3] relative bg-slate-100 overflow-hidden">
                                {product.images?.[0] ? (
                                    <Image 
                                        src={product.images[0]} 
                                        alt={product.title} 
                                        fill 
                                        className="object-cover transition-transform duration-700 group-hover:scale-110" 
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-slate-300 font-bold uppercase">No Image</div>
                                )}
                                
                                <div className="absolute top-3 left-3 flex gap-2">
                                    {product.is_best_seller && <span className="bg-amber-400 text-slate-900 text-[10px] font-black uppercase px-2 py-1 rounded shadow-sm">Best Seller</span>}
                                    {product.is_recommended && <span className="bg-blue-600 text-white text-[10px] font-black uppercase px-2 py-1 rounded shadow-sm">Top Pick</span>}
                                </div>
                            </div>

                            {/* Tartalom */}
                            <div className="p-5">
                                <div className="flex items-center gap-1 text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide">
                                    <MapPin className="w-3 h-3"/> {product.location}
                                </div>
                                
                                <h3 className="font-bold text-slate-900 text-lg leading-tight mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                                    {product.title}
                                </h3>

                                <div className="flex items-center gap-1 mb-4">
                                    <div className="flex text-amber-400">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className={`w-3.5 h-3.5 ${i < Math.round(product.rating || 5) ? "fill-current" : "text-slate-200"}`} />
                                        ))}
                                    </div>
                                    <span className="text-xs text-slate-400 font-medium">({product.reviews} reviews)</span>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-slate-400 font-bold uppercase">From</span>
                                        <span className="text-lg font-black text-slate-900">€{product.price}</span>
                                    </div>
                                    <button className="bg-slate-50 group-hover:bg-blue-600 group-hover:text-white text-slate-400 p-2 rounded-lg transition-colors">
                                        <ArrowRight className="w-5 h-5"/>
                                    </button>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
      </section>
      
      <Footer />
    </main>
  );
}