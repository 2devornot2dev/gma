import { About } from "@/components/site/about";
import { Footer } from "@/components/site/footer";
import { Nav } from "@/components/site/nav";
import { Hero } from "@/components/site/hero";
import { Process } from "@/components/site/process";
import { Products } from "@/components/site/products";
import { Quality } from "@/components/site/quality";
import { QuoteSection } from "@/components/site/quote-section";
import { Services } from "@/components/site/services";
import { Stats } from "@/components/site/stats";
import { Testimonial } from "@/components/site/testimonial";

export default function Home() {
  return (
    <>
      <Nav/>
      <main id="top">
        <Hero />
        <Stats />
        <About />
        <Products />
        <Services />
        <Quality />
        <Process />
        <Testimonial />
        <QuoteSection />
      </main>
      <Footer />
    </>
  );
}