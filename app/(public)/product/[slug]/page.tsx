import { supabase } from "@/lib/supabase";
import ProductTemplate, { ProductData } from "@/components/product/ProductTemplate";
import { Metadata, ResolvingMetadata } from 'next';

// ... (Metadata generálás maradhat a régi, az kell a SEO-hoz) ...

// --- ADAT LEKÉRÉS ---
async function getProduct(slug: string) {
    const { data } = await supabase.from('products').select('*').eq('slug', decodeURIComponent(slug)).single();
    return data as ProductData;
}

export default async function ProductPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const product = await getProduct(params.slug);

  if (!product) return <div>Product not found</div>;

  // Itt csak átadjuk az adatot a sablonnak
  return <ProductTemplate product={product} />;
}