"use client";

import { useState } from "react";
import ProductTemplate, { ProductData } from "@/components/product/ProductTemplate";
import { Eye, Edit, Save, Plus, X, Image as ImageIcon, FileText, Star, Zap } from "lucide-react";

// Kezdeti üres állapot (Booking dolgok kivéve, de a típus miatt üresen benne hagyom őket, hogy ne sírjon a TS)
const initialProduct: ProductData = {
  title: "",
  location: "Paris, France",
  price: 0,
  rating: 5.0,
  reviews: 0,
  short_desc: "",
  full_description: "",
  good_to_know: "", // <--- ITT AZ ÚJ MEZŐ
  important_info: "",
  duration: "2 hours",
  languages: ["English"],
  inclusions: [],
  exclusions: [],
  images: [], 
  ticket_types: [], // Üresen hagyva
  time_slots: [],   // Üresen hagyva
  date_overrides: {}, // Üresen hagyva
  faq: [] 
};

export default function NewProductPage() {
  const [product, setProduct] = useState<ProductData>(initialProduct);
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');

  const [imageInput, setImageInput] = useState("");
  const [featureInput, setFeatureInput] = useState(""); 
  const [exclusionInput, setExclusionInput] = useState(""); 

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProduct(prev => ({ ...prev, [name]: value }));
  };

  const addFAQ = () => {
    setProduct(prev => ({ ...prev, faq: [...(prev.faq || []), { q: "", a: "" }] }));
  };
  const updateFAQ = (index: number, field: 'q' | 'a', value: string) => {
    const newFAQ = [...(product.faq || [])];
    newFAQ[index][field] = value;
    setProduct(prev => ({ ...prev, faq: newFAQ }));
  };
  const removeFAQ = (index: number) => {
    setProduct(prev => ({ ...prev, faq: prev.faq?.filter((_, i) => i !== index) }));
  };

  const addItem = (field: 'inclusions' | 'exclusions' | 'images', value: string, setter: any) => {
    if (value.trim()) {
      setProduct(prev => ({ ...prev, [field]: [...(prev[field] || []), value.trim()] }));
      setter("");
    }
  };
  const removeItem = (field: 'inclusions' | 'exclusions' | 'images', index: number) => {
    setProduct(prev => ({ ...prev, [field]: prev[field]?.filter((_, i) => i !== index) }));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col h-screen overflow-hidden">
      
      {/* TOP BAR */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shrink-0 z-20 shadow-sm">
          <div>
            <h1 className="text-xl font-black text-slate-900">{product.title || "New Product"}</h1>
            <p className="text-xs text-slate-500">{activeTab === 'edit' ? 'Editing content' : 'Visual Preview'}</p>
          </div>

          <div className="flex items-center gap-4">
              <div className="bg-slate-100 p-1 rounded-lg flex border border-slate-200">
                  <button onClick={() => setActiveTab('edit')} className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'edit' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}><Edit className="w-4 h-4" /> Content</button>
                  <button onClick={() => setActiveTab('preview')} className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'preview' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}><Eye className="w-4 h-4" /> Preview</button>
              </div>
              <button className="bg-slate-900 text-white px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-slate-800 transition-colors flex items-center gap-2"><Save className="w-4 h-4" /> Save</button>
          </div>
      </div>

      {/* CONTENT */}
      <div className="flex-1 overflow-y-auto relative">
          
          {/* --- EDIT MODE --- */}
          {activeTab === 'edit' && (
              <div className="max-w-5xl mx-auto p-8 pb-40 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="space-y-8">
                      
                      {/* 1. ESSENTIALS */}
                      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
                          <h3 className="text-lg font-bold text-slate-900 border-b pb-4 mb-6 flex items-center gap-2"><Star className="w-5 h-5 text-amber-500"/> Essentials</h3>
                          <div className="grid grid-cols-2 gap-6">
                              <div className="col-span-2">
                                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">Product Title</label>
                                  <input name="title" value={product.title} onChange={handleChange} className="w-full border border-slate-300 rounded-lg p-3 text-lg font-bold focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Louvre Museum Skip-the-Line" />
                              </div>
                              <div>
                                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">Location</label>
                                  <input name="location" value={product.location} onChange={handleChange} className="w-full border border-slate-300 rounded-lg p-3" />
                              </div>
                              <div>
                                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">Duration</label>
                                  <input name="duration" value={product.duration} onChange={handleChange} className="w-full border border-slate-300 rounded-lg p-3" />
                              </div>
                              <div>
                                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">Display Price (€)</label>
                                  <input type="number" name="price" value={product.price} onChange={handleChange} className="w-full border border-slate-300 rounded-lg p-3" />
                              </div>
                              <div>
                                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">Original Price (Strike-through)</label>
                                  <input type="number" name="original_price" onChange={(e) => setProduct(prev => ({...prev, original_price: Number(e.target.value)}))} className="w-full border border-slate-300 rounded-lg p-3" />
                              </div>
                          </div>
                      </div>

                      {/* 2. IMAGES */}
                      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
                          <h3 className="text-lg font-bold text-slate-900 border-b pb-4 mb-6 flex items-center gap-2"><ImageIcon className="w-5 h-5 text-blue-600"/> Gallery</h3>
                          <div className="flex gap-2 mb-4">
                              <input value={imageInput} onChange={(e) => setImageInput(e.target.value)} className="flex-1 border rounded-lg p-3" placeholder="Image URL (https://...)" />
                              <button onClick={() => addItem('images', imageInput, setImageInput)} className="bg-slate-900 text-white px-6 py-2 rounded-lg font-bold">Add</button>
                          </div>
                          <div className="grid grid-cols-4 md:grid-cols-6 gap-4">
                              {product.images?.map((img, i) => (
                                  <div key={i} className="relative aspect-square bg-slate-100 rounded-xl overflow-hidden group border border-slate-200 shadow-sm">
                                      {/* eslint-disable-next-line @next/next/no-img-element */}
                                      <img src={img} alt="" className="object-cover w-full h-full" />
                                      <button onClick={() => removeItem('images', i)} className="absolute top-1 right-1 bg-red-600 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"><X className="w-3 h-3"/></button>
                                  </div>
                              ))}
                              {product.images.length === 0 && <div className="col-span-full text-center py-8 text-slate-400 italic">No images added yet.</div>}
                          </div>
                      </div>

                      {/* 3. DETAILS & STORY (ITT A GOOD TO KNOW!) */}
                      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
                          <h3 className="text-lg font-bold text-slate-900 border-b pb-4 mb-6 flex items-center gap-2"><FileText className="w-5 h-5 text-purple-600"/> Details & Story</h3>
                          <div className="space-y-6">
                              <div>
                                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">Short Description (Lead)</label>
                                  <textarea name="short_desc" value={product.short_desc} onChange={handleChange} className="w-full border border-slate-300 rounded-lg p-3 h-24" placeholder="Brief summary shown at the top..." />
                              </div>
                              <div>
                                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">Full Description (The Experience)</label>
                                  <textarea name="full_description" value={product.full_description} onChange={handleChange} className="w-full border border-slate-300 rounded-lg p-3 h-64" placeholder="Tell the full story..." />
                              </div>
                              
                              <div className="grid grid-cols-2 gap-6">
                                  {/* ÚJ GOOD TO KNOW MEZŐ */}
                                  <div>
                                      <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">Good to Know (Sidebar)</label>
                                      <textarea name="good_to_know" value={product.good_to_know} onChange={handleChange} className="w-full border border-slate-300 rounded-lg p-3 h-40 bg-slate-50" placeholder="Useful tips, dress code, accessibility..." />
                                  </div>
                                  <div>
                                      <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">Important Info (Blue Box)</label>
                                      <textarea name="important_info" value={product.important_info} onChange={handleChange} className="w-full border border-slate-300 rounded-lg p-3 h-40 bg-blue-50/50" placeholder="Strict rules, what to bring..." />
                                  </div>
                              </div>
                          </div>
                      </div>

                      {/* 4. HIGHLIGHTS & FAQ */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          
                          {/* LISTÁK */}
                          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                              <h3 className="text-sm font-bold text-slate-900 border-b pb-2 mb-4 flex items-center gap-2"><Zap className="w-4 h-4"/> Highlights & Exclusions</h3>
                              
                              {/* Included */}
                              <div className="mb-6">
                                  <label className="text-xs font-bold text-green-600 block mb-2">What's Included</label>
                                  <div className="flex gap-2 mb-2">
                                      <input value={featureInput} onChange={(e) => setFeatureInput(e.target.value)} className="flex-1 border rounded-lg p-2 text-sm" placeholder="Add item..." onKeyDown={(e) => e.key === 'Enter' && addItem('inclusions', featureInput, setFeatureInput)}/>
                                      <button onClick={() => addItem('inclusions', featureInput, setFeatureInput)} className="bg-green-100 text-green-700 p-2 rounded-lg hover:bg-green-200"><Plus className="w-4 h-4"/></button>
                                  </div>
                                  <ul className="space-y-1">
                                      {product.inclusions?.map((item, i) => (
                                          <li key={i} className="flex justify-between items-center bg-slate-50 px-3 py-1.5 rounded text-sm text-slate-700">
                                              <span>{item}</span>
                                              <button onClick={() => removeItem('inclusions', i)}><X className="w-3 h-3 text-slate-400 hover:text-red-500"/></button>
                                          </li>
                                      ))}
                                  </ul>
                              </div>

                              {/* Excluded */}
                              <div>
                                  <label className="text-xs font-bold text-red-500 block mb-2">What's Excluded</label>
                                  <div className="flex gap-2 mb-2">
                                      <input value={exclusionInput} onChange={(e) => setExclusionInput(e.target.value)} className="flex-1 border rounded-lg p-2 text-sm" placeholder="Add item..." onKeyDown={(e) => e.key === 'Enter' && addItem('exclusions', exclusionInput, setExclusionInput)}/>
                                      <button onClick={() => addItem('exclusions', exclusionInput, setExclusionInput)} className="bg-red-100 text-red-700 p-2 rounded-lg hover:bg-red-200"><Plus className="w-4 h-4"/></button>
                                  </div>
                                  <ul className="space-y-1">
                                      {product.exclusions?.map((item, i) => (
                                          <li key={i} className="flex justify-between items-center bg-slate-50 px-3 py-1.5 rounded text-sm text-slate-700">
                                              <span>{item}</span>
                                              <button onClick={() => removeItem('exclusions', i)}><X className="w-3 h-3 text-slate-400 hover:text-red-500"/></button>
                                          </li>
                                      ))}
                                  </ul>
                              </div>
                          </div>

                          {/* FAQ */}
                          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                              <h3 className="text-sm font-bold text-slate-900 border-b pb-2 mb-4">FAQ Section</h3>
                              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                                  {product.faq?.map((item, i) => (
                                      <div key={i} className="bg-slate-50 p-3 rounded-lg border border-slate-200 relative group">
                                          <button onClick={() => removeFAQ(i)} className="absolute top-2 right-2 text-slate-300 hover:text-red-500"><X className="w-4 h-4"/></button>
                                          <input value={item.q} onChange={(e) => updateFAQ(i, 'q', e.target.value)} className="w-[90%] border-none bg-transparent text-sm font-bold placeholder-slate-400 focus:ring-0 p-0 mb-1" placeholder="Question..." />
                                          <textarea value={item.a} onChange={(e) => updateFAQ(i, 'a', e.target.value)} className="w-full border-none bg-transparent text-xs text-slate-600 focus:ring-0 p-0 resize-none h-12" placeholder="Answer..." />
                                      </div>
                                  ))}
                              </div>
                              <button onClick={addFAQ} className="mt-4 w-full border border-dashed border-slate-300 text-slate-500 py-2 rounded-lg text-xs font-bold hover:bg-slate-50 hover:text-slate-700 flex items-center justify-center gap-2">
                                  <Plus className="w-3 h-3"/> Add Question
                              </button>
                          </div>
                      </div>

                  </div>
              </div>
          )}

          {/* --- PREVIEW MODE (FULL SCREEN) --- */}
          {activeTab === 'preview' && (
              <div className="bg-slate-100 min-h-full flex flex-col items-center py-8 animate-in fade-in zoom-in-95 duration-300">
                  <div className="w-full max-w-[1400px] rounded-xl bg-white shadow-2xl overflow-hidden border border-slate-300">
                      <div className="h-full w-full overflow-y-auto scrollbar-hide bg-white">
                          <ProductTemplate product={product} isPreview={true} />
                      </div>
                  </div>
              </div>
          )}
      </div>
    </div>
  );
}