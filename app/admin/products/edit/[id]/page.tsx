"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import ProductForm from "@/components/admin/ProductForm";
import { useParams } from "next/navigation";

export default function EditProductPage() {
  const params = useParams();
  const id = params.id as string;
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      const { data } = await supabase.from('products').select('*').eq('id', id).single();
      if (data) setProduct(data);
    };
    fetchProduct();
  }, [id]);

  if (!product) return <div className="p-10 text-center">Loading product data...</div>;

  return <ProductForm initialData={product} />;
}