import { supabase } from "@/lib/supabase";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import Image from "next/image";
import { Star, MapPin, ArrowLeft, Frown, ArrowRight } from "lucide-react";

// --- ADAT LEKÉRÉS (OPTIMALIZÁLT) ---
async function getProductsByCity(city: string) {
  if (!city || city === "undefined") return { products: [], cityName: "Unknown City" };

  const decodedCity = decodeURIComponent(city);
  
  // CSAK A SZÜKSÉGES MEZŐKET KÉRJÜK LE!
  const { data } = await supabase
    .from('products')
    .select('id, slug, title, price, original_price, rating, reviews, location, images, is_best_seller')
    .ilike('location', `%${decodedCity}%`) 
    .order('created_at', { ascending: false });
    
  return { products: data || [], cityName: decodedCity };
}

// --- PAGE KOMPONENS ---
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
      <div className="relative h-[350px] md:h-[450px] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          {/* OPTIMALIZÁLT HERO KÉP */}
          <Image 
            src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2000&auto=format&fit=crop" 
            alt={`${cityName} Background`}
            fill 
            className="object-cover brightness-50"
            priority={true} // LCP (Largest Contentful Paint) javítása
            quality={85}
            sizes="100vw"
          />
        </div>
        <div className="relative z-10 text-center px-4 animate-in fade-in slide-in-from-bottom-4 duration-700 mt-10">
          <h1 className="text-4xl md:text-7xl font-black text-white tracking-tight capitalize mb-3 drop-shadow-xl">
            {cityName}
          </h1>
          <p className="text-lg md:text-xl text-slate-100 font-medium drop-shadow-md">
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
           
           /* EMPTY STATE */
           <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200 max-w-lg mx-auto shadow-sm">
              <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Frown className="w-8 h-8"/>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">No experiences found</h3>
              <p className="text-slate-500 text-sm mb-6 px-6">
                We couldn't find any activities for "{cityName}".
              </p>
              <Link href="/">
                  <button className="bg-blue-600 text-white font-bold px-6 py-2.5 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/20 text-sm">
                      Browse other locations
                  </button>
              </Link>
           </div>

        ) : (
           
           /* PRODUCT GRID */
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <Link key={product.id} href={`/product/${product.slug}`} className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] transition-all duration-300 hover:-translate-y-1 flex flex-col h-full">
                    
                    {/* KÉP - OPTIMALIZÁLT */}
                    <div className="aspect-[4/3] relative bg-slate-100 overflow-hidden shrink-0">
                        {product.images?.[0] ? (
                            <Image 
                                src={product.images[0]} 
                                alt={product.title} 
                                fill 
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw" // MOBILRA OPTIMALIZÁLVA
                                quality={80}
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full text-slate-300 font-bold uppercase">No Image</div>
                        )}
                        <div className="absolute top-3 left-3 flex gap-2">
                           {product.is_best_seller && <span className="bg-amber-400 text-slate-900 text-[10px] font-black uppercase px-2 py-1 rounded shadow-sm">Best Seller</span>}
                        </div>
                    </div>

                    {/* TARTALOM */}
                    <div className="p-5 flex flex-col flex-1">
                        <div className="flex items-center gap-1 text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide">
                            <MapPin className="w-3 h-3"/> {product.location}
                        </div>
                        
                        <h3 className="font-bold text-slate-900 text-lg leading-tight mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                            {product.title}
                        </h3>

                        <div className="flex items-center gap-1 mb-4 mt-1">
                            <div className="flex text-amber-400">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className={`w-3.5 h-3.5 ${i < Math.round(product.rating || 5) ? "fill-current" : "text-slate-200"}`} />
                                ))}
                            </div>
                            <span className="text-xs text-slate-400 font-medium ml-1">({product.reviews})</span>
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
                             <div className="bg-slate-50 group-hover:bg-blue-600 group-hover:text-white text-slate-400 p-2 rounded-lg transition-colors">
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