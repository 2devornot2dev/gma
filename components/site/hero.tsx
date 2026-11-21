// components/site/hero.tsx
import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/misc/reveal";
import { Eyebrow } from "./eyebrow";

export function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-svh items-center overflow-hidden bg-black"
      aria-labelledby="hero-title"
    >
      <Image
        src="/img/hero.png"
        alt="Refrigerated shipping containers and cargo ship at an international port at dusk"
        fill
        priority
        sizes="100vw"
        className="object-cover object-[70%_center] lg:object-center"
      />
      <div className="hero-fade absolute inset-0" aria-hidden="true" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-14 pt-28 lg:px-8 lg:py-32">
        <div className="max-w-2xl">
          <Reveal trigger="mount" delay={0.1} y={16}>
            <Eyebrow className="mb-6">Global Meat Import &amp; Export</Eyebrow>
          </Reveal>

          <Reveal trigger="mount" delay={0.2} y={24} duration={0.85}>
            <h1
              id="hero-title"
              className="font-display text-4xl font-black uppercase leading-[0.93] tracking-tight text-white sm:text-6xl lg:text-7xl"
            >
              Protein Supply.
              <br />
              Delivered <span className="text-knicks">Worldwide.</span>
            </h1>
          </Reveal>

          <Reveal trigger="mount" delay={0.35} y={16}>
            <p className="mt-6 max-w-md text-base leading-relaxed text-white/80 sm:text-lg">
              GMA sources, certifies, and ships premium beef, pork, and poultry
              across six continents through a fully controlled cold chain.
            </p>
          </Reveal>

          <Reveal trigger="mount" delay={0.45} y={16}>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="#quote"
                className="bg-knicks px-8 py-4 text-center text-xs font-black uppercase tracking-[0.18em] text-white transition-colors hover:bg-knicks-600"
              >
                Request a Quote
              </Link>
              <Link
                href="/products"
                className="border border-white/40 px-8 py-4 text-center text-xs font-black uppercase tracking-[0.18em] text-white transition-colors hover:border-white hover:bg-white hover:text-navy"
              >
                View Products
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}