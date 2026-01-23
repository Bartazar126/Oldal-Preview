"use client";

import { useParams, notFound } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase"; 
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductCard, { Product } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ChevronRight } from "lucide-react";

// Statikus adatok
const CITY_INFO: Record<string, { title: string; image: string; desc: string }> = {
  paris: { title: "Paris", image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2000", desc: "Experience the magic of the City of Lights." },
  barcelona: { title: "Barcelona", image: "https://images.unsplash.com/photo-1583422409516-2895a77efded?q=80&w=2000", desc: "Discover Gaudi's masterpieces." },
  rome: { title: "Rome", image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=2000", desc: "Explore the Eternal City." },
  london: { title: "London", image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=2000", desc: "Visit the London Eye and Tower Bridge." }
};

export default function CityPage() {
  const params = useParams();
  const citySlug = (params.city as string)?.toLowerCase();

  // --- 2. EZT A BLOKKOT SZÚRD BE IDE: ---
  // Ha a rendszer azt hiszi, hogy az "admin" vagy a "login" egy város, akkor STOP!
  if (citySlug === "admin" || citySlug === "login") {
    return notFound(); 
  }
  
  
  const [products, setProducts] = useState<Product[]>([]); 
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(""); // ÚJ: Hibaüzenet kiírása

  useEffect(() => {
    const fetchProducts = async () => {
      console.log("--- 1. LEKÉRDEZÉS INDÍTÁSA ---");
      console.log("Keresett város:", citySlug);
      
      try {
        if (!supabase) throw new Error("Supabase kliens nincs inicializálva!");

        // Lekérés
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .ilike('location', `%${citySlug}%`); // case-insensitive keresés

        console.log("--- 2. SUPABASE VÁLASZ ---");
        console.log("Hiba:", error);
        console.log("Adat:", data);

        if (error) throw error;

        // Adat átalakítása
        if (data) {
            const formattedData = data.map(item => ({
                id: item.id,
                slug: item.slug,
                title: item.title,
                location: item.location,
                rating: Number(item.rating),
                reviews: Number(item.reviews),
                price: Number(item.price),
                originalPrice: Number(item.original_price),
                image: item.images?.[0] || "https://placehold.co/600x400", // Fallback kép
                features: item.inclusions?.slice(0, 2) || [],
                duration: item.duration,
                isRecommended: item.is_recommended,
                isBestSeller: item.is_best_seller
            }));
            setProducts(formattedData);
        }

      } catch (err: any) {
        console.error("--- 3. KRITIKUS HIBA ---", err);
        setErrorMsg(err.message || "Ismeretlen hiba történt");
      } finally {
        // Ez MINDIG lefut, így eltűnik a Loading...
        setLoading(false);
      }
    };

    if (citySlug) {
      fetchProducts();
    } else {
        setLoading(false); // Ha nincs slug, ne homokórázzon
    }
  }, [citySlug]);

  const cityData = CITY_INFO[citySlug] || {
    title: citySlug?.charAt(0).toUpperCase() + citySlug?.slice(1) || "Destination",
    image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2000",
    desc: "Explore top rated tours and activities."
  };

  return (
    <main className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Navbar />

      <div className="relative h-[450px] w-full mt-20">
        <Image src={cityData.image} alt={cityData.title} fill className="object-cover object-center" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12">
            <h1 className="text-4xl md:text-6xl font-black text-white mb-3">Things to do in {cityData.title}</h1>
        </div>
      </div>

      <section className="py-12 px-4 container mx-auto">
         
         {/* HIBAÜZENET KIÍRÁSA A KÉPERNYŐRE */}
         {errorMsg && (
             <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
                 <strong className="font-bold">Hiba történt: </strong>
                 <span className="block sm:inline">{errorMsg}</span>
                 <p className="text-xs mt-2">Nyomj F12-t a Console megtekintéséhez.</p>
             </div>
         )}

         {loading ? (
             <div className="text-center py-20">
                 <div className="text-2xl font-bold text-slate-400 animate-pulse">Loading tickets from Supabase...</div>
             </div>
         ) : products.length > 0 ? (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {products.map((p) => (
                   <ProductCard key={p.id} product={p} />
                ))}
             </div>
         ) : (
             <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-dashed border-slate-300">
                <h3 className="text-xl font-bold text-slate-900 mb-2">No tickets found for {cityData.title}</h3>
                <p className="text-slate-500 mb-6">Database returned 0 results.</p>
                <div className="bg-slate-100 p-4 rounded text-xs text-left font-mono mb-4 max-w-md">
                    DEBUG INFO:<br/>
                    Searching for Location containing: "{citySlug}"<br/>
                    Supabase connection: {supabase ? "Active" : "Missing"}
                </div>
                <Link href="/admin">
                   <Button className="bg-blue-600 font-bold">Create Product in Admin</Button>
                </Link>
             </div>
         )}
      </section>

      <Footer />
    </main>
  );
}