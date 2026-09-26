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
    icon: { url: "/icon.svg", type: "image/svg+xml" },
    apple: "/apple-icon.png",
  },
  manifest: "/manifest.json",
  // Link previews in iMessage, WhatsApp, Slack, Discord, X, etc.
  openGraph: {
    type: "website",
    url: "/",
    siteName: "urloong",
    title: "urloong: comically loong URLs",
    description: "Comically loong URLs for your special website. Printed while you wait.",
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: "The urloong wordmark next to a receipt printing a 99-character URL",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "urloong: comically loong URLs",
    description: "Comically loong URLs for your special website. Printed while you wait.",
    images: ["/og.jpg"],
  },
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
