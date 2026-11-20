import Image from "next/image";
import { Eyebrow } from "./eyebrow";

const points = [
  "Direct relationships with certified plants",
  "Full export & customs documentation",
  "Real-time container temperature tracking",
  "Dedicated account managers per region",
];

export function About() {
  return (
    <section id="about" className="py-20 lg:py-28" aria-labelledby="about-title">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 lg:grid-cols-2 lg:items-center lg:gap-20 lg:px-8">
        <div className="relative">
          <div className="relative aspect-[4/3] w-full">
            <Image
              src="/img/coldstorage.png"
              alt="GMA cold storage warehouse with racks of palletized frozen meat"
              fill
              sizes="(min-width: 1024px) 560px, 100vw"
              className="object-cover"
            />
          </div>
          <div className="absolute -bottom-6 right-4 bg-knicks px-6 py-5 text-white lg:-right-6">
            <p className="font-display text-3xl font-black">-18°C</p>
            <p className="text-xs font-semibold uppercase tracking-widest">
              Constant Cold Chain
            </p>
          </div>
        </div>

        <div>
          <Eyebrow>Who We Are</Eyebrow>
          <h2
            id="about-title"
            className="font-display text-3xl font-black uppercase leading-tight tracking-tight text-navy sm:text-5xl"
          >
            Built on Trust. Moved With Precision.
          </h2>
          <p className="mt-6 leading-relaxed text-steel">
            For over two decades, GMA has connected certified producers with
            distributors, retailers, and foodservice operators around the globe.
            We manage every link: sourcing, inspection, documentation, freight,
            and final-mile cold storage.
          </p>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {points.map((p) => (
              <li
                key={p}
                className="flex items-start gap-3 border-l-4 border-navy bg-steel-50 p-4 text-sm font-semibold text-steel-900"
              >
                {p}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}