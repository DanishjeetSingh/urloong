import Link from "next/link";

// Page frame: top bar, then a left column for the pitch and a right column for the receipt
export default function StoreLayout({ nav, children }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 pt-5 sm:px-8 sm:pt-7">
        <Link href="/" className="bg-blush py-1 font-mono text-[11.5px] uppercase tracking-[0.04em]">
          urloong.singhdan.me
        </Link>
        <Link
          href={nav.href}
          className="border-[1.5px] border-ink bg-paper px-3 py-2 font-mono whitespace-nowrap text-[11.5px] leading-none uppercase tracking-[0.04em] hover:bg-ink hover:text-paper"
        >
          {nav.label}
        </Link>
      </header>
      <main className="mx-auto grid w-full max-w-6xl flex-1 items-start gap-10 px-4 pt-8 pb-20 sm:px-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-14 lg:pt-12">
        {children}
      </main>
    </div>
  );
}

export function StoreLeft({ children }) {
  return <div className="grid content-start gap-5 lg:sticky lg:top-10">{children}</div>;
}

export function StoreRight({ children }) {
  return <div className="mx-auto w-full max-w-[340px] lg:mx-0">{children}</div>;
}
