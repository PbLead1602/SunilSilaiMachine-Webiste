"use client";

import Image from "next/image";
import { ImageOff } from "lucide-react";
import { useState } from "react";

export function ProductGallery({ images, alt, pendingLabel = "Official product image is being verified." }: { images: string[]; alt: string; pendingLabel?: string }) {
  const [active, setActive] = useState(images[0] ?? "");

  return (
    <div className="min-w-0">
      <div className="relative aspect-square overflow-hidden rounded-3xl border border-line bg-white">
        {active ? <Image src={active} alt={alt} fill quality={90} sizes="(min-width: 1024px) 50vw, 100vw" className="object-contain p-5 transition duration-500 hover:scale-110" priority /> : <div className="flex h-full items-center justify-center p-8 text-center"><div><ImageOff className="mx-auto size-10 text-clay" /><p className="mt-4 text-sm font-semibold text-stone-600">{pendingLabel}</p></div></div>}
      </div>
      <div className="responsive-scroll mt-3 flex gap-3 pb-1">
        {images.map((image) => (
          <button onClick={() => setActive(image)} className={`relative size-20 shrink-0 overflow-hidden rounded-2xl border ${active === image ? "border-clay ring-2 ring-gold" : "border-line"}`} key={image} aria-label="View product image">
            <Image src={image} alt="" fill quality={85} className="object-contain p-1" />
          </button>
        ))}
      </div>
    </div>
  );
}
