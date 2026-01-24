import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

// JAVÍTVA: 'as any' a verzióhiba ellen
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia' as any, 
});

// Supabase Admin kliens (szükséges a SERVICE_ROLE_KEY a mentéshez!)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! 
);

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get('session_id');

  if (!sessionId) {
    return NextResponse.json({ error: 'Missing session_id' }, { status: 400 });
  }

  try {
    // 1. Lekérjük a Stripe munkamenetet
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // Csak akkor fogadjuk el, ha fizetve van
    if (session.payment_status !== 'paid') {
      return NextResponse.json({ error: 'Payment not completed' }, { status: 400 });
    }

    // 2. Kinyerjük az adatokat a Stripe Metadata-ból
    const metadata = session.metadata || {};
    const { productId, date, time, leadName, leadEmail, guestNames } = metadata;
    
    // 3. DUPLIKÁCIÓ ELLENŐRZÉS
    // Megnézzük, hogy ezzel a session ID-val van-e már foglalás
    const { data: existingBooking } = await supabase
      .from('bookings')
      .select('id, product_title, total_price, customer_email, booking_date, booking_time')
      .eq('stripe_session_id', session.id)
      .single();

    // Ha már létezik, akkor csak visszaadjuk a meglévőt (nem mentjük újra)
    if (existingBooking) {
      return NextResponse.json({ status: 'already_exists', booking: existingBooking });
    }

    // 4. Mentés az adatbázisba
    const { data: newBooking, error } = await supabase
      .from('bookings')
      .insert({
        product_id: productId, // Itt text-ként mentjük a UUID-t
        customer_name: leadName,
        customer_email: leadEmail,
        product_title: session.line_items?.data?.[0]?.description || "Ticket Purchase", // Fallback cím
        total_price: session.amount_total ? session.amount_total / 100 : 0, // Cent -> Euró konverzió
        booking_date: date,
        booking_time: time,
        guest_names: JSON.parse(guestNames || "[]"), // Stringből visszaalakítjuk tömbbé
        status: 'paid',
        stripe_session_id: session.id
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase Save Error:", error);
      throw new Error("Failed to save booking to database");
    }

    return NextResponse.json({ status: 'success', booking: newBooking });

  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}