import Link from "next/link";
import StoreLayout, { StoreLeft, StoreRight } from "../components/StoreLayout";
import { Line, Paper, Printer, Rule, StoreHeader } from "../components/Receipt";

export default function NotFound() {
  return (
    <StoreLayout nav={{ href: "/", label: "Back to store" }}>
      <StoreLeft>
        <h1 className="wordmark">404</h1>
        <p className="tagline">
          This page isn&apos;t on the shelf. <span className="tagline-mark">Try the store instead.</span>
        </p>
        <Link
          href="/"
          className="justify-self-start bg-cobalt px-5 py-3.5 text-[17px] leading-none font-bold text-white hover:bg-cobalt-deep"
        >
          Go to the store
        </Link>
      </StoreLeft>

      <StoreRight>
        <Printer />
        <div className="feed">
          <Paper>
            <StoreHeader />
            <Rule />
            <Line>
              <span>ITEM</span>
              <span>NOT FOUND</span>
            </Line>
            <Line>
              <span>ERROR</span>
              <span>404</span>
            </Line>
            <Rule />
            <Line className="text-[14.5px] font-extrabold">
              <span>TOTAL</span>
              <span>0 CH</span>
            </Line>
            <Rule />
            <p className="text-center font-bold">
              THIS TRANSACTION
              <br />
              HAS BEEN VOIDED
            </p>
            <span className="void-stamp" aria-hidden="true">VOID</span>
          </Paper>
        </div>
      </StoreRight>
    </StoreLayout>
  );
}
