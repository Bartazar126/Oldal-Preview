"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export default function ProductGallery({ images }: { images: string[] }) {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const openGallery = (index: number) => {
    setCurrentImageIndex(index);
    setIsGalleryOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeGallery = () => {
    setIsGalleryOpen(false);
    document.body.style.overflow = 'unset';
  };

  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (images) setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (images) setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <>
      {/* --- LIGHTBOX GALÉRIA --- */}
      {isGalleryOpen && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center backdrop-blur-sm animate-in fade-in duration-200" onClick={closeGallery}>
            <button onClick={closeGallery} className="absolute top-6 right-6 text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors z-[101]"><X className="w-8 h-8"/></button>
            <button onClick={prevImage} className="absolute left-4 md:left-8 text-white/70 hover:text-white p-3 rounded-full hover:bg-white/10 transition-colors z-[101]"><ChevronLeft className="w-10 h-10"/></button>
            <button onClick={nextImage} className="absolute right-4 md:right-8 text-white/70 hover:text-white p-3 rounded-full hover:bg-white/10 transition-colors z-[101]"><ChevronRight className="w-10 h-10"/></button>
            <div className="relative w-full h-full max-w-5xl max-h-[80vh] mx-4" onClick={(e) => e.stopPropagation()}>
                <Image src={images[currentImageIndex]} alt="Gallery" fill className="object-contain" priority />
            </div>
        </div>
      )}

      {/* --- GALÉRIA GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-2 h-[300px] md:h-[450px] rounded-2xl overflow-hidden shadow-sm">
        <div className="md:col-span-2 md:row-span-2 relative bg-slate-200 group cursor-pointer" onClick={() => openGallery(0)}>
            {images?.[0] && <Image src={images[0]} alt="Main" fill className="object-cover transition duration-700 group-hover:scale-105" priority sizes="(max-width: 768px) 100vw, 50vw"/>}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
        </div>
        <div className="hidden md:block relative bg-slate-200 group cursor-pointer" onClick={() => openGallery(1)}>
            {images?.[1] && <Image src={images[1]} alt="1" fill className="object-cover transition duration-700 group-hover:scale-105" sizes="25vw"/>}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
        </div>
        <div className="hidden md:block relative bg-slate-200 group cursor-pointer" onClick={() => openGallery(2)}>
            {images?.[2] && <Image src={images[2]} alt="2" fill className="object-cover transition duration-700 group-hover:scale-105" sizes="25vw"/>}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
        </div>
        <div className="hidden md:block relative bg-slate-200 group cursor-pointer" onClick={() => openGallery(3)}>
            {images?.[3] ? (
                <Image src={images[3]} alt="3" fill className="object-cover transition duration-700 group-hover:scale-105" sizes="25vw"/>
            ) : null}
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                <div className="bg-white/20 backdrop-blur-md border border-white/30 px-4 py-2 rounded-full text-white text-xs font-bold uppercase tracking-wider hover:bg-white hover:text-slate-900 transition-all">
                    View Gallery
                </div>
            </div>
        </div>
      </div>
    </>
  );
}