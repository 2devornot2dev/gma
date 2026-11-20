export function Footer() {
  return (
    <footer className="bg-black py-10 text-white/60">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-5 sm:flex-row sm:items-center lg:px-8">
        <div className="flex items-center gap-3">
          <span
            className="flex h-8 w-8 items-center justify-center bg-knicks font-display text-sm font-black text-white"
            aria-hidden="true"
          >
            G
          </span>
          <span className="font-display text-lg font-black text-white">GMA</span>
        </div>
        <p className="text-xs uppercase tracking-widest">
          &copy; 2026 GMA Global Meat Trade. All rights reserved.
        </p>
      </div>
    </footer>
  );
}