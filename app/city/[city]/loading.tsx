import Navbar from "@/components/layout/Navbar"; // Ha a layoutban van, akkor nem kell ide, de a biztonság kedvéért importálhatod, vagy csak a tartalmat vázoljuk fel.
// Mivel a loading.tsx a layouton BELÜL töltődik be, csak a tartalmat kell szimulálni.

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      {/* 1. HERO SKELETON */}
      <div className="relative h-[350px] md:h-[450px] bg-slate-200 animate-pulse w-full">
         <div className="absolute inset-0 flex items-center justify-center">
             <div className="space-y-4 text-center w-full px-4">
                 <div className="h-12 md:h-20 bg-slate-300 rounded-lg max-w-sm mx-auto"></div>
                 <div className="h-6 bg-slate-300 rounded-lg max-w-xs mx-auto"></div>
             </div>
         </div>
      </div>

      <div className="container mx-auto px-4 mt-8 pb-24">
         {/* BREADCRUMB SKELETON */}
         <div className="h-4 w-32 bg-slate-200 rounded animate-pulse mb-8"></div>

         {/* GRID SKELETON */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Generálunk 8 db üres kártyát */}
            {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl border border-slate-100 overflow-hidden h-[400px] flex flex-col">
                    {/* Kép helye */}
                    <div className="aspect-[4/3] bg-slate-200 animate-pulse relative"></div>
                    
                    {/* Tartalom helye */}
                    <div className="p-5 flex flex-col flex-1 space-y-4">
                        <div className="h-3 w-20 bg-slate-100 rounded animate-pulse"></div>
                        <div className="h-6 w-3/4 bg-slate-200 rounded animate-pulse"></div>
                        <div className="h-4 w-1/2 bg-slate-100 rounded animate-pulse"></div>
                        
                        <div className="mt-auto pt-4 border-t border-slate-50 flex justify-between items-center">
                            <div className="h-8 w-24 bg-slate-100 rounded animate-pulse"></div>
                            <div className="h-8 w-8 bg-slate-100 rounded-lg animate-pulse"></div>
                        </div>
                    </div>
                </div>
            ))}
         </div>
      </div>
    </div>
  );
}