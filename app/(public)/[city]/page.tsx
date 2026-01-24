import { supabase } from "@/lib/supabase";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import Image from "next/image";
import { Star, MapPin, ArrowRight, ArrowLeft, Frown } from "lucide-react";

// --- ADAT LEKÉRÉS ---
async function getProductsByCity(city: string) {
  if (!city || city === "undefined") return { products: [], cityName: "Unknown City" };

  const decodedCity = decodeURIComponent(city);
  
  const { data } = await supabase
    .from('products')
    .select('id, title, slug, price, location, rating, reviews, images, is_best_seller') // Csak azt kérjük le, ami kell (gyorsabb!)
    .ilike('location', `%${decodedCity}%`) 
    .order('created_at', { ascending: false });
    
  return { products: data || [], cityName: decodedCity };
}

interface CityPageProps {
  params: Promise<{ city: string }>;
}

export default async function CityPage(props: CityPageProps) {
  const params = await props.params;
  const citySlug = params.city;
  const { products, cityName } = await getProductsByCity(citySlug);

  return (
    <main className="min-h-screen bg-[#f8f9fa] font-sans text-slate-900">
      <Navbar />

      {/* HERO SECTION */}
      <div className="relative h-[500px] md:h-[400px] flex items-center justify-center pt-28 md:pt-0">
        <div className="absolute inset-0 z-0">
          {/* OPTIMALIZÁLÁS: priority={true} -> Ezt tölti be legelőször! */}
          <Image 
            src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1200&auto=format&fit=crop" 
            alt="City Background" 
            fill 
            sizes="100vw"
            priority={true} 
            className="object-cover brightness-50"
          />
        </div>
        <div className="relative z-10 text-center px-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h1 className="text-4xl md:text-7xl font-black text-white tracking-tight capitalize mb-2 md:mb-4 drop-shadow-xl">
            {cityName}
          </h1>
          <p className="text-lg md:text-xl text-slate-100 font-medium drop-shadow-md max-w-lg mx-auto leading-relaxed">
            Find the best things to do in {cityName}
          </p>
        </div>
      </div>

      {/* BREADCRUMB */}
      <div className="container mx-auto px-4 mt-8">
          <Link href="/" className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-blue-600 mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2"/> Back to All Destinations
          </Link>
      </div>

      {/* TERMÉK LISTA */}
      <div className="container mx-auto px-4 pb-24">
        {products.length === 0 ? (
           <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-slate-200 max-w-2xl mx-auto shadow-sm">
              <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Frown className="w-8 h-8"/>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">No experiences found</h3>
              <p className="text-slate-500 text-lg mb-6">We couldn't find any activities for "{cityName}".</p>
              <Link href="/"><button className="bg-blue-600 text-white font-bold px-6 py-3 rounded-full hover:bg-blue-700 transition-all">Browse other locations</button></Link>
           </div>
        ) : (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {products.map((product) => (
                <Link key={product.id} href={`/product/${product.slug}`} className="group bg-white rounded-3xl border border-slate-200 overflow-hidden hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] transition-all duration-300 hover:-translate-y-1 flex flex-col h-full transform-gpu">
                    
                    {/* KÉP KÁRTYA */}
                    <div className="aspect-[4/3] relative bg-slate-100 overflow-hidden shrink-0">
                        {product.images?.[0] ? (
                            /* OPTIMALIZÁLÁS:
                               - sizes: Mobilon (768px alatt) 100% széles, gépen 25% (4 oszlop)
                               - quality={60}: Kisebb fájlméret, mobilon észrevehetetlen a minőségromlás
                               - loading="lazy": Csak akkor tölti le, ha odagörgetsz
                            */
                            <Image 
                                src={product.images[0]} 
                                alt={product.title} 
                                fill 
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                quality={60}
                                className="object-cover transition-transform duration-700 group-hover:scale-110" 
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full text-slate-300 font-bold uppercase">No Image</div>
                        )}
                        <div className="absolute top-4 left-4 flex gap-2">
                           {product.is_best_seller && <span className="bg-amber-400 text-slate-900 text-[10px] font-black uppercase px-2 py-1 rounded-md shadow-sm">Best Seller</span>}
                        </div>
                    </div>

                    <div className="p-5 flex flex-col flex-1">
                        <div className="flex items-center gap-1 text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide">
                            <MapPin className="w-3 h-3"/> {product.location}
                        </div>
                        <h3 className="font-bold text-slate-900 text-lg leading-snug mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                            {product.title}
                        </h3>
                        <div className="flex items-center gap-1 mb-6 mt-auto">
                            <div className="flex text-amber-400">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className={`w-3.5 h-3.5 ${i < Math.round(product.rating || 5) ? "fill-current" : "text-slate-200"}`} />
                                ))}
                            </div>
                            <span className="text-xs text-slate-400 font-medium ml-1">({product.reviews})</span>
                        </div>
                        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                             <div className="flex flex-col">
                                 <span className="text-[10px] text-slate-400 font-bold uppercase">From</span>
                                 <span className="text-xl font-black text-slate-900">€{product.price}</span>
                             </div>
                             <div className="bg-slate-50 group-hover:bg-blue-600 group-hover:text-white text-slate-400 p-2.5 rounded-xl transition-colors">
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