import Link from "next/link";

export default function About() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-rose-400 to-red-500 min-w-full px-3">
      <div className="bg-white/45 max-w-lg p-5 rounded-xl text-center text-lg font-semibold backdrop-contrast-300">
        <p>
          The internet has way too many URL shorteners—so I made a URL longener instead.
          This website generates ridiculously long URLs, just for fun.
        </p>
        <p className="mt-4">
          On the tech side, it's a full-stack web app hosted on Vercel,
          built with Next.js (frontend), Node (backend), and Supabase (database).
        </p>
        <p className="mt-4">
          Like what you see? Found a bug? Hit me up at <br />
          <span className="text-indigo-800 hover:text-indigo-600">danishjeetsingh [at] gmail [dot] com</span>
        </p>
        <p className="mt-2">
          Check out more of my projects at <br />
          <a href="https://singhdan.me" className="text-indigo-800 hover:text-indigo-600">
            singhdan.me
          </a>
        </p>
      </div>
      <Link href="/" className="text-black font-bold mt-4 text-xl">
        go back.
      </Link>
    </div>
  );
}
