"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Zap, Smartphone, Clock, Flame } from "lucide-react";

// Típusdefiníció: Itt kötelezővé tesszük a slug-ot!
export interface Product {
  id: string;
  slug: string; // <--- EZ A KULCS!
  image: string;
  title: string;
  location: string;
  rating: number;
  reviews: number;
  originalPrice: number;
  price: number;
  features: string[];
  isRecommended: boolean;
  duration?: string;
  badges?: string[];
  isBestSeller?: boolean;
}

export default function ProductCard({ product }: { product: Product }) {
  // BIZTONSÁGI ELLENŐRZÉS: Ha nincs slug, generáljunk egyet az ID-ból (hogy ne törjön el az oldal)
  const productSlug = product.slug || product.id; 

  return (
    <Link 
      href={`/product/${productSlug}`} 
      className="group bg-white border border-slate-200 rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full overflow-hidden relative cursor-pointer"
    >
      
      {/* KÉP */}
      <div className="relative h-56 w-full bg-slate-100">
        <Image
          src={product.image}
          alt={product.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        
        {product.isRecommended && (
          <div className="absolute top-4 left-4 bg-[#4f86f7] text-white text-[11px] font-bold px-3 py-1 rounded shadow-sm z-10">
            Highly Recommended
          </div>
        )}
        
        {product.isBestSeller && !product.isRecommended && (
           <div className="absolute top-4 left-4 bg-yellow-400 text-black text-[11px] font-bold px-3 py-1 rounded shadow-sm z-10 flex items-center gap-1">
            <Flame className="w-3 h-3 fill-red-600 text-red-600" /> POPULAR
          </div>
        )}

        <div className="absolute bottom-0 right-0 bg-[#2c3e50]/90 text-white text-xs font-medium px-3 py-1.5 rounded-tl-lg backdrop-blur-sm">
           {product.reviews} reviews
        </div>
      </div>

      {/* TARTALOM */}
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-center mb-2">
            <div className="flex items-center text-slate-500 text-[11px] font-bold uppercase tracking-wider">
               <MapPin className="w-3 h-3 mr-1" /> {product.location}
            </div>
            <div className="flex items-center gap-1 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100">
               <div className="flex text-yellow-400">
                   <Star className="w-3 h-3 fill-current" />
               </div>
               <span className="text-xs font-bold text-slate-700 ml-1">{product.rating}</span>
            </div>
        </div>

        <h3 className="text-[15px] font-bold text-slate-900 mb-3 leading-snug min-h-[40px] group-hover:text-blue-600 transition-colors">
          {product.title}
        </h3>

        <div className="mb-4">
            <p className="text-[10px] text-slate-500 mb-0.5">from</p>
            <div className="flex items-baseline gap-2">
                 <span className="text-lg font-bold text-[#e13030]">€ {product.price.toFixed(2)}</span>
                 {product.originalPrice > product.price && (
                    <span className="text-xs text-slate-400 line-through decoration-slate-400">€ {product.originalPrice.toFixed(2)}</span>
                 )}
            </div>
        </div>

        <div className="grid grid-cols-2 gap-y-2 mb-5">
            {product.duration && (
              <div className="flex items-center gap-1.5 text-[11px] text-slate-600 font-medium">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{product.duration}</span>
              </div>
            )}
            {product.features?.slice(0, 3).map((feat, i) => (
                <div key={i} className="flex items-center gap-1.5 text-[11px] text-slate-600 font-medium">
                    <Zap className="w-3.5 h-3.5 text-slate-400" />
                    <span className="whitespace-nowrap overflow-hidden text-ellipsis">{feat}</span>
                </div>
            ))}
        </div>

        <div className="mt-auto">
            <Button className="w-full bg-[#badb33] hover:bg-[#a8c928] text-slate-900 font-bold text-sm h-10 rounded shadow-sm border-b-2 border-[#9dbd2b] transition-all active:border-b-0 active:translate-y-[2px]">
                Check availability
            </Button>
        </div>

      </div>
    </Link>
  );
}