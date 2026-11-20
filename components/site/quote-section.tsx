// components/site/quote.tsx
import { Reveal } from "@/components/misc/reveal";

export function QuoteSection() {
  return (
    <section id="quote" className="bg-navy-950 py-24 text-white sm:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Reveal
              scaleX={0}
              className="mb-4 h-1 w-16 origin-left bg-knicks"
            />
            <Reveal delay={0.1}>
              <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-knicks">
                Commercial Pricing
              </span>
            </Reveal>
            <Reveal delay={0.2}>
              <h2 className="mt-2 font-display text-3xl font-black uppercase tracking-tight text-white sm:text-5xl">
                Request a Wholesale Quote
              </h2>
            </Reveal>
            <Reveal delay={0.3}>
              <p className="mt-4 text-base leading-relaxed text-steel-300">
                Direct container or pallet load pricing for distributors,
                supermarkets, and institutional foodservice buyers. Most quotes
                issued within 4 business hours.
              </p>
            </Reveal>
          </div>

          <div className="lg:col-span-7">
            <Reveal
              delay={0.2}
              y={24}
              className="border border-white/10 bg-navy p-6 sm:p-8"
            >
              <form className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="font-mono text-[11px] font-bold uppercase tracking-wider text-steel-300">
                      Company Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Enterprise Food Group"
                      className="mt-1 w-full border border-white/20 bg-navy-950 px-3.5 py-2.5 text-sm text-white placeholder:text-steel focus:border-knicks focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-mono text-[11px] font-bold uppercase tracking-wider text-steel-300">
                      Business Email
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="procurement@company.com"
                      className="mt-1 w-full border border-white/20 bg-navy-950 px-3.5 py-2.5 text-sm text-white placeholder:text-steel focus:border-knicks focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="font-mono text-[11px] font-bold uppercase tracking-wider text-steel-300">
                      Product Category
                    </label>
                    <select className="mt-1 w-full border border-white/20 bg-navy-950 px-3.5 py-2.5 text-sm text-white focus:border-knicks focus:outline-none">
                      <option>Beef Cuts</option>
                      <option>Pork</option>
                      <option>Poultry / Chicken</option>
                      <option>Seafood &amp; Shellfish</option>
                      <option>Game &amp; Specialty</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-mono text-[11px] font-bold uppercase tracking-wider text-steel-300">
                      Estimated Volume
                    </label>
                    <select className="mt-1 w-full border border-white/20 bg-navy-950 px-3.5 py-2.5 text-sm text-white focus:border-knicks focus:outline-none">
                      <option>Pallet (500–2,000 lbs)</option>
                      <option>Multi-Pallet (2,000–10,000 lbs)</option>
                      <option>Full Container (FCL - 40,000 lbs)</option>
                      <option>Recurring Contract</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-mono text-[11px] font-bold uppercase tracking-wider text-steel-300">
                    Destination &amp; Specifications
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Destination port/facility, required portion specs, delivery window..."
                    className="mt-1 w-full resize-none border border-white/20 bg-navy-950 px-3.5 py-2.5 text-sm text-white placeholder:text-steel focus:border-knicks focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-knicks py-4 text-xs font-black uppercase tracking-[0.2em] text-white transition-colors hover:bg-knicks-600"
                >
                  Submit Quote Request
                </button>
              </form>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}