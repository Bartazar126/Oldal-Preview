"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function FAQ() {
  return (
    <section className="py-24 bg-slate-50" id="faq">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
           <h2 className="text-blue-600 font-bold tracking-widest uppercase mb-2">Support Center</h2>
           <h3 className="text-4xl font-black text-slate-900">Frequently Asked Questions</h3>
           <p className="text-slate-500 mt-4">Everything you need to know before booking.</p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
           
           {/* 1. Függetlenség - Google Ads miatt az első helyen! */}
           <AccordionItem value="i1" className="bg-white border border-slate-200 rounded-2xl px-6 shadow-sm">
             <AccordionTrigger className="font-bold text-slate-900 text-lg py-6 text-left">Is Entrigo Tickets an official website?</AccordionTrigger>
             <AccordionContent className="text-slate-600 pb-6 leading-relaxed">
                No. Entrigo Tickets is a private, independent booking agency. We are not affiliated with, endorsed by, or connected to any government entity or specific venue (such as the Louvre or Eiffel Tower). We connect travelers with authorized ticket suppliers to provide a convenient booking experience. The price of our tickets includes a service fee to cover our 24/7 support, platform maintenance, and instant digital delivery.
             </AccordionContent>
           </AccordionItem>

           {/* 2. Jegyátvétel */}
           <AccordionItem value="i2" className="bg-white border border-slate-200 rounded-2xl px-6 shadow-sm">
             <AccordionTrigger className="font-bold text-slate-900 text-lg py-6 text-left">How do I receive my tickets?</AccordionTrigger>
             <AccordionContent className="text-slate-600 pb-6 leading-relaxed">
                Tickets are delivered digitally to your email address immediately after payment confirmation. In 99% of cases, you do not need to print them; simply show the QR code on your smartphone at the entrance. Please ensure your phone is charged.
             </AccordionContent>
           </AccordionItem>

           {/* 3. Refund */}
           <AccordionItem value="i3" className="bg-white border border-slate-200 rounded-2xl px-6 shadow-sm">
             <AccordionTrigger className="font-bold text-slate-900 text-lg py-6 text-left">What is your refund policy?</AccordionTrigger>
             <AccordionContent className="text-slate-600 pb-6 leading-relaxed">
                Refund policies vary depending on the attraction and the ticket type. Generally, timed-entry tickets are non-refundable once issued by the venue, as they are reserved for a specific slot. However, if you contact us 48 hours in advance, we will do our best to resell your ticket or reschedule your visit, though this is not guaranteed.
             </AccordionContent>
           </AccordionItem>

           {/* 4. Késés - Fontos gyakorlati kérdés */}
           <AccordionItem value="i4" className="bg-white border border-slate-200 rounded-2xl px-6 shadow-sm">
             <AccordionTrigger className="font-bold text-slate-900 text-lg py-6 text-left">What happens if I am late for my time slot?</AccordionTrigger>
             <AccordionContent className="text-slate-600 pb-6 leading-relaxed">
                Most popular attractions (like the Louvre or Sagrada Família) have strict time slots. If you miss your slot, entry is not guaranteed and depends entirely on the discretion of the venue staff. We strongly recommend arriving 30 minutes before your scheduled time.
             </AccordionContent>
           </AccordionItem>

           {/* 5. Gyerekjegyek */}
           <AccordionItem value="i5" className="bg-white border border-slate-200 rounded-2xl px-6 shadow-sm">
             <AccordionTrigger className="font-bold text-slate-900 text-lg py-6 text-left">Do children need tickets?</AccordionTrigger>
             <AccordionContent className="text-slate-600 pb-6 leading-relaxed">
                Yes, usually all visitors need a ticket, although tickets for children are often available at a reduced price. Please check the specific product page for details regarding age limits and pricing for minors.
             </AccordionContent>
           </AccordionItem>

            {/* 6. Biztonsági ellenőrzés - Fontos a "Skip the line" tisztázása miatt */}
           <AccordionItem value="i6" className="bg-white border border-slate-200 rounded-2xl px-6 shadow-sm">
             <AccordionTrigger className="font-bold text-slate-900 text-lg py-6 text-left">Does "Skip the Line" mean no waiting at all?</AccordionTrigger>
             <AccordionContent className="text-slate-600 pb-6 leading-relaxed">
                "Skip the Line" (or Priority Access) allows you to bypass the main ticket purchase queue. However, all visitors must pass through mandatory security checks. This line cannot be skipped for safety reasons, but it is generally much faster than the ticket line.
             </AccordionContent>
           </AccordionItem>

        </Accordion>
      </div>
    </section>
  );
}