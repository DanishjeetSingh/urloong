import { Bricolage_Grotesque, Martian_Mono } from "next/font/google";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  axes: ["opsz", "wdth"],
});

const martian = Martian_Mono({
  variable: "--font-martian",
  subsets: ["latin"],
  axes: ["wdth"],
});

export const metadata = {
  metadataBase: new URL("https://urloong.singhdan.me"),
  title: "URL longener | urloong.singhdan.me",
  description: "Generate comically long URLs for your special website!",
  icons: {
    icon: '/logo.svg',
  },
  manifest: "/manifest.json",
};

export const viewport = {
  themeColor: "#F1D3CA",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${bricolage.variable} ${martian.variable}`}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
