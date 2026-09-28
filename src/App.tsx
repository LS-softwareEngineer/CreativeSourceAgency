import { useEffect, useRef, useState } from "react";
import logo from "./imports/logo.png";

const COLORS = {
  blue: "#002FA7",   // replacement for 17-1562 TCX — background & header
  sonic: "#D9DDE3",  // 13-4016 TPG — heading text
  green: "#F2552C",  // 17-1562 TCX Flame — body text
};

const NAV_LINKS = ["About", "Experience", "Services", "Testimonials", "Contact"];

function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <nav
      className="mobile-safe-nav fixed top-0 left-0 right-0 z-50 px-5 md:px-10 py-4"
      style={{
        background: "transparent",
      }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10"
        style={{
          height: "150px",
          background:
            "linear-gradient(to bottom, rgba(0,47,167,0.96) 0%, rgba(0,47,167,0.84) 28%, rgba(0,47,167,0.60) 52%, rgba(0,47,167,0.30) 72%, rgba(0,47,167,0.08) 88%, transparent 100%)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          maskImage:
            "linear-gradient(to bottom, black 0%, black 34%, rgba(0,0,0,0.82) 54%, rgba(0,0,0,0.48) 72%, rgba(0,0,0,0.14) 90%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, black 0%, black 34%, rgba(0,0,0,0.82) 54%, rgba(0,0,0,0.48) 72%, rgba(0,0,0,0.14) 90%, transparent 100%)",
        }}
      />
      <div className="flex items-center justify-between">
        <a href="#top" className="flex items-center shrink-0">
          <img
            src={logo}
            alt="Creative Source Agency logo"
            className="w-[60px] h-[60px] object-cover shrink-0"
          />
        </a>

        <ul className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map((item) => (
            <li key={item}>
              <a
                href={`#${item.toLowerCase()}`}
                className="text-xs uppercase transition-opacity hover:opacity-50"
                style={{
                  color: COLORS.sonic,
                  letterSpacing: "0.09em",
                  fontWeight: 500,
                }}
              >
                {item}
              </a>
            </li>
          ))}
        </ul>

        <button
          className="mobile-menu-toggle md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <span className="block w-6 h-px" style={{ background: "#F2552C" }} />
          <span className="block w-6 h-px" style={{ background: COLORS.sonic }} />
          <span className="block w-6 h-px" style={{ background: COLORS.sonic }} />
        </button>
      </div>

      {open && (
        <div
          className="md:hidden absolute top-full left-0 right-0 px-5 py-8 border-b flex flex-col gap-5"
          style={{
            background: COLORS.blue,
            borderColor: "#F2552C",
          }}
        >
          {NAV_LINKS.map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              onClick={() => setOpen(false)}
              className="uppercase text-lg"
              style={{ color: COLORS.sonic, letterSpacing: "0.05em" }}
            >
              {item}
            </a>
          ))}
        </div>
      )}
