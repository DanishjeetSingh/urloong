"use client";

import { useRef, useState } from "react";
import { StoreLeft, StoreRight } from "./StoreLayout";
import { Barcode, Coupon, Line, Paper, Printer, Rule, StoreHeader } from "./Receipt";

function formatRatio(inLength, outLength) {
  const ratio = outLength / inLength;
  return `${ratio >= 10 ? Math.round(ratio) : ratio.toFixed(1)}×`;
}

export default function UrlLongifier({ children }) {
  const inputRef = useRef(null);
  const [urlInput, setUrlInput] = useState("");
  const [receipt, setReceipt] = useState(null);
  const [error, setError] = useState("");
  const [printing, setPrinting] = useState(false);
  const [copyState, setCopyState] = useState(""); // "", "copied" or "selected"

  const handleSubmit = async (event) => {
    event.preventDefault();
    setReceipt(null);
    setError("");
    setCopyState("");

    const link = urlInput.trim();
    // Block links back to this site, including preview deployments and the old domain
    const ownHosts = [window.location.hostname, "urloong.singhdan.me", "urloong.com"];

    if (ownHosts.some((host) => link.includes(host))) {
      setError("Haha, nice try! Try another link.");
      return;
    }

    setPrinting(true);
    try {
      const response = await fetch("/l0o0ng", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: link }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(data.error || "An unknown error occurred");
        return;
      }

      const now = new Date();
      setReceipt({
        id: now.getTime(),
        link,
        url: data.url,
        hash: data.url.split("/").pop(),
        date: now.toLocaleDateString(),
        time: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      });
    } catch (error) {
      setError("Failed to fetch data from the server");
    } finally {
      setPrinting(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(receipt.url);
      setCopyState("copied");
    } catch {
      // Clipboard blocked: select the URL on the receipt so it can be copied by hand
      const range = document.createRange();
      range.selectNodeContents(document.getElementById("long-url"));
      window.getSelection().removeAllRanges();
      window.getSelection().addRange(range);
      setCopyState("selected");
    }
    setTimeout(() => setCopyState(""), 2000);
  };

  const handleReset = () => {
    setUrlInput("");
    setReceipt(null);
    setError("");
    setCopyState("");
    inputRef.current?.focus();
  };

  return (
    <>
      <StoreLeft>
        {children}
        <form onSubmit={handleSubmit} className="grid gap-2 border-2 border-ink bg-paper p-3.5">
          <label htmlFor="link" className="font-mono text-[11px] uppercase tracking-[0.08em]">
            Scan your link
          </label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              ref={inputRef}
              id="link"
              type="text"
              inputMode="url"
              autoComplete="off"
              spellCheck="false"
              required
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="wikipedia.org"
              className="min-w-0 flex-1 rounded-none border-2 border-ink bg-white px-3 py-3 font-mono text-[15px] text-ink placeholder:text-[#9A8F8B] focus-visible:border-cobalt focus-visible:outline-none"
            />
            <button
              type="submit"
              disabled={printing}
              className="cursor-pointer bg-cobalt px-5 py-3.5 text-[17px] leading-none font-bold text-white hover:bg-cobalt-deep disabled:cursor-wait disabled:opacity-75"
            >
              {printing ? "Printing…" : "Print receipt"}
            </button>
          </div>
          {error && (
            <p role="alert" className="font-mono text-[12.5px] leading-snug font-semibold text-void">
              VOID · {error}
            </p>
          )}
        </form>
        <p className="justify-self-start bg-blush py-0.5 font-mono text-[11px] leading-relaxed">
          Receipt paper is 80&nbsp;mm wide. Your link is not.
        </p>
      </StoreLeft>

      <StoreRight>
        <Printer busy={printing} />
        <div className="feed">
          {receipt ? (
            <LongReceipt
              key={receipt.id}
              receipt={receipt}
              copyState={copyState}
              onCopy={handleCopy}
              onReset={handleReset}
            />
          ) : (
            <ReadyReceipt printing={printing} />
          )}
        </div>
        <p className="sr-only" aria-live="polite">
          {receipt ? `Your loong URL is ready: ${receipt.url}` : ""}
        </p>
      </StoreRight>
    </>
  );
}

function ReadyReceipt({ printing }) {
  return (
    <Paper>
      <StoreHeader />
      <Rule />
      <p className="text-center text-[14.5px] font-extrabold">{printing ? "PRINTING…" : "READY"}</p>
      <p className="text-center">
        SCAN A LINK TO PRINT
        <br />
        YOUR RECEIPT
      </p>
      <Rule />
      <p className="text-center text-[10px] tracking-[0.12em]">NO LINK TOO SHORT</p>
    </Paper>
  );
}

function LongReceipt({ receipt, copyState, onCopy, onReset }) {
  const { link, url, hash, date, time } = receipt;
  const extra = url.length - link.length;

  return (
    <Paper className="paper-print">
      <StoreHeader />
      <Rule />
      <Line>
        <span>{date}</span>
        <span>{time}</span>
        <span>REG 99</span>
      </Line>
      <Rule />
      <Line>
        <span>LINK ({link})</span>
        <span>{link.length} CH</span>
      </Line>
      <Line>
        <span>LENGTHENING</span>
        <span>+{extra} CH</span>
      </Line>
      <Line>
        <span>0/o FILLING</span>
        <span>INCLUDED</span>
      </Line>
      <Rule />
      <Line className="text-[14.5px] font-extrabold">
        <span>TOTAL</span>
        <span>{url.length} CH</span>
      </Line>
      <Line>
        <span>YOU SAVED</span>
        <span>0 CH</span>
      </Line>
      <Rule />
      <p className="mb-1 font-bold">YOUR LOONG URL</p>
      <a
        id="long-url"
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="block text-[12px] font-semibold break-all text-[#1D1D22] hover:underline"
      >
        {url}
      </a>
      <Barcode code={hash} />
      <p className="text-center text-[8.5px] tracking-[0.14em] break-all">{hash}</p>
      <p className="mt-3 mb-1 text-center text-[15px] font-extrabold">
        *** {formatRatio(link.length, url.length)} LONGER ***
      </p>
      <div className="mt-2.5 flex flex-wrap justify-center gap-2">
        <button type="button" onClick={onCopy} className="receipt-btn bg-[#1D1D22] text-paper">
          {copyState === "copied" ? "Copied" : copyState === "selected" ? "Selected" : "Copy URL"}
        </button>
        <button type="button" onClick={onReset} className="receipt-btn">
          Start over
        </button>
      </div>
      <Rule />
      <Coupon title="0% OFF">your next URL</Coupon>
      <Coupon title="BUY 1 LINK">get {extra} characters free</Coupon>
      <Coupon title="FREE 0">
        with every <span className="normal-case">o</span>
      </Coupon>
      <p className="mt-3.5 text-center font-bold">
        THANK YOU FOR LENGTHENING
        <br />
        PLEASE COME BACK LONGER
      </p>
    </Paper>
  );
}
