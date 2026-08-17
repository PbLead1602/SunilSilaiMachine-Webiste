"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const slides = [
  "/images/hero images/heroimage1.jpg",
  "/images/hero images/heroimage2.jpg",
  "/images/hero images/heroimage3.jpg",
  "/images/hero images/heroimage4.jpg",
  "/images/hero images/heroimage5.jpg",
  "/images/hero images/heroimage6.jpg",
  "/images/hero images/heroimage7.png",
];

export function HeroCarousel() {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const timer = window.setInterval(() => setActive((current) => (current + 1) % slides.length), 5000);
    return () => window.clearInterval(timer);
  }, []);
  return <><div className="absolute inset-0" aria-hidden="true">{slides.map((src, index) => <Image key={src} src={src} alt="" fill priority={index === 0} sizes="100vw" className={`object-cover object-center transition-opacity duration-1000 ${active === index ? "animate-hero-zoom opacity-75" : "opacity-0"}`} />)}</div><div className="absolute bottom-5 right-6 z-10 flex gap-1.5 sm:bottom-7 sm:right-10" aria-label="Hero image selector">{slides.map((src, index) => <button key={src} onClick={() => setActive(index)} className={`h-1.5 rounded-full transition-all ${active === index ? "w-7 bg-gold" : "w-1.5 bg-white/60 hover:bg-white"}`} aria-label={`Show hero image ${index + 1}`} aria-current={active === index} />)}</div></>;
}
