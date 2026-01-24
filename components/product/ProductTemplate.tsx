import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { 
  Star, Map as MapIcon, Clock, Zap, CheckCircle2, ChevronRight, 
  Globe, ShieldCheck, Info, AlertCircle, Lock, CalendarCheck, Mail, Smartphone, XCircle 
} from "lucide-react";
import BookingWidget from "@/components/product/BookingWidget";
import ProductGallery from "@/components/product/ProductGallery";

export interface ProductData {
  id?: string;
  title: string;
  location: string;
  rating: number;
  reviews: number;
  price: number;
  original_price?: number;
  short_desc: string;
  full_description: string;
  good_to_know?: string;
  important_info?: string;
  duration: string;
  languages: string[];
  inclusions: string[];
  exclusions?: string[];
  images: string[];
  meeting_point?: string;
  map_url?: string;
  faq?: { q: string; a: string }[];
  ticket_types?: { name: string; price: number }[];
  req_all_travelers?: boolean;
  time_slots?: string[];
  date_overrides?: Record<string, string[]>;
}

export default function ProductTemplate({ 
  product, 
  isPreview = false, 
  viewMode = 'desktop' 
}: { 
  product: ProductData; 
  isPreview?: boolean;
  viewMode?: 'desktop' | 'mobile'; 
}) {
  
  if (!product) return null;

  const isMobile = viewMode === 'mobile';
  const hasDiscount = product.original_price && product.original_price > product.price;
  const images = product.images || [];
  const stripImage = images[2] || images[0]; 
  const extraImage = images[4] || images[1]; 
  const sidebarImage = images[5] || images[3] || images[0];

  const safeTimeSlots = Array.isArray(product.time_slots) ? product.time_slots : [];
  const safeTicketTypes = Array.isArray(product.ticket_types) ? product.ticket_types : [];
  const safeInclusions = Array.isArray(product.inclusions) ? product.inclusions : [];
  const safeExclusions = Array.isArray(product.exclusions) ? product.exclusions : [];
  const safeDateOverrides = product.date_overrides || {};
  const safeFaq = Array.isArray(product.faq) ? product.faq : [];

  return (
    <div className={`min-h-screen bg-[#f8f9fa] font-sans text-slate-900 ${isPreview ? 'pointer-events-none select-none overflow-hidden' : ''}`}>
      
      {!isPreview && <Navbar />}
      {isPreview && (
          <div className="absolute top-0 left-0 w-full bg-white h-16 border-b border-slate-200 z-10 flex items-center justify-center font-bold text-lg shadow-sm">ENTRIGO PREVIEW</div>
      )}

      {/* HEADER SECTION */}
      <div className={`bg-white border-b border-slate-200 ${isMobile ? 'pt-24 pb-6' : 'pt-28 pb-6 md:pt-36 md:pb-8'}`}>
         <div className="container mx-auto px-4">
            <div className="flex items-center gap-2 text-xs text-slate-500 uppercase font-bold tracking-wider mb-3 md:mb-4">
                <span>Home</span> <ChevronRight className="w-3 h-3" />
                <span className="text-blue-600 truncate max-w-[150px]">{product.location || "City"}</span>
            </div>
            <h1 className={`${isMobile ? 'text-2xl' : 'text-2xl md:text-5xl'} font-black text-slate-900 mb-3 leading-tight tracking-tight`}>
                {product.title || "Product Title"}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-sm">
                <div className="flex items-center gap-1 text-amber-400 font-bold bg-amber-50 px-2 py-1 rounded-md border border-amber-100 text-xs md:text-sm">
                    <Star className="w-3.5 h-3.5 fill-current" /><span className="text-slate-900">{product.rating}</span><span className="text-slate-400 font-normal">({product.reviews})</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-600 font-medium text-xs md:text-sm"><MapIcon className="w-3.5 h-3.5 text-slate-400" /> {product.location || "Location"}</div>
            </div>
         </div>
      </div>

      <div className="container mx-auto px-4 py-5 md:py-12">
         <div className={`flex flex-col gap-6 md:gap-12 items-start ${!isMobile ? 'lg:flex-row' : ''}`}>
            
            {/* --- BAL OLDAL (Content) --- */}
            <div className={`space-y-6 md:space-y-12 w-full ${!isMobile ? 'lg:w-2/3' : ''}`}>
                <ProductGallery images={images} />

                {/* HIGHLIGHTS */}
                <div className="bg-white p-5 md:p-8 rounded-2xl md:rounded-3xl border border-slate-200 shadow-sm">
                    <p className={`text-slate-900 leading-relaxed font-medium mb-6 md:mb-8 ${isMobile ? 'text-base' : 'text-base md:text-2xl'}`}>
                        {product.short_desc || "Short description goes here..."}
                    </p>
                    <div className="border-t border-slate-100 pt-5 md:pt-6">
                        <h3 className="font-bold text-slate-900 mb-4 text-xs md:text-sm uppercase tracking-wide flex items-center gap-2"><Zap className="w-4 h-4 text-amber-500"/> Highlights</h3>
                        <div className={`grid gap-3 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
                            {safeInclusions.length > 0 ? safeInclusions.slice(0, 6).map((inc, i) => (
                                <div key={i} className="flex items-start gap-3">
                                    <div className="mt-0.5 bg-green-100 p-1 rounded-full shrink-0"><CheckCircle2 className="w-3.5 h-3.5 text-green-700" /></div>
                                    <span className="text-slate-700 text-sm font-semibold pt-0.5 leading-tight">{inc}</span>
                                </div>
                            )) : <span className="text-slate-400 text-sm italic">No highlights added.</span>}
                        </div>
                    </div>
                    {/* EXCLUDED */}
                    {safeExclusions.length > 0 && (
                        <div className="border-t border-slate-100 pt-5 md:pt-6 mt-6">
                            <h3 className="font-bold mb-4 text-xs md:text-sm uppercase tracking-wide flex items-center gap-2 text-red-500">
                                <XCircle className="w-4 h-4"/> Not Included
                            </h3>
                            <div className={`grid gap-3 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
                                {safeExclusions.map((exc, i) => (
                                    <div key={i} className="flex items-start gap-3 opacity-70">
                                        <div className="mt-0.5 bg-red-50 p-1 rounded-full shrink-0"><XCircle className="w-3.5 h-3.5 text-red-400" /></div>
                                        <span className="text-slate-600 text-sm font-medium pt-0.5 leading-tight">{exc}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* KÉP SÁV */}
                <div className="relative w-full h-28 md:h-48 rounded-2xl md:rounded-3xl overflow-hidden border border-slate-200 bg-slate-100">
                    {stripImage && <Image src={stripImage} alt="Decorative" fill className="object-cover" sizes="100vw" quality={50} />}
                    <div className="absolute inset-0 bg-white/85 flex items-center justify-center">
                        <p className="text-slate-400 font-bold uppercase tracking-[0.2em] md:tracking-[0.3em] text-[10px] md:text-sm">Experience • Discover • Enjoy</p>
                    </div>
                </div>

                {/* THE EXPERIENCE */}
                <div>
                    <h2 className={`${isMobile ? 'text-lg' : 'text-lg md:text-3xl'} font-black text-slate-900 mb-3 md:mb-4`}>The Experience</h2>
                    <div className="bg-white p-5 md:p-8 rounded-2xl md:rounded-3xl border border-slate-200 shadow-sm">
                        <div className="prose prose-slate prose-sm md:prose-lg max-w-none text-slate-600 leading-relaxed whitespace-pre-line">
                            {product.full_description || "Full description will appear here..."}
                        </div>
                    </div>
                </div>

                {/* EXTRA KÉP */}
                {extraImage && (
                    <div className="relative w-full h-48 md:h-[400px] rounded-2xl md:rounded-3xl overflow-hidden shadow-sm group bg-slate-100">
                        <Image src={extraImage} alt="Detail" fill className="object-cover" sizes="(max-width: 768px) 100vw, 800px" quality={70} />
                    </div>
                )}

                {/* ICONS GRID */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                     <div className="bg-white p-3 md:p-4 rounded-xl md:rounded-2xl border border-slate-200 shadow-sm">
                        <span className="text-slate-400 text-[10px] font-bold uppercase block mb-1">Duration</span>
                        <span className="text-xs md:text-sm font-bold flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-blue-600"/> {product.duration || "-"}</span>
                    </div>
                    <div className="bg-white p-3 md:p-4 rounded-xl md:rounded-2xl border border-slate-200 shadow-sm">
                        <span className="text-slate-400 text-[10px] font-bold uppercase block mb-1">Mobile Ticket</span>
                        <span className="text-xs md:text-sm font-bold flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-amber-500"/> Accepted</span>
                    </div>
                    <div className="bg-white p-3 md:p-4 rounded-xl md:rounded-2xl border border-slate-200 shadow-sm">
                        <span className="text-slate-400 text-[10px] font-bold uppercase block mb-1">Language</span>
                        <span className="text-xs md:text-sm font-bold flex items-center gap-1.5"><Globe className="w-3.5 h-3.5 text-indigo-500"/> {product.languages?.[0] || "English"}</span>
                    </div>
                    <div className="bg-white p-3 md:p-4 rounded-xl md:rounded-2xl border border-slate-200 shadow-sm">
                        <span className="text-slate-400 text-[10px] font-bold uppercase block mb-1">Cancellation</span>
                        <span className="text-xs md:text-sm font-bold flex items-center gap-1.5 text-green-600"><ShieldCheck className="w-3.5 h-3.5"/> Flexible</span>
                    </div>
                </div>
                 
                 {/* MAP */}
                <div className="bg-white p-5 md:p-8 rounded-2xl md:rounded-3xl border border-slate-200 shadow-sm">
                    <h3 className={`${isMobile ? 'text-lg' : 'text-lg md:text-xl'} font-bold text-slate-900 mb-4 flex items-center gap-2`}><MapIcon className="w-5 h-5 text-blue-600"/> Meeting Point</h3>
                    <div className="h-64 md:h-[400px] w-full bg-slate-100 rounded-xl md:rounded-2xl overflow-hidden relative mb-4 border border-slate-200 shadow-inner">
                            {product.map_url ? (
                                product.map_url.includes("http") ? (
                                    <iframe src={product.map_url} width="100%" height="100%" style={{border:0}} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full text-slate-400 p-4 text-center"><MapIcon className="w-8 h-8 mb-2 opacity-50"/><p className="font-bold text-xs uppercase">Invalid Map URL</p></div>
                                )
                            ) : (<div className="flex items-center justify-center h-full text-slate-400 font-medium bg-slate-50">Map view not available</div>)}
                    </div>
                    <div className="flex items-start gap-3 bg-slate-50 p-4 rounded-xl md:rounded-2xl">
                         <MapIcon className="w-5 h-5 text-red-500 mt-0.5 shrink-0"/>
                         <div><p className="font-bold text-slate-900 text-sm mb-1">Directions</p><p className="text-slate-600 text-xs md:text-sm leading-relaxed">{product.meeting_point || "See voucher for details."}</p></div>
                    </div>
                </div>

                {/* FAQ */}
                {safeFaq.length > 0 && (
                    <div className="bg-white p-5 md:p-8 rounded-2xl md:rounded-3xl border border-slate-200 shadow-sm">
                        <h3 className={`${isMobile ? 'text-lg' : 'text-lg md:text-xl'} font-bold text-slate-900 mb-4 flex items-center gap-2`}><Info className="w-5 h-5 text-blue-600"/> FAQ</h3>
                        <div className="space-y-3 md:space-y-4">
                            {safeFaq.map((item, i) => (
                                <div key={i} className="border border-slate-100 rounded-xl md:rounded-2xl p-4 bg-slate-50/50">
                                    <p className="font-bold text-slate-900 text-sm md:text-base mb-1">{item.q}</p>
                                    <p className="text-slate-600 text-xs md:text-sm leading-relaxed">{item.a}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* REVIEWS */}
                <div className="bg-white p-5 md:p-8 rounded-2xl md:rounded-3xl border border-slate-200 shadow-sm">
                    <h3 className={`${isMobile ? 'text-lg' : 'text-lg md:text-xl'} font-bold text-slate-900 mb-6 flex items-center gap-2`}><Star className="w-5 h-5 text-amber-400 fill-current"/> Reviews</h3>
                    <div className="flex flex-col md:flex-row items-center gap-6 md:gap-12">
                        <div className="text-center">
                            <span className="text-5xl font-black text-slate-900 block">{product.rating}</span>
                            <div className="flex text-amber-400 justify-center my-2 gap-1"><Star className="w-4 h-4 fill-current"/><Star className="w-4 h-4 fill-current"/><Star className="w-4 h-4 fill-current"/><Star className="w-4 h-4 fill-current"/><Star className="w-4 h-4 fill-current"/></div>
                            <span className="text-xs font-bold text-slate-500 uppercase">{product.reviews} verified</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- JOBB OLDAL (Sidebar) --- */}
            <div className={`space-y-6 md:space-y-8 w-full h-fit ${!isMobile ? 'lg:w-1/3' : ''}`}>
                
                {/* WIDGET */}
                <div> 
                    <div className="mb-4 hidden lg:block">
                        <p className="text-sm text-slate-500 font-bold uppercase mb-1">From</p>
                        <div className="flex items-center gap-3">
                            {hasDiscount && <span className="text-2xl text-slate-400 line-through">€{product.original_price}</span>}
                            <span className="text-4xl font-black text-slate-900">€{product.price || 0}</span>
                        </div>
                    </div>
                    <BookingWidget 
                        productId={product.id || "preview"} 
                        productTitle={product.title} 
                        basePrice={product.price || 0}
                        ticketTypes={safeTicketTypes} 
                        reqAllTravelers={product.req_all_travelers || false}
                        defaultTimeSlots={safeTimeSlots} 
                        dateOverrides={safeDateOverrides} 
                    />
                </div>

                {/* SIDEBAR KÉP */}
                {sidebarImage && (
                    <div className="relative w-full h-40 md:h-64 rounded-2xl md:rounded-3xl overflow-hidden shadow-sm group bg-slate-100">
                         <Image src={sidebarImage} alt="Detail" fill className="object-cover" sizes="(max-width: 768px) 100vw, 400px" quality={70} />
                    </div>
                )}

                {/* GOOD TO KNOW - ITT KELL LENNIE */}
                {product.good_to_know && (
                    <div className="bg-white p-5 md:p-6 rounded-2xl md:rounded-3xl border border-slate-200 shadow-sm">
                        <h3 className="font-bold text-slate-900 text-lg mb-3 md:mb-4">Good to know</h3>
                        <div className="prose prose-slate prose-sm max-w-none text-slate-600 leading-relaxed whitespace-pre-line">{product.good_to_know}</div>
                    </div>
                )}

                {/* IMPORTANT INFO */}
                {product.important_info && (
                    <div className="bg-blue-50 p-5 md:p-6 rounded-2xl md:rounded-3xl border border-blue-100 shadow-sm">
                         <h3 className="font-bold text-slate-900 mb-3 md:mb-4 text-sm uppercase tracking-wide flex items-center gap-2"><AlertCircle className="w-4 h-4 text-blue-600"/> Important Info</h3>
                         <div className="text-sm text-slate-700 whitespace-pre-line leading-relaxed">{product.important_info}</div>
                    </div>
                )}

                {/* HOW IT WORKS */}
                <div className="space-y-4">
                    <h3 className="font-bold text-slate-900 text-lg px-2">How does it work?</h3>
                    <div className="bg-white p-5 md:p-6 rounded-2xl md:rounded-3xl border border-slate-200 shadow-sm space-y-4 md:space-y-5">
                        <div className="flex gap-4">
                            <div className="w-9 h-9 md:w-10 md:h-10 bg-blue-100 rounded-full flex items-center justify-center shrink-0"><CalendarCheck className="w-4 h-4 md:w-5 md:h-5 text-blue-600"/></div>
                            <div><p className="font-bold text-slate-900 text-sm mb-0.5">Book online</p><p className="text-xs text-slate-500">Select date & time.</p></div>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-9 h-9 md:w-10 md:h-10 bg-blue-100 rounded-full flex items-center justify-center shrink-0"><Mail className="w-4 h-4 md:w-5 md:h-5 text-blue-600"/></div>
                            <div><p className="font-bold text-slate-900 text-sm mb-0.5">Receive tickets</p><p className="text-xs text-slate-500">Sent to email.</p></div>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-9 h-9 md:w-10 md:h-10 bg-blue-100 rounded-full flex items-center justify-center shrink-0"><Smartphone className="w-4 h-4 md:w-5 md:h-5 text-blue-600"/></div>
                            <div><p className="font-bold text-slate-900 text-sm mb-0.5">Show on phone</p><p className="text-xs text-slate-500">No printing.</p></div>
                        </div>
                    </div>
                </div>

                 {/* SECURE PAYMENT */}
                 <div className={`bg-white p-5 md:p-6 rounded-2xl md:rounded-3xl border border-slate-200 shadow-sm text-center ${isMobile ? 'hidden' : 'hidden lg:block'}`}>
                    <p className="font-bold text-xs text-slate-400 uppercase mb-4 flex items-center justify-center gap-1.5"><Lock className="w-3.5 h-3.5"/> Secure Payment</p>
                    <div className="flex justify-center gap-3 opacity-60 grayscale hover:grayscale-0 transition-all duration-300">
                         <div className="h-8 w-12 bg-slate-100 rounded-lg flex items-center justify-center border border-slate-200"><span className="text-[10px] font-bold">VISA</span></div>
                         <div className="h-8 w-12 bg-slate-100 rounded-lg flex items-center justify-center border border-slate-200"><span className="text-[10px] font-bold">MC</span></div>
                         <div className="h-8 w-12 bg-slate-100 rounded-lg flex items-center justify-center border border-slate-200"><span className="text-[10px] font-bold">AMEX</span></div>
                    </div>
                 </div>
            </div>
         </div>
      </div>
      
      {!isPreview && <Footer />}
    </div>
  );
}