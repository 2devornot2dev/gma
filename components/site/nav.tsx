// components/site/nav.tsx
"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { Reveal } from "@/components/misc/reveal";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const links = [
  { href: "#about", label: "About" },
  { href: "#products", label: "Products" },
  { href: "#services", label: "Services" },
  { href: "#quality", label: "Quality" },
];

function Logo() {
  return (
    <Link href="#top" className="flex items-center gap-3" aria-label="GMA home">
      <span className="flex h-10 w-10 items-center justify-center bg-knicks font-display text-lg font-black text-white shadow-sm">
        G
      </span>
      <span className="font-display text-2xl font-black tracking-tight text-white">
        GMA
      </span>
    </Link>
  );
}

export function Nav() {
  return (
    <Reveal
      as="header"
      trigger="mount"
      y={-16}
      duration={0.6}
      className="absolute inset-x-0 top-0 z-30"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 lg:px-8">
        <Logo />

        <nav aria-label="Primary" className="hidden items-center gap-8 lg:flex">
          {links.map((l, idx) => (
            <Reveal
              key={l.href}
              trigger="mount"
              y={-8}
              delay={0.15 + idx * 0.05}
              duration={0.5}
            >
              <Link
                href={l.href}
                className="text-xs font-bold uppercase tracking-[0.16em] text-white/80 transition-colors hover:text-white"
              >
                {l.label}
              </Link>
            </Reveal>
          ))}
          <Reveal trigger="mount" y={-8} delay={0.4} duration={0.5}>
            <Link
              href="#quote"
              className="bg-knicks px-5 py-3 text-xs font-black uppercase tracking-[0.18em] text-white transition-colors hover:bg-knicks-600"
            >
              Get a Quote
            </Link>
          </Reveal>
           <Reveal trigger="mount" y={-8} delay={0.4} duration={0.5}>
            <Link
              href="/admin/products"
              className="bg-knicks px-5 py-3 text-xs font-black uppercase tracking-[0.18em] text-white transition-colors hover:bg-knicks-600"
            >
              View Products
            </Link>
          </Reveal>
        </nav>

        <Sheet>
          <SheetTrigger
            render={
              <button
                type="button"
                aria-label="Open menu"
                className="flex h-11 w-11 items-center justify-center border border-white/30 text-white lg:hidden"
              />
            }
          >
            <Menu className="h-[22px] w-[22px]" aria-hidden="true" />
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-full max-w-xs border-white/10 bg-navy-950 px-5 pt-16 text-white sm:max-w-sm [&>button]:text-white"
          >
            <SheetTitle className="sr-only">Menu</SheetTitle>
            <SheetDescription className="sr-only">
              Site navigation
            </SheetDescription>
            <nav aria-label="Mobile" className="flex flex-col">
              {links.map((l) => (
                <SheetClose
                  key={l.href}
                  nativeButton={false}
                  render={
                    <Link
                      href={l.href}
                      className="border-b border-white/10 py-4 font-display text-lg font-bold uppercase text-white"
                    />
                  }
                >
                  {l.label}
                </SheetClose>
              ))}
              <SheetClose
                nativeButton={false}
                render={
                  <Link
                    href="#quote"
                    className="mt-5 bg-knicks py-4 text-center font-bold uppercase tracking-widest text-white"
                  />
                }
              >
                Get a Quote
              </SheetClose>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </Reveal>
  );
}