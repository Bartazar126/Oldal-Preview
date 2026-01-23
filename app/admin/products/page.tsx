"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Edit, Trash2, MapPin, Star } from "lucide-react";

export default function ProductsList() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // 1. Termékek betöltése
  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false }); // Legújabb elöl

    if (error) console.error(error);
    else setProducts(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // 2. Törlés funkció
  const handleDelete = async (id: string) => {
    if (!window.confirm("Biztosan törölni akarod ezt a terméket?")) return;

    const { error } = await supabase.from('products').delete().eq('id', id);
    
    if (error) {
      alert("Hiba történt a törléskor!");
      console.error(error);
    } else {
      // Frissítjük a listát (kivesszük a töröltet)
      setProducts(products.filter(p => p.id !== id));
    }
  };

  // Keresés szűrés
  const filteredProducts = products.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase()) || 
    p.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* FEJLÉC */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-3xl font-black text-slate-900">Products</h1>
           <p className="text-slate-500 text-sm">Manage your tours and activities</p>
        </div>
        <Link href="/admin/products/new">
           <Button className="bg-blue-600 hover:bg-blue-700 font-bold gap-2">
              <Plus className="w-4 h-4"/> New Product
           </Button>
        </Link>
      </div>

      {/* KERESŐSÁV */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-2">
         <Search className="w-5 h-5 text-slate-400" />
         <Input 
            placeholder="Search by name or location..." 
            className="border-0 focus-visible:ring-0 px-0 text-base"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
         />
      </div>

      {/* TÁBLÁZAT */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
         {loading ? (
             <div className="p-8 text-center text-slate-400">Loading products...</div>
         ) : filteredProducts.length === 0 ? (
             <div className="p-12 text-center">
                 <p className="text-slate-500 font-bold mb-2">No products found</p>
                 <Link href="/admin/products/new"><Button variant="outline">Create your first product</Button></Link>
             </div>
         ) : (
             <div className="overflow-x-auto">
                 <table className="w-full text-left border-collapse">
                     <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold uppercase text-slate-500">
                         <tr>
                             <th className="p-4 w-20">Image</th>
                             <th className="p-4">Title</th>
                             <th className="p-4">Price</th>
                             <th className="p-4">Status</th>
                             <th className="p-4 text-right">Actions</th>
                         </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100">
                         {filteredProducts.map((product) => (
                             <tr key={product.id} className="hover:bg-slate-50 transition-colors group">
                                 {/* KÉP */}
                                 <td className="p-4">
                                     <div className="w-12 h-12 rounded-lg bg-slate-200 relative overflow-hidden">
                                         {product.images?.[0] ? (
                                             <Image src={product.images[0]} alt="" fill className="object-cover" />
                                         ) : (
                                             <div className="flex items-center justify-center h-full text-xs text-slate-400">No img</div>
                                         )}
                                     </div>
                                 </td>
                                 
                                 {/* CÍM ÉS HELYSZÍN */}
                                 <td className="p-4">
                                     <div className="font-bold text-slate-900">{product.title}</div>
                                     <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                                         <MapPin className="w-3 h-3"/> {product.location} 
                                         <span className="text-slate-300 mx-1">|</span>
                                         <Star className="w-3 h-3 text-yellow-400 fill-current"/> {product.rating}
                                     </div>
                                 </td>

                                 {/* ÁR */}
                                 <td className="p-4">
                                     <div className="font-bold text-slate-900">€{product.price}</div>
                                     {product.original_price > product.price && (
                                         <div className="text-xs text-slate-400 line-through">€{product.original_price}</div>
                                     )}
                                 </td>

                                 {/* STÁTUSZ CÍMKÉK */}
                                 <td className="p-4">
                                     <div className="flex flex-col gap-1 items-start">
                                         {product.is_recommended && <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full">Recommended</span>}
                                         {product.is_best_seller && <span className="bg-yellow-100 text-yellow-700 text-[10px] font-bold px-2 py-0.5 rounded-full">Bestseller</span>}
                                         {!product.is_recommended && !product.is_best_seller && <span className="text-slate-400 text-xs">-</span>}
                                     </div>
                                 </td>

                                 {/* GOMBOK */}
                                 <td className="p-4 text-right">
                                     <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                         <Link href={`/admin/products/edit/${product.id}`}>
                                             <Button variant="outline" size="icon" className="h-8 w-8 hover:bg-blue-50 hover:text-blue-600 border-slate-200">
                                                 <Edit className="w-4 h-4" />
                                             </Button>
                                         </Link>
                                         <Button 
                                            variant="outline" size="icon" 
                                            className="h-8 w-8 hover:bg-red-50 hover:text-red-600 border-slate-200"
                                            onClick={() => handleDelete(product.id)}
                                         >
                                             <Trash2 className="w-4 h-4" />
                                         </Button>
                                     </div>
                                 </td>
                             </tr>
                         ))}
                     </tbody>
                 </table>
             </div>
         )}
      </div>
    </div>
  );
}