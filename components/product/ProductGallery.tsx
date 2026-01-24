"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X, Loader2, Maximize2 } from "lucide-react";

export default function ProductGallery({ images }: { images: string[] }) {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  const openGallery = (index: number) => {
    setCurrentImageIndex(index);
    setIsGalleryOpen(true);
    setLoading(true); // Töltés jelzése
    document.body.style.overflow = 'hidden';
  };

  const closeGallery = () => {
    setIsGalleryOpen(false);
    document.body.style.overflow = 'unset';
  };

  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setLoading(true);
    if (images) setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setLoading(true);
    if (images) setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <>
      {/* --- LIGHTBOX GALÉRIA (OPTIMALIZÁLT) --- */}
      {isGalleryOpen && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center backdrop-blur-md animate-in fade-in duration-200" onClick={closeGallery}>
            
            {/* Bezárás gomb (Nagyobb érintési felület) */}
            <button onClick={closeGallery} className="absolute top-4 right-4 md:top-6 md:right-6 text-white/70 hover:text-white p-3 rounded-full bg-black/20 hover:bg-white/10 transition-colors z-[102]">
                <X className="w-8 h-8"/>
            </button>

            {/* Lapozó gombok (Mobilon is jól nyomható) */}
            <button onClick={prevImage} className="absolute left-2 md:left-8 text-white/70 hover:text-white p-4 rounded-full hover:bg-white/10 transition-colors z-[102]">
                <ChevronLeft className="w-10 h-10"/>
            </button>
            <button onClick={nextImage} className="absolute right-2 md:right-8 text-white/70 hover:text-white p-4 rounded-full hover:bg-white/10 transition-colors z-[102]">
                <ChevronRight className="w-10 h-10"/>
            </button>

            {/* A Kép Konténer */}
            <div className="relative w-full h-full max-w-5xl max-h-[80vh] mx-4 flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                
                {/* Töltésjelző */}
                {loading && <div className="absolute inset-0 flex items-center justify-center z-0"><Loader2 className="w-10 h-10 text-white animate-spin"/></div>}

                {/* OPTIMALIZÁLT NEXT IMAGE */}
                <Image 
                    src={images[currentImageIndex]} 
                    alt={`Gallery ${currentImageIndex + 1}`}
                    fill
                    className="object-contain transition-opacity duration-300"
                    sizes="100vw" // Mobilon a képernyő szélességét tölti, nem a 4K-t
                    quality={80}  // 80% minőség elég, drasztikusan kisebb méret
                    priority={true} // Azonnal töltődjön
                    onLoadingComplete={() => setLoading(false)}
                />
                
                {/* Számláló */}
                <div className="absolute bottom-[-40px] left-0 w-full text-center text-white/60 text-sm font-bold tracking-widest">
                    {currentImageIndex + 1} / {images.length}
                </div>
            </div>
        </div>
      )}

      {/* --- GALÉRIA GRID (OPTIMALIZÁLT THUMBNAILS) --- */}
      <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-2 h-[300px] md:h-[450px] rounded-3xl overflow-hidden shadow-sm">
        
        {/* Fő kép */}
        <div className="md:col-span-2 md:row-span-2 relative bg-slate-200 group cursor-pointer" onClick={() => openGallery(0)}>
            {images?.[0] && (
                <Image 
                    src={images[0]} 
                    alt="Main" 
                    fill 
                    className="object-cover transition duration-700 group-hover:scale-105" 
                    priority 
                    sizes="(max-width: 768px) 100vw, 50vw" // Mobilon teljes szélesség, gépen fél
                    quality={60} // Thumbnailnek elég a gyengébb minőség (gyors!)
                />
            )}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
        </div>

        {/* Kicsi képek */}
        <div className="hidden md:block relative bg-slate-200 group cursor-pointer" onClick={() => openGallery(1)}>
            {images?.[1] && <Image src={images[1]} alt="1" fill className="object-cover transition duration-700 group-hover:scale-105" sizes="25vw" quality={60}/>}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
        </div>
        <div className="hidden md:block relative bg-slate-200 group cursor-pointer" onClick={() => openGallery(2)}>
            {images?.[2] && <Image src={images[2]} alt="2" fill className="object-cover transition duration-700 group-hover:scale-105" sizes="25vw" quality={60}/>}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
        </div>

        {/* View Gallery Gomb */}
        <div className="hidden md:block relative bg-slate-200 group cursor-pointer" onClick={() => openGallery(3)}>
            {images?.[3] ? (
                <Image src={images[3]} alt="3" fill className="object-cover transition duration-700 group-hover:scale-105" sizes="25vw" quality={60}/>
            ) : null}
            <div className="absolute inset-0 bg-slate-900/40 group-hover:bg-slate-900/50 transition-colors flex items-center justify-center">
                <div className="flex flex-col items-center gap-1 text-white">
                    <Maximize2 className="w-6 h-6"/>
                    <span className="text-xs font-bold uppercase tracking-wider">View Gallery</span>
                </div>
            </div>
        </div>
      </div>
    </>
  );
}