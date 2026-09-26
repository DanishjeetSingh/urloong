// Building blocks for the thermal-receipt look shared by every page.

export function Printer({ busy = false }) {
  return (
    <div className="printer" aria-hidden="true">
      <span className={`printer-led${busy ? " is-busy" : ""}`} />
    </div>
  );
}

export function Paper({ className = "", children }) {
  return <div className={`paper ${className}`}>{children}</div>;
}

export function StoreHeader() {
  return (
    <div className="text-center">
      <p className="receipt-logo">URLOONG</p>
      <p>
        STORE #0o0 · OPEN 24/7
        <br />
        urloong.singhdan.me
      </p>
    </div>
  );
}

export function Rule() {
  return <hr className="receipt-rule" />;
}

// A left/right pair of receipt columns; the first child truncates if it runs long
export function Line({ className = "", children }) {
  return <div className={`receipt-line ${className}`}>{children}</div>;
}

export function Coupon({ title, children }) {
  return (
    <div className="coupon">
      <b>{title}</b>
      {children}
    </div>
  );
}

// Thin bar for every "0" in the hash, thick bar for every "o"
export function Barcode({ code }) {
  let x = 6;
  const bars = [...code].map((ch, i) => {
    const width = ch === "0" ? 1.4 : 3.2;
    const bar = <rect key={i} x={x.toFixed(1)} y="0" width={width} height="52" />;
    x += width + 1.6;
    return bar;
  });

  return (
    <svg
      viewBox={`0 0 ${(x + 6).toFixed(1)} 52`}
      preserveAspectRatio="none"
      fill="currentColor"
      aria-hidden="true"
      className="mt-3.5 mb-1 block h-[52px] w-full text-[#1D1D22]"
    >
      {bars}
    </svg>
  );
}
