import { Eyebrow } from "./eyebrow";
import { QuoteForm } from "./quote-form"

const contacts = [
  {
    label: "Phone",
    value: "+1 (800) 555-0199",
    href: "tel:+18005550199",
  },
  {
    label: "Email",
    value: "trade@gma-global.com",
    href: "mailto:trade@gma-global.com",
  },
  {
    label: "Headquarters",
    value: "Port Newark, New Jersey, USA",
  },
];

export function QuoteSection() {
  return (
    <section
      id="quote"
      className="bg-steel-900 py-20 text-white lg:py-28"
      aria-labelledby="quote-title"
    >
      <div className="mx-auto grid max-w-7xl gap-12 px-5 lg:grid-cols-5 lg:gap-16 lg:px-8">
        <div className="lg:col-span-2">
          <Eyebrow>Contact Us</Eyebrow>
          <h2
            id="quote-title"
            className="font-display text-3xl font-black uppercase leading-tight tracking-tight sm:text-5xl"
          >
            Get a Quote
          </h2>
          <p className="mt-6 leading-relaxed text-white/70">
            Tell us what you need. A GMA trade specialist will respond within
            one business day.
          </p>
          <dl className="mt-10 space-y-6">
            {contacts.map((c) => (
              <div key={c.label}>
                <dt className="text-xs font-bold uppercase tracking-widest text-knicks">
                  {c.label}
                </dt>
                <dd className="mt-1 text-lg font-semibold">
                  {c.href ? (
                    <a href={c.href} className="hover:text-knicks">
                      {c.value}
                    </a>
                  ) : (
                    c.value
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="lg:col-span-3">
          <QuoteForm />
        </div>
      </div>
    </section>
  );
}