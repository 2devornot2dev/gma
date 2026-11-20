import { Reveal } from "@/components/misc/reveal";

export function Testimonial() {
  return (
    <section className="py-20 lg:py-24" aria-label="Client testimonial">
      <figure className="mx-auto max-w-4xl px-5 text-center lg:px-8">
        <Reveal delay={0.1} y={12} scale={0.9}>
          <svg
            className="mx-auto h-10 w-10 text-knicks"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M9.5 6C6.5 6 4 8.5 4 11.5V18h6v-6H7c0-1.7 1.3-3 3-3V6h-.5zm10 0c-3 0-5.5 2.5-5.5 5.5V18h6v-6h-3c0-1.7 1.3-3 3-3V6h-.5z" />
          </svg>
        </Reveal>

        <Reveal delay={0.2} y={16}>
          <blockquote className="mt-6 font-display text-2xl font-bold leading-snug text-navy sm:text-3xl">
            &ldquo;GMA has been our primary protein partner for eight years.
            Consistent product, clean paperwork, and they never miss a
            vessel.&rdquo;
          </blockquote>
        </Reveal>

        <Reveal delay={0.3} y={12}>
          <figcaption className="mt-8 text-sm font-semibold uppercase tracking-widest text-steel">
            Director of Procurement, Regional Food Distributor
          </figcaption>
        </Reveal>
      </figure>
    </section>
  );
}