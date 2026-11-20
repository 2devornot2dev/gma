"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const labelClass = "text-xs font-bold uppercase tracking-widest text-navy";

const fieldClass =
  "mt-2 h-auto w-full rounded-none border-steel-100 bg-steel-50 px-4 py-3 text-base shadow-none md:text-base focus-visible:border-navy focus-visible:ring-2 focus-visible:ring-navy/20";

// Native <select> keeps built-in required validation working with checkValidity().
const selectClass = cn(
  "mt-2 w-full border border-steel-100 bg-steel-50 px-4 py-3 text-base outline-none",
  "focus:border-navy focus:ring-2 focus:ring-navy/20",
);

type Status = "idle" | "error" | "success";

export function QuoteForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<Status>("idle");

  useEffect(() => {
    if (status === "success") successRef.current?.focus();
  }, [status]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = formRef.current;
    if (!form) return;

    if (!form.checkValidity()) {
      setStatus("error");
      form.querySelector<HTMLElement>(":invalid")?.focus();
      return;
    }

    const data = Object.fromEntries(new FormData(form));
    // TODO: send `data` to your API route / server action / email service.
    console.log("Quote request", data);
    setStatus("success");
  }

  if (status === "success") {
    return (
      <div
        ref={successRef}
        role="status"
        tabIndex={-1}
        className="border-t-4 border-knicks bg-white p-10 text-center text-steel-900 outline-none"
      >
        <h3 className="font-display text-2xl font-black uppercase text-navy">
          Request Received
        </h3>
        <p className="mt-3 text-steel">
          Thank you. A GMA trade specialist will contact you within one
          business day.
        </p>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      noValidate
      className="grid gap-5 bg-white p-6 text-steel-900 sm:grid-cols-2 sm:p-10"
    >
      <div>
        <Label htmlFor="name" className={labelClass}>Full Name *</Label>
        <Input id="name" name="name" required autoComplete="name" className={fieldClass} />
      </div>
      <div>
        <Label htmlFor="company" className={labelClass}>Company *</Label>
        <Input id="company" name="company" required autoComplete="organization" className={fieldClass} />
      </div>
      <div>
        <Label htmlFor="email" className={labelClass}>Email *</Label>
        <Input id="email" name="email" type="email" required autoComplete="email" className={fieldClass} />
      </div>
      <div>
        <Label htmlFor="phone" className={labelClass}>Phone</Label>
        <Input id="phone" name="phone" type="tel" autoComplete="tel" className={fieldClass} />
      </div>
      <div>
        <Label htmlFor="type" className={labelClass}>Inquiry Type *</Label>
        <select id="type" name="type" required defaultValue="" className={selectClass}>
          <option value="">Select one</option>
          <option>Import</option>
          <option>Export</option>
          <option>Logistics Only</option>
          <option>General Inquiry</option>
        </select>
      </div>
      <div>
        <Label htmlFor="product" className={labelClass}>Product *</Label>
        <select id="product" name="product" required defaultValue="" className={selectClass}>
          <option value="">Select one</option>
          <option>Beef</option>
          <option>Pork</option>
          <option>Poultry</option>
          <option>Mixed / Multiple</option>
        </select>
      </div>
      <div>
        <Label htmlFor="volume" className={labelClass}>Est. Volume (MT)</Label>
        <Input id="volume" name="volume" type="number" min={0} inputMode="numeric" className={fieldClass} />
      </div>
      <div>
        <Label htmlFor="destination" className={labelClass}>Destination Country</Label>
        <Input id="destination" name="destination" autoComplete="country-name" className={fieldClass} />
      </div>
      <div className="sm:col-span-2">
        <Label htmlFor="message" className={labelClass}>Details</Label>
        <Textarea
          id="message"
          name="message"
          rows={4}
          placeholder="Cuts, packaging, delivery timeline..."
          className={cn(fieldClass, "min-h-0")}
        />
      </div>

      {status === "error" && (
        <p role="alert" className="text-sm font-semibold text-red-700 sm:col-span-2">
          Please complete all required fields with a valid email.
        </p>
      )}

      <Button
        type="submit"
        className="h-auto rounded-none bg-knicks px-8 py-4 text-sm font-bold uppercase tracking-widest text-white hover:bg-knicks-600 focus-visible:ring-4 focus-visible:ring-knicks/30 sm:col-span-2"
      >
        Submit Quote Request
      </Button>
    </form>
  );
}