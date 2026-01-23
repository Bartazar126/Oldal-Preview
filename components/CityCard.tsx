"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface CityProps {
    name: string;
    image: string;
    description: string;
    link: string;
}

export default function CityCard({ name, image, description, link }: CityProps) {
    return (
        // FONTOS: Itt a 'link' változót használjuk (pl. "/paris"), NEM fix linket!
        <Link href={link} className="group relative h-[300px] w-full rounded-2xl overflow-hidden block shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1">
            <Image 
                src={image} 
                alt={name} 
                fill 
                className="object-cover transition-transform duration-700 group-hover:scale-110" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            
            <div className="absolute bottom-0 left-0 p-6 w-full">
                <h3 className="text-3xl font-black text-white mb-2">{name}</h3>
                <p className="text-slate-300 text-sm mb-4 line-clamp-2">{description}</p>
                <div className="flex items-center text-white font-bold text-sm group-hover:text-green-400 transition-colors">
                    Explore Attractions <ArrowRight className="ml-2 w-4 h-4" />
                </div>
            </div>
        </Link>
    );
}