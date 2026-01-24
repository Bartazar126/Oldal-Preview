import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// 'as any' a verzióhiba ellen
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia' as any, 
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { productTitle, productId, date, time, tickets, totalPrice, leadTraveler, allGuestNames } = body;

    // Line items
    const lineItems = [
      {
        price_data: {
          currency: 'eur',
          product_data: {
            name: `${productTitle}`,
            description: `Date: ${date} at ${time}. Guests: ${Object.entries(tickets).map(([k,v]) => `${v}x ${k}`).join(', ')}`,
          },
          unit_amount: Math.round(totalPrice * 100), 
        },
        quantity: 1,
      },
    ];

    // --- EMBEDDED SESSION LÉTREHOZÁSA ---
    const session = await stripe.checkout.sessions.create({
      ui_mode: 'embedded', // <--- EZ A KULCS!
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      // Hova vigyen SIKERES fizetés után?
      return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      
      metadata: {
        productId,
        date,
        time,
        leadName: leadTraveler.name,
        leadEmail: leadTraveler.email,
        guestNames: JSON.stringify(allGuestNames) 
      },
      customer_email: leadTraveler.email, 
    });

    // URL helyett most client_secret-et küldünk vissza!
    return NextResponse.json({ clientSecret: session.client_secret });

  } catch (error: any) {
    console.error("Stripe Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}