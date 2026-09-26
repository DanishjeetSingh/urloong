import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import StoreLayout from "../components/StoreLayout";
import UrlLongifier from "../components/UrlLongifier";

export default function Home() {
  return (
    <>
      <StoreLayout nav={{ href: "/about", label: "About" }}>
        <UrlLongifier>
          <h1 className="wordmark">urloong</h1>
          <p className="tagline">
            Comically loong URLs for your special website.{" "}
            <span className="tagline-mark">Printed while you wait.</span>
          </p>
        </UrlLongifier>
      </StoreLayout>
      <Analytics />
      <SpeedInsights />
    </>
  );
}
