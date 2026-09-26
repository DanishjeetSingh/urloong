import StoreLayout, { StoreLeft, StoreRight } from "../../components/StoreLayout";
import { Line, Paper, Printer, Rule, StoreHeader } from "../../components/Receipt";

export const metadata = {
  title: "About | urloong.singhdan.me",
};

export default function About() {
  return (
    <StoreLayout nav={{ href: "/", label: "Back to store" }}>
      <StoreLeft>
        <h1 className="wordmark">about</h1>
        <p className="tagline">
          The internet has way too many URL shorteners, so I made a URL longener instead.{" "}
          <span className="tagline-mark">Just for fun.</span>
        </p>
      </StoreLeft>

      <StoreRight>
        <Printer />
        <div className="feed">
          <Paper>
            <StoreHeader />
            <Rule />
            <p className="text-center text-[14.5px] font-extrabold">STORE POLICY</p>
            <Rule />
            <Line>
              <span>URL SHORTENERS</span>
              <span>TOO MANY</span>
            </Line>
            <Line>
              <span>URL LONGENERS</span>
              <span>1</span>
            </Line>
            <Line>
              <span>PURPOSE</span>
              <span>FUN</span>
            </Line>
            <Rule />
            <p className="mb-1 font-bold">INGREDIENTS</p>
            <Line>
              <span>FRONTEND</span>
              <span>NEXT.JS</span>
            </Line>
            <Line>
              <span>BACKEND</span>
              <span>NODE</span>
            </Line>
            <Line>
              <span>DATABASE</span>
              <span>NEON</span>
            </Line>
            <Line>
              <span>HOSTING</span>
              <span>VERCEL</span>
            </Line>
            <Rule />
            <p className="mb-1 font-bold">LIKE IT? FOUND A BUG?</p>
            <p className="break-all">danishjeetsingh [at] gmail [dot] com</p>
            <Rule />
            <p className="mb-1 font-bold">MORE STORES</p>
            <a href="https://singhdan.me" className="font-semibold text-[#1D1D22] underline">
              singhdan.me
            </a>
            <Rule />
            <p className="text-center font-bold">
              THANK YOU FOR READING
              <br />
              THE FINE PRINT
            </p>
          </Paper>
        </div>
      </StoreRight>
    </StoreLayout>
  );
}
