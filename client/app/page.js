import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Link from "next/link";
import UrlLongifier from "../components/UrlLongifier";

export default function Home() {
  return (
    <div className="bg-gradient-to-r from-rose-400 to-red-500 min-h-screen min-w-full flex flex-col items-center justify-center px-3">
      <div className="bg-white/45 max-w-lg p-5 rounded-xl backdrop-contrast-300">
        <header className="text-center">
          <h1 className="text-3xl font-bold mb-3">urloong.com</h1>
          <h2 className="text-base font-medium font-mono mb-5">
            comically loong url for your special website!
          </h2>
          <UrlLongifier />
        </header>
      </div>
      <Link href="/about" className="text-black font-bold mt-4 text-xl">
        learn more.
      </Link>
      <Analytics />
      <SpeedInsights />
    </div>
  );
}