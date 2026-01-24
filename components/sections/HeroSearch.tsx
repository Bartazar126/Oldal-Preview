"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Ticket, Loader2, X } from "lucide-react";
import { supabase } from "@/lib/supabase";

// Típus a találatoknak
type SearchResult = {
  id: string;
  title: string;
  slug: string;
  location: string;
  type: "city" | "product"; // Mi döntjük el, hogy város vagy termék találat
};

export default function HeroSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // --- KLIKK A DOBOZON KÍVÜL (Bezárja a listát) ---
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- KERESÉS LOGIKA (DEBOUNCE) ---
  useEffect(() => {
    // Csak akkor keresünk, ha van legalább 2 karakter
    if (query.length < 2) {
      setResults([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsLoading(true);
      setShowDropdown(true);

      // Keresés a Supabase-ben (Címben VAGY Helyszínben)
      const { data } = await supabase
        .from('products')
        .select('id, title, slug, location')
        .or(`title.ilike.%${query}%,location.ilike.%${query}%`)
        .limit(6); // Max 6 találat

      if (data) {
        // Feldolgozzuk az adatokat: Szétválogatjuk városra és termékre
        const formattedResults: SearchResult[] = [];
        const addedCities = new Set(); // Hogy ne legyen duplikált város (pl. 5db Paris product)

        data.forEach(item => {
          // 1. Ha a HELYSZÍN illeszkedik a keresésre -> Város találat
          if (item.location.toLowerCase().includes(query.toLowerCase())) {
             // A "Paris, France"-ból kivesszük csak a várost ("Paris")
             const cityName = item.location.split(',')[0].trim();
             
             if (!addedCities.has(cityName)) {
                 formattedResults.push({
                     id: `city-${cityName}`,
                     title: cityName,
                     slug: cityName, // Városnál a slug maga a név
                     location: "Destination",
                     type: "city"
                 });
                 addedCities.add(cityName);
             }
          }

          // 2. Ha a CÍM illeszkedik -> Termék találat
          if (item.title.toLowerCase().includes(query.toLowerCase())) {
              formattedResults.push({
                  id: item.id,
                  title: item.title,
                  slug: item.slug,
                  location: item.location,
                  type: "product"
              });
          }
        });

        setResults(formattedResults);
      }
      setIsLoading(false);
    }, 300); // 300ms késleltetés gépelés után

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  // --- NAVIGÁCIÓ ---
  const handleSelect = (result: SearchResult) => {
      if (result.type === "city") {
          router.push(`/city/${encodeURIComponent(result.title)}`);
      } else {
          router.push(`/product/${result.slug}`);
      }
      setShowDropdown(false);
      setQuery(""); // Töröljük a mezőt navigálás után (opcionális)
  };

  const handleEnterKey = (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
          // Ha nyom egy entert és nincs konkrét kiválasztva, keressen rá mint város
          if (query.trim()) {
              router.push(`/city/${encodeURIComponent(query.trim())}`);
              setShowDropdown(false);
          }
      }
  };

  return (
    <div className="w-full max-w-xl mx-auto px-4 sm:px-0 relative z-50" ref={dropdownRef}>
      
      {/* --- KERESŐ MEZŐ --- */}
      <div className="bg-white p-2 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex items-center transform transition-all border border-slate-100 h-14 md:h-16 relative z-50">
        
        <div className="pl-4 md:pl-6 text-slate-400">
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin text-blue-600"/> : <Search className="w-5 h-5 md:w-6 md:h-6" />}
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleEnterKey}
          onFocus={() => { if(query.length >= 2) setShowDropdown(true); }}
          placeholder="Where are you going?"
          className="flex-1 bg-transparent border-none outline-none px-3 md:px-4 text-slate-900 font-bold placeholder:text-slate-400 placeholder:font-normal text-base md:text-lg h-full w-full"
        />

        {query && (
            <button onClick={() => {setQuery(""); setResults([]); setShowDropdown(false);}} className="mr-2 text-slate-300 hover:text-slate-500">
                <X className="w-5 h-5"/>
            </button>
        )}

        <button
          onClick={() => query && router.push(`/city/${encodeURIComponent(query)}`)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 md:px-8 h-full rounded-full transition-colors shadow-lg shadow-blue-900/20 text-sm md:text-base whitespace-nowrap"
        >
          Search
        </button>
      </div>

      {/* --- LIVE DROPDOWN LISTA --- */}
      {showDropdown && results.length > 0 && (
          <div className="absolute top-full left-0 w-full bg-white rounded-2xl shadow-2xl border border-slate-100 mt-2 overflow-hidden animate-in fade-in slide-in-from-top-2 z-40">
              <div className="py-2">
                  
                  {/* CITIES GROUP */}
                  {results.some(r => r.type === "city") && (
                      <div className="mb-2">
                          <p className="px-5 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Destinations</p>
                          {results.filter(r => r.type === "city").map((result) => (
                              <button 
                                key={result.id} 
                                onClick={() => handleSelect(result)}
                                className="w-full text-left px-5 py-3 hover:bg-slate-50 flex items-center gap-3 transition-colors group"
                              >
                                  <div className="bg-blue-50 text-blue-600 p-2 rounded-full group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                      <MapPin className="w-4 h-4"/>
                                  </div>
                                  <span className="font-bold text-slate-900">{result.title}</span>
                              </button>
                          ))}
                      </div>
                  )}

                  {/* PRODUCTS GROUP */}
                  {results.some(r => r.type === "product") && (
                      <div>
                          <p className="px-5 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-t border-slate-100 mt-1 pt-3">Experiences</p>
                          {results.filter(r => r.type === "product").map((result) => (
                              <button 
                                key={result.id} 
                                onClick={() => handleSelect(result)}
                                className="w-full text-left px-5 py-3 hover:bg-slate-50 flex items-center gap-3 transition-colors group"
                              >
                                  <div className="bg-amber-50 text-amber-600 p-2 rounded-full group-hover:bg-amber-500 group-hover:text-white transition-colors">
                                      <Ticket className="w-4 h-4"/>
                                  </div>
                                  <div>
                                      <p className="font-bold text-slate-900 text-sm">{result.title}</p>
                                      <p className="text-xs text-slate-400">{result.location}</p>
                                  </div>
                              </button>
                          ))}
                      </div>
                  )}

              </div>
          </div>
      )}
      
      {/* NO RESULTS STATE */}
      {showDropdown && query.length >= 2 && results.length === 0 && !isLoading && (
          <div className="absolute top-full left-0 w-full bg-white rounded-2xl shadow-2xl border border-slate-100 mt-2 p-6 text-center animate-in fade-in z-40">
              <p className="text-slate-500 text-sm">No results found for "<b>{query}</b>"</p>
          </div>
      )}

    </div>
  );
}