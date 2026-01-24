import { supabase } from "@/lib/supabase";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  Star, MapPin, Clock, Zap, CheckCircle2, ChevronRight, 
  Globe, Map, ShieldCheck, Info, AlertCircle, Tag 
} from "lucide-react";
import BookingWidget from "@/components/product/BookingWidget";
import ProductGallery from "@/components/product/ProductGallery";
import { Metadata, ResolvingMetadata } from 'next';

// --- TÍPUSOK ---
interface TicketType {
  name: string;
  price: number;
}

interface ProductDetail {
  id: string;
  slug: string;
  title: string;
  location: string;
  rating: number;
  reviews: number;
  price: number;
  original_price?: number;
  short_desc: string;
  full_description: string;
  important_info?: string;
  duration: string;
  languages: string[];
  inclusions: string[];
  images: string[];
  meeting_point?: string;
  map_url?: string;
  faq?: { q: string; a: string }[];
  ticket_types?: TicketType[];
  req_all_travelers?: boolean;
  time_slots?: string[]; 
  date_overrides?: Record<string, string[]>;
}

// --- SEO ---
type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const slug = (await params).slug;
  const decodedSlug = decodeURIComponent(slug);

  const { data: product } = await supabase
    .from('products')
    .select('title, short_desc, images')
    .eq('slug', decodedSlug)
    .single();

  return {
    title: product?.title ? `${product.title} | Entrigo Tickets` : 'Entrigo Experience',
    description: product?.short_desc || 'Book your tickets instantly.',
    openGraph: {
      images: product?.images?.[0] ? [product.images[0]] : [],
    },
  }
}

// --- ADAT LEKÉRÉS ---
async function getProduct(slug: string) {
    const { data } = await supabase
        .from('products')
        .select('*')
        .eq('slug', decodeURIComponent(slug))
        .single();
    return data as ProductDetail;
}

// --- FŐ KOMPONENS ---
export default async function ProductPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const product = await getProduct(params.slug);

  if (!product) return <div className="min-h-screen flex items-center justify-center">Product not found</div>;

  // Ár kalkuláció
  const hasDiscount = product.original_price && product.original_price > product.price;
  const discountPercentage = hasDiscount 
      ? Math.round(((product.original_price! - product.price) / product.original_price!) * 100) 
      : 0;

  // --- KÉP VÁLASZTÓ (FALLBACK) ---
  const contentImage1 = product.images?.[4] || product.images?.[1]; 
  const contentImage2 = product.images?.[5] || product.images?.[2] || product.images?.[0];

  // --- SZÖVEG DARABOLÁS (MOBIL OPTIMALIZÁLT) ---
  const fullText = product.full_description || "";
  let textPart1 = fullText;
  let textPart2 = "";

  // Már 100 karakternél is vágunk, hogy biztosan szétugorjon a szöveg
  if (fullText.length > 100) {
      const middleIndex = Math.floor(fullText.length / 2);
      const splitIndex = fullText.indexOf('\n', middleIndex); 
      
      // Ha nem talál sortörést, akkor keressen egy pontot (.)
      const finalSplitIndex = splitIndex !== -1 ? splitIndex : fullText.indexOf('.', middleIndex);

      if (finalSplitIndex !== -1) {
          textPart1 = fullText.slice(0, finalSplitIndex + 1); // +1 hogy a pont is benne legyen
          textPart2 = fullText.slice(finalSplitIndex + 1);
      }
  }

  return (
    <main className="min-h-screen bg-[#f8f9fa] font-sans text-slate-900 pb-28 md:pb-0">
      <Navbar />

      {/* --- MOBILE BOTTOM BAR --- */}
      <div className="fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 z-50 md:hidden shadow-[0_-5px_30px_rgba(0,0,0,0.15)] pb-6">
          <div className="flex items-center justify-between gap-3">
              <div className="flex flex-col">
                  <span className="text-[10px] text-slate-500 font-bold uppercase">From</span>
                  <div className="flex items-center gap-2">
                      {hasDiscount && (
                          <span className="text-xs text-slate-400 line-through decoration-slate-400">€{product.original_price}</span>
                      )}
                      <span className="text-xl font-black text-slate-900">€{product.price}</span>
                  </div>
              </div>
              <Link href="#booking-widget" className="flex-1">
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold h-12 rounded-xl shadow-lg shadow-green-900/20 active:scale-95 transition-all text-base">
                    Select Dates
                </Button>
              </Link>
          </div>
      </div>

      {/* HEADER SECTION - MOBILON KOMPAKTABB */}
      <div className="bg-white border-b border-slate-200 pt-24 pb-6 md:pt-32 md:pb-8">
         <div className="container mx-auto px-4">
            <div className="flex items-center gap-2 text-[10px] md:text-xs text-slate-500 uppercase font-bold tracking-wider mb-3 md:mb-4">
                <Link href="/" className="hover:text-blue-600 transition">Home</Link> 
                <ChevronRight className="w-3 h-3" />
                <Link href={`/city/${encodeURIComponent(product.location.split(',')[0].trim())}`} className="text-blue-600 hover:text-blue-800 hover:underline transition truncate max-w-[200px]">
                    {product.location}
                </Link>
            </div>
            
            {/* MOBIL OPTIMALIZÁLT CÍM (text-3xl) */}
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-3 md:mb-4 leading-tight">{product.title}</h1>
            
            <div className="flex flex-wrap items-center gap-3 md:gap-4 text-sm">
                <div className="flex items-center gap-1 text-amber-400 font-bold bg-amber-50 px-2 py-1 rounded-md border border-amber-100">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-slate-900">{product.rating}</span>
                    <span className="text-slate-400 font-normal">({product.reviews})</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-600 font-medium text-xs md:text-sm">
                    <MapPin className="w-4 h-4 text-slate-400" /> {product.location}
                </div>
            </div>
         </div>
      </div>

      {/* MAIN CONTENT - KISEBB GAP MOBILON */}
      <div className="container mx-auto px-4 py-6 md:py-8">
         <div className="flex flex-col lg:flex-row gap-8 md:gap-10">
            
            {/* BAL OLDAL */}
            <div className="lg:w-2/3 space-y-8 md:space-y-10">
                
                {/* GALÉRIA */}
                <ProductGallery images={product.images} />

                {/* HIGHLIGHTS */}
                <div className="bg-white p-5 md:p-8 rounded-2xl border border-slate-200 shadow-sm">
                    <p className="text-base md:text-xl text-slate-700 leading-relaxed mb-6 font-medium">{product.short_desc}</p>
                    <h3 className="font-bold text-slate-900 mb-4 text-sm uppercase tracking-wide flex items-center gap-2"><Zap className="w-4 h-4 text-amber-500"/> Highlights</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                        {product.inclusions?.slice(0, 6).map((inc, i) => (
                             <div key={i} className="flex items-start gap-3">
                                <div className="mt-0.5 bg-green-100 p-1 rounded-full shrink-0"><CheckCircle2 className="w-3.5 h-3.5 text-green-700" /></div>
                                <span className="text-slate-700 text-sm font-semibold leading-tight pt-0.5">{inc}</span>
                             </div>
                        ))}
                    </div>
                </div>

                {/* --- EXTRA KÉP 1 (MOBILON KISEBB: h-[200px]) --- */}
                {contentImage1 && (
                    <div className="relative w-full h-[200px] md:h-[350px] rounded-2xl overflow-hidden shadow-sm group">
                        <Image 
                            src={contentImage1} 
                            alt="Experience detail" 
                            fill 
                            className="object-cover transition-transform duration-1000 group-hover:scale-105" 
                            sizes="(max-width: 768px) 100vw, 800px" 
                        />
                    </div>
                )}

                {/* IMPORTANT INFO */}
                <div className="bg-blue-50/50 p-5 md:p-8 rounded-2xl border border-blue-100 shadow-sm">
                    <h3 className="font-bold text-slate-900 mb-4 text-sm uppercase tracking-wide flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-blue-600"/> Important Information
                    </h3>
                    <div className="space-y-3 text-sm text-slate-700 whitespace-pre-line leading-relaxed">
                        {product.important_info ? product.important_info : "Please arrive 15 minutes before your scheduled time. ID or Passport required."}
                    </div>
                </div>

                {/* INFO ICONS - MOBILON 2 OSZLOP */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                    <div className="bg-white p-3 md:p-4 rounded-xl border border-slate-200 shadow-sm">
                        <span className="text-slate-400 text-[10px] font-bold uppercase block mb-1">Duration</span>
                        <span className="text-xs md:text-sm font-bold flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-blue-600"/> {product.duration}</span>
                    </div>
                    <div className="bg-white p-3 md:p-4 rounded-xl border border-slate-200 shadow-sm">
                        <span className="text-slate-400 text-[10px] font-bold uppercase block mb-1">Mobile Ticket</span>
                        <span className="text-xs md:text-sm font-bold flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-amber-500"/> Accepted</span>
                    </div>
                    <div className="bg-white p-3 md:p-4 rounded-xl border border-slate-200 shadow-sm">
                        <span className="text-slate-400 text-[10px] font-bold uppercase block mb-1">Language</span>
                        <span className="text-xs md:text-sm font-bold flex items-center gap-1.5"><Globe className="w-3.5 h-3.5 text-indigo-500"/> {product.languages?.[0]}</span>
                    </div>
                    <div className="bg-white p-3 md:p-4 rounded-xl border border-slate-200 shadow-sm">
                        <span className="text-slate-400 text-[10px] font-bold uppercase block mb-1">Cancellation</span>
                        <span className="text-xs md:text-sm font-bold flex items-center gap-1.5 text-green-600"><ShieldCheck className="w-3.5 h-3.5"/> Flexible</span>
                    </div>
                </div>

                {/* --- FULL DESCRIPTION (DARABOLVA) --- */}
                <div className="bg-white p-5 md:p-8 rounded-2xl border border-slate-200 shadow-sm">
                    <h2 className="text-lg md:text-2xl font-bold text-slate-900 mb-4 md:mb-6">About this activity</h2>
                    
                    {/* SZÖVEG 1 */}
                    <div className="prose prose-slate max-w-none text-slate-600 leading-7 text-sm md:text-base whitespace-pre-line mb-6 md:mb-8">
                        {textPart1}
                    </div>

                    {/* SZÖVEG 2 (HA VAN) */}
                    {textPart2 && (
                        <div className="prose prose-slate max-w-none text-slate-600 leading-7 text-sm md:text-base whitespace-pre-line mb-6 md:mb-8">
                            {textPart2}
                        </div>
                    )}

                    {/* --- EXTRA KÉP 2 (ALUL, MOBILON h-[200px]) --- */}
                    {contentImage2 && (
                        <div className="relative w-full h-[200px] md:h-[350px] rounded-2xl overflow-hidden shadow-sm group mt-4">
                            <Image 
                                src={contentImage2} 
                                alt="Experience detail 2" 
                                fill 
                                className="object-cover transition-transform duration-1000 group-hover:scale-105" 
                                sizes="(max-width: 768px) 100vw, 800px" 
                            />
                        </div>
                    )}
                </div>
                 
                 {/* MAP */}
                <div className="bg-white p-5 md:p-8 rounded-2xl border border-slate-200 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2"><Map className="w-5 h-5 text-blue-600"/> Meeting Point</h3>
                    <div className="h-[250px] md:h-[300px] w-full bg-slate-100 rounded-xl overflow-hidden relative mb-4 border border-slate-200">
                            {product.map_url ? (
                                product.map_url.includes("google.com/maps/embed") ? (
                                    <iframe src={product.map_url} width="100%" height="100%" style={{border:0}} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full text-slate-400 p-4 text-center">
                                        <MapPin className="w-8 h-8 mb-2 opacity-50"/>
                                        <p className="font-bold text-xs uppercase">Invalid Map URL</p>
                                    </div>
                                )
                            ) : (<div className="flex items-center justify-center h-full text-slate-400 font-medium bg-slate-50">Map view not available</div>)}
                    </div>
                    <div className="flex items-start gap-3 bg-slate-50 p-4 rounded-xl">
                         <MapPin className="w-5 h-5 text-red-500 mt-0.5 shrink-0"/>
                         <div>
                             <p className="font-bold text-slate-900 text-sm mb-1">Directions</p>
                             <p className="text-slate-600 text-sm leading-relaxed">{product.meeting_point || "See voucher for details."}</p>
                         </div>
                    </div>
                </div>

                {/* FAQ */}
                {product.faq && product.faq.length > 0 && (
                    <div className="bg-white p-5 md:p-8 rounded-2xl border border-slate-200 shadow-sm">
                        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2"><Info className="w-5 h-5 text-blue-600"/> FAQ</h3>
                        <div className="space-y-3">
                            {product.faq.map((item, i) => (
                                <div key={i} className="border border-slate-100 rounded-xl p-4 md:p-5 bg-slate-50/50">
                                    <p className="font-bold text-slate-900 text-sm mb-2">{item.q}</p>
                                    <p className="text-slate-600 text-sm leading-relaxed">{item.a}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* JOBB OLDAL (WIDGET HELYE) */}
            <div className="lg:w-1/3 relative" id="booking-widget">
                <div className="h-full"> 
                    
                    {/* ÁR KIJELZÉS DESKTOPON */}
                    <div className="mb-4 hidden lg:block animate-in fade-in slide-in-from-bottom-2">
                        <p className="text-sm text-slate-500 font-bold uppercase mb-1">From</p>
                        <div className="flex items-center gap-3">
                            {hasDiscount && (
                                <>
                                    <span className="text-2xl text-slate-400 line-through decoration-slate-400">€{product.original_price}</span>
                                    <span className="bg-red-100 text-red-600 text-xs font-black px-2 py-1 rounded-md uppercase flex items-center gap-1">
                                        <Tag className="w-3 h-3 fill-current"/> Save {discountPercentage}%
                                    </span>
                                </>
                            )}
                            <span className="text-4xl font-black text-slate-900">€{product.price}</span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1 font-medium">per person</p>
                    </div>

                    <BookingWidget 
                        productId={product.id}
                        productTitle={product.title}
                        basePrice={product.price}
                        ticketTypes={product.ticket_types || []}
                        reqAllTravelers={product.req_all_travelers || false}
                        defaultTimeSlots={product.time_slots || []}
                        dateOverrides={product.date_overrides || {}}
                    />

                    <div className="mt-6 bg-white p-5 rounded-xl border border-slate-200 shadow-sm hidden lg:block">
                        <p className="font-bold text-sm text-slate-900 mb-3">Why book with Entrigo?</p>
                        <ul className="text-xs text-slate-500 space-y-2.5">
                            <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-green-600"/> Trusted Source</li>
                            <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-green-600"/> Instant Confirmation</li>
                            <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-green-600"/> 24/7 Support</li>
                        </ul>
                    </div>
                </div>
            </div>

         </div>
      </div>
      <Footer />
    </main>
  );
}