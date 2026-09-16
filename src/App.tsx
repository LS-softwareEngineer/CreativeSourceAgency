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
          className="md:hidden flex flex-col gap-1.5 p-2"
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


    </nav>
  );
}

function RotatingHeroHeadline() {
  const [cursor, setCursor] = useState({ x: -500, y: -500, active: false });
  const [scrollShift, setScrollShift] = useState(0);
  const headlineRef = useRef(null);

  const LENS_RADIUS = 205;

  useEffect(() => {
    let frameId;
    let current = 0;
    let target = 0;

    const update = () => {
      current += (target - current) * 0.12;
      setScrollShift(current);

      if (Math.abs(target - current) > 0.001) {
        frameId = requestAnimationFrame(update);
      }
    };

    const handleScroll = () => {
      target = Math.min(window.scrollY / 360, 1);

      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(update);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(frameId);
    };
  }, []);

  const updateCursor = (event) => {
    if (!headlineRef.current) return;

    const rect = headlineRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Keep the lens visible while any part of the circle still overlaps
    // the actual headline bounds.
    const overlapsHeadline =
      x + LENS_RADIUS >= 0 &&
      x - LENS_RADIUS <= rect.width &&
      y + LENS_RADIUS >= 0 &&
      y - LENS_RADIUS <= rect.height;

    setCursor({ x, y, active: overlapsHeadline });
  };

  const hideCursor = () => {
    setCursor((current) => ({ ...current, active: false }));
  };

  const headlineStyle = {
    fontSize: "clamp(4.7rem, 13vw, 13rem)",
    fontWeight: 700,
    marginLeft: 0,
    paddingLeft: 0,
    textAlign: "left",
  };

  return (
    <div
      className="relative w-full"
      style={{ cursor: "none" }}
    >
      <svg
        aria-hidden="true"
        width="0"
        height="0"
        style={{ position: "absolute" }}
      >
        <defs>
          <filter id="heroGlassWarp" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.012 0.018"
              numOctaves="1"
              seed="7"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="5"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>
      <div
        className="absolute pointer-events-auto"
        onMouseMove={updateCursor}
        onMouseLeave={hideCursor}
        style={{
          inset: `-${LENS_RADIUS}px`,
          zIndex: 20,
        }}
      />

      <div
        ref={headlineRef}
        className="relative w-full"
      >
        {/* Base headline */}
        <h1
          className="uppercase leading-[0.82] tracking-[-0.065em] pointer-events-none"
          style={{
            ...headlineStyle,
            color: COLORS.green,
            WebkitMaskImage: cursor.active
              ? `radial-gradient(circle ${LENS_RADIUS}px at ${cursor.x}px ${cursor.y}px, transparent 0%, transparent calc(100% - 5px), rgba(0,0,0,0.28) calc(100% - 3px), rgba(0,0,0,0.72) calc(100% - 1px), black 100%)`
              : "linear-gradient(black, black)",
            maskImage: cursor.active
              ? `radial-gradient(circle ${LENS_RADIUS}px at ${cursor.x}px ${cursor.y}px, transparent 0%, transparent calc(100% - 5px), rgba(0,0,0,0.28) calc(100% - 3px), rgba(0,0,0,0.72) calc(100% - 1px), black 100%)`
              : "linear-gradient(black, black)",
          }}
        >
          <span
            className="block hero-line hero-line-1"
            style={{
              "--scroll-x": `${scrollShift * 185}px`,
            }}
          >
            Financial
          </span>
          <span
            className="block hero-line hero-line-2"
            style={{
              "--scroll-x": `${Math.max(0, (scrollShift - 0.18) / 0.82) * 160}px`,
            }}
          >
            clarity for
          </span>
          <span
            className="block hero-line hero-line-3"
            style={{
              "--scroll-x": `${Math.max(0, (scrollShift - 0.36) / 0.64) * 130}px`,
            }}
          >
            music.
          </span>
        </h1>

        {/* Light copy: exactly aligned with the base headline */}
        <h1
          aria-hidden="true"
          className="absolute inset-0 uppercase leading-[0.82] tracking-[-0.065em] pointer-events-none"
          style={{
            ...headlineStyle,
            color: "#D9DDE3",
            filter: "url(#heroGlassWarp) blur(3.6px)",
            WebkitTextStroke: "1px #D9DDE3",
            textShadow: "none",
            transform: "scale(1.018)",
            transformOrigin: `${cursor.x}px ${cursor.y}px`,
            WebkitMaskImage: cursor.active
              ? `radial-gradient(circle ${LENS_RADIUS}px at ${cursor.x}px ${cursor.y}px, black 0%, black calc(100% - 5px), rgba(0,0,0,0.72) calc(100% - 3px), rgba(0,0,0,0.28) calc(100% - 1px), transparent 100%)`
              : "radial-gradient(circle 0px at 0 0, transparent 100%)",
            maskImage: cursor.active
              ? `radial-gradient(circle ${LENS_RADIUS}px at ${cursor.x}px ${cursor.y}px, black 0%, black calc(100% - 5px), rgba(0,0,0,0.72) calc(100% - 3px), rgba(0,0,0,0.28) calc(100% - 1px), transparent 100%)`
              : "radial-gradient(circle 0px at 0 0, transparent 100%)",
          }}
        >
          <span
            className="block hero-line hero-line-1"
            style={{
              "--scroll-x": `${scrollShift * 185}px`,
            }}
          >
            Financial
          </span>
          <span
            className="block hero-line hero-line-2"
            style={{
              "--scroll-x": `${Math.max(0, (scrollShift - 0.18) / 0.82) * 160}px`,
            }}
          >
            clarity for
          </span>
          <span
            className="block hero-line hero-line-3"
            style={{
              "--scroll-x": `${Math.max(0, (scrollShift - 0.36) / 0.64) * 130}px`,
            }}
          >
            music.
          </span>
        </h1>
      </div>

      <style>{`
        .hero-line {
          --scroll-x: 0px;
          opacity: 0;
          transform: translateX(calc(82px + var(--scroll-x)));
          animation: heroLineIn 680ms cubic-bezier(0.18, 0.86, 0.3, 1) forwards;
          will-change: transform, opacity;
          transition: transform 180ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        .hero-line-1 {
          animation-delay: 50ms;
        }

        .hero-line-2 {
          animation-delay: 125ms;
        }

        .hero-line-3 {
          animation-delay: 200ms;
        }

        @keyframes heroLineIn {
          0% {
            opacity: 0;
            transform: translateX(calc(82px + var(--scroll-x)));
          }
          100% {
            opacity: 1;
            transform: translateX(var(--scroll-x));
          }
        }
      `}</style>
    </div>
  );
}

function Hero() {
  return (
    <section
      id="top"
      className="min-h-[62vh] md:min-h-[88vh] flex flex-col justify-between pt-24 px-5 md:px-10 pb-4 md:pb-7"
      style={{ background: COLORS.blue }}
    >
      <div className="pt-6">
        <p
          className="uppercase text-[10px] md:text-xs mb-4 md:mb-5"
          style={{
            color: "#D9DDE3",
            letterSpacing: "0.11em",
            marginLeft: 0,
            paddingLeft: 0,
            textAlign: "left",
          }}
        >
          Music Industry Financial Specialists
        </p>

        <RotatingHeroHeadline />
      </div>
    </section>
  );
}

function ScrollRevealHeading({ children, className = "", style = {} }) {
  const ref = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame;
    let current = 0;
    let target = 0;

    const animate = () => {
      current += (target - current) * 0.05;
      setProgress(current);

      if (Math.abs(target - current) > 0.001) {
        frame = requestAnimationFrame(animate);
      }
    };

    const updateTarget = () => {
      if (!ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      const viewport = window.innerHeight;

      // Begin just before the heading fully enters the viewport and
      // settle gently into place as it moves upward.
      const start = viewport * 1.02;
      const end = viewport * 0.38;
      const raw = (start - rect.top) / (start - end);

      target = Math.max(0, Math.min(1, raw));

      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(animate);
    };

    updateTarget();
    window.addEventListener("scroll", updateTarget, { passive: true });
    window.addEventListener("resize", updateTarget);

    return () => {
      window.removeEventListener("scroll", updateTarget);
      window.removeEventListener("resize", updateTarget);
      cancelAnimationFrame(frame);
    };
  }, []);

  const lines = Array.isArray(children) ? children : [children];

  return (
    <h2 ref={ref} className={className} style={style}>
      {lines.map((line, index) => {
        const stagger = index * 0.18;
        const lineProgress = Math.max(
          0,
          Math.min(1, (progress - stagger) / (1 - stagger))
        );

        const eased = lineProgress < 0.5
          ? 4 * lineProgress * lineProgress * lineProgress
          : 1 - Math.pow(-2 * lineProgress + 2, 3) / 2;
        const x = (1 - eased) * 54;

        return (
          <span
            key={index}
            className="block"
            style={{
              transform: `translateX(${x}px)`,
              willChange: "transform",
            }}
          >
            {line}
          </span>
        );
      })}
    </h2>
  );
}

function About() {
  return (
    <section
      id="about"
      style={{ background: COLORS.blue, position: "relative", zIndex: 5 }}
      className="px-5 md:px-10 pt-20 md:pt-28 pb-24 md:pb-36 -mt-8 md:-mt-12"
    >
      <div
        className="grid md:grid-cols-12 gap-8 border-t pt-5"
        style={{ borderColor: "#F2552C" }}
      >
        <div className="md:col-span-3">
          <p
            className="uppercase text-xs"
            style={{ color: COLORS.green, letterSpacing: "0.1em" }}
          >
            01 / About
          </p>
        </div>

        <div className="md:col-span-9">
          <div className="about-heading-reveal">
            <ScrollRevealHeading
              className="leading-[0.95] tracking-[-0.035em] max-w-5xl"
              style={{
                color: COLORS.sonic,
                fontSize: "clamp(2.9rem, 6.6vw, 6.8rem)",
                fontWeight: 600,
              }}
            >
              {["Expert Financial", "Leadership", "and Royalty Accounting", "for the Music Industry"]}
            </ScrollRevealHeading>
          </div>

          <div
            className="mt-16 md:mt-24 border-t pt-7"
            style={{ borderColor: "#F2552C" }}
          >
            <p
              className="text-base md:text-lg leading-relaxed max-w-4xl"
              style={{ color: COLORS.green }}
            >
              Founded by{" "}
              <strong style={{ color: COLORS.sonic, fontWeight: 500 }}>
                Will Dawson
              </strong>
              , Creative Source Agency brings more than two decades of senior
              financial leadership to record labels and music distributors. We
              combine royalty accounting, management reporting and hands-on
              financial control with a practical understanding of master
              rights, licensing and digital income.
            </p>
          </div>

          <div
            className="grid grid-cols-3 mt-16 md:mt-24 border-t"
            style={{ borderColor: "#F2552C" }}
          >
            {[
              ["20+", "Years' experience"],
              ["1,000+", "Labels managed"],
              ["700+", "Licensees served"],
            ].map(([number, label], index) => (
              <div
                key={label}
                className={`py-6 md:py-8 ${
                  index !== 0 ? "pl-5 md:pl-8 border-l" : ""
                }`}
                style={{
                  borderColor: "#F2552C",
                }}
              >
                <div
                  className="text-4xl md:text-6xl font-semibold tracking-tight"
                  style={{
                    color: "#D9DDE3",
                    fontFamily: "'Barlow Condensed', sans-serif",
                  }}
                >
                  {number}
                </div>
                <div
                  className="uppercase text-[10px] md:text-xs mt-2"
                  style={{
                    color: COLORS.green,
                    letterSpacing: "0.09em",
                  }}
                >
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const highlights = [
  {
    number: "01",
    company: "Republic of Music",
    role: "Financial Controller — 14 Years",
    text: "Built and led a dedicated four-person team managing monthly reporting for over 1,000 labels, semi-annual artist royalty statements for more than 700 licensees, and comprehensive monthly management accounts.",
  },
  {
    number: "02",
    company: "Defected Records, RAM Records & Breakbeat Kaos",
    role: "Royalty Accounting",
    text: "Provided accurate, time-critical artist royalty accounting and built robust monthly management accounts to keep these iconic labels moving forward.",
  },
  {
    number: "03",
    company: "Play It Again Sam",
    role: "Specialist Project Accountant",
    text: "Handled intricate royalty reporting and successfully integrated financial systems for a mobile/ringtone subsidiary.",
  },
];

function Experience() {
  return (
    <section id="experience" className="px-5 md:px-10 py-24 md:py-36" style={{ background: COLORS.green }}>
      <div className="grid md:grid-cols-12 gap-8 border-t pt-6" style={{ borderColor: COLORS.blue }}>
        <div className="md:col-span-3">
          <p className="uppercase text-xs" style={{ color: COLORS.blue, letterSpacing: "0.1em" }}>
            02 / Experience
          </p>
        </div>
        <div className="md:col-span-9">
          <ScrollRevealHeading
            className="leading-[0.92] tracking-[-0.04em] max-w-5xl"
            style={{
              color: COLORS.blue,
              fontSize: "clamp(3rem, 7.5vw, 7.5rem)",
              fontWeight: 600,
            }}
          >
            {["Two decades inside", "independent music."]}
          </ScrollRevealHeading>
        </div>
      </div>

      <div className="mt-20 md:mt-28 border-t" style={{ borderColor: COLORS.blue }}>
        {highlights.map((item) => (
          <div
            key={item.company}
            className="grid md:grid-cols-12 gap-6 md:gap-8 py-8 md:py-10 border-b"
            style={{ borderColor: COLORS.blue }}
          >
            <div className="md:col-span-1 text-sm" style={{ color: COLORS.blue }}>
              {item.number}
            </div>
            <div className="md:col-span-4">
              <h3 className="text-2xl md:text-4xl leading-tight font-semibold" style={{ color: COLORS.blue }}>
                {item.company}
              </h3>
            </div>
            <div className="md:col-span-3">
              <p className="uppercase text-xs leading-relaxed" style={{ color: COLORS.blue, letterSpacing: "0.08em" }}>
                {item.role}
              </p>
            </div>
            <div className="md:col-span-4">
              <p className="leading-relaxed text-sm md:text-base" style={{ color: COLORS.blue }}>
                {item.text}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

const services = [
  ["01", "Royalty Income Tracking & Reporting", "Ensuring every stream, download and physical sale is accurately accounted for."],
  ["02", "Fractional Financial Controller", "Senior-level financial oversight tailored to the scale and needs of your business."],
  ["03", "Management Accounts", "Monthly insight into profitability, cash flow and the numbers that matter most."],
  ["04", "MCPS Reporting", "Specialist mechanical copyright tracking and reporting."],
  ["05", "General Accounting", "Reliable day-to-day bookkeeping and financial upkeep."],
  ["06", "Making Tax Digital & Tax Returns", "Straightforward HMRC compliance to keep your business fully up to date."],
];

function Services() {
  return (
    <section id="services" className="px-5 md:px-10 py-24 md:py-36" style={{ background: COLORS.blue }}>
      <div className="grid md:grid-cols-12 gap-8 border-t pt-6" style={{ borderColor: "#F2552C" }}>
        <div className="md:col-span-3">
          <p className="uppercase text-xs" style={{ color: "#D9DDE3", letterSpacing: "0.1em" }}>
            03 / Services
          </p>
        </div>
        <div className="md:col-span-9">
          <ScrollRevealHeading
            className="leading-[0.92] tracking-[-0.04em] max-w-5xl"
            style={{
              color: "#F2552C",
              fontSize: "clamp(3rem, 8vw, 8rem)",
              fontWeight: 600,
            }}
          >
            {["Services we", "provide."]}
          </ScrollRevealHeading>
        </div>
      </div>

      <div
        className="mt-20 md:mt-28 grid grid-cols-2 lg:grid-cols-3 border-t border-l"
        style={{ borderColor: "#F2552C" }}
      >
        {services.map(([number, title, desc]) => (
          <div
            key={number}
            className="service-card group min-h-[160px] md:min-h-[300px] p-4 md:p-8 border-r border-b flex flex-col justify-between"
            style={{
              borderColor: "#F2552C",
              background: "transparent",
              color: "#D9DDE3",
            }}
          >
            <div className="flex items-start justify-between gap-4">
              <span
                className="text-[11px] uppercase"
                style={{ color: "#D9DDE3", letterSpacing: "0.1em" }}
              >
                {number}
              </span>
              <span
                className="text-lg transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                className="service-text transition-colors duration-300" style={{ color: "inherit" }}
              >
                ↗
              </span>
            </div>

            <div>
              <h3
                className="text-base md:text-3xl font-medium leading-[1.1] tracking-[-0.02em] mb-2 md:mb-5"
                style={{ color: "#D9DDE3" }}
              >
                {title}
              </h3>
              <p
                className="hidden md:block text-sm md:text-[15px] leading-relaxed max-w-sm service-text transition-colors duration-300"
                style={{ color: "inherit" }}
              >
                {desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .service-card {
          position: relative;
          overflow: hidden;
          isolation: isolate;
        }

        .service-card::before {
          content: "";
          position: absolute;
          top: -4%;
          bottom: -4%;
          left: -10%;
          width: 120%;
          background: #F2552C;
          transform: translateX(-106%);
          filter: blur(6px);
          will-change: transform, filter;
          transition:
            transform 760ms cubic-bezier(0.22, 1, 0.36, 1),
            filter 760ms ease;
          z-index: 0;
        }

        .service-card:hover::before {
          transform: translateX(0);
          filter: blur(1px);
        }

        .service-card > * {
          position: relative;
          z-index: 1;
        }

        .service-card:hover h3 {
          color: #002FA7 !important;
        }

        .service-card .service-text,
        .service-card > * {
          background-image: linear-gradient(
            90deg,
            #002FA7 0%,
            #002FA7 50%,
            #D9DDE3 50%,
            #D9DDE3 100%
          );
          background-size: 205% 100%;
          background-position: 100% 0;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent !important;
          transition:
            background-position 650ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        .service-card:hover .service-text,
        .service-card:hover > * {
          background-position: 0 0;
        }


      `}</style>
    </section>
  );
}

const testimonials = [
  {
    quote: "That's a huge weight off my mind knowing you are managing our royalty accounting.",
    name: "Ann",
    label: "Deltasonic Records",
  },
  {
    quote: "Will worked with Republic of Music for 15 years and was a solid team member bringing the expertise we needed to build the company.",
    name: "Mark McQuillan",
    label: "Republic of Music",
  },
  {
    quote: "Will was very knowledgeable and managed our royalty accounting for BBK for several years.",
    name: "Dan Stein",
    label: "DJ Fresh / Breakbeat Kaos",
  },
];


const SCRAMBLE_CHARS = "0123456789£$€¥%+-=./";

function ScrambleText({ text, trigger }) {
  const [display, setDisplay] = useState(text);
  const frameRef = useRef(null);

  useEffect(() => {
    let frame = 0;
    const totalFrames = 48;

    const animate = () => {
      frame += 1;
      const progress = frame / totalFrames;
      const revealCount = Math.floor(text.length * progress);

      const scrambled = text
        .split("")
        .map((char, index) => {
          if (char === " ") return " ";
          if (index < revealCount) return char;

          // Preserve punctuation and use narrower accounting characters
          // so the scramble does not force the quote onto an extra line.
          if (/[^A-Za-z0-9]/.test(char)) return char;

          const narrowChars = "0123456789+-=/";
          return narrowChars[
            Math.floor(Math.random() * narrowChars.length)
          ];
        })
        .join("");

      setDisplay(scrambled);

      if (frame < totalFrames) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        setDisplay(text);
      }
    };

    setDisplay(
      text
        .split("")
        .map((char) => {
          if (char === " ") return " ";
          if (/[^A-Za-z0-9]/.test(char)) return char;
          const narrowChars = "0123456789+-=/";
          return narrowChars[
            Math.floor(Math.random() * narrowChars.length)
          ];
        })
        .join("")
    );

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [text, trigger]);

  return <>{display}</>;
}

function Testimonials() {
  const [active, setActive] = useState(0);
  const [sliderReset, setSliderReset] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((current) => (current + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [sliderReset]);

  const previous = () => {
    setActive((current) =>
      current === 0 ? testimonials.length - 1 : current - 1
    );
    setSliderReset((value) => value + 1);
  };

  const next = () => {
    setActive((current) => (current + 1) % testimonials.length);
    setSliderReset((value) => value + 1);
  };

  const testimonial = testimonials[active];

  return (
    <section
      id="testimonials"
      className="px-5 md:px-10 py-24 md:py-36 overflow-hidden"
      style={{ background: "#F2552C" }}
    >
      <div
        className="grid md:grid-cols-12 gap-8 border-t pt-6"
        style={{ borderColor: COLORS.blue }}
      >
        <div className="md:col-span-3">
          <p
            className="uppercase text-xs"
            style={{ color: COLORS.blue, letterSpacing: "0.1em" }}
          >
            04 / Testimonials
          </p>
        </div>

        <div className="md:col-span-9">
          <div className="flex items-center justify-end gap-5 mb-10 md:mb-14">
            <div
              className="text-[10px] uppercase"
              style={{
                color: COLORS.blue,
                letterSpacing: "0.1em",
                opacity: 0.55,
              }}
            >
              {String(active + 1).padStart(2, "0")} /{" "}
              {String(testimonials.length).padStart(2, "0")}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={previous}
                aria-label="Previous testimonial"
                className="text-2xl transition-all duration-200 hover:-translate-x-1"
                style={{ color: COLORS.blue }}
              >
                ←
              </button>

              <div
                className="w-16 h-px"
                style={{ background: COLORS.blue, opacity: 0.35 }}
              />

              <button
                onClick={next}
                aria-label="Next testimonial"
                className="text-2xl transition-all duration-200 hover:translate-x-1"
                style={{ color: COLORS.blue }}
              >
                →
              </button>
            </div>
          </div>

          <div
            className="relative h-[260px] sm:h-[285px] md:h-auto"
            style={{
              minHeight: "clamp(260px, 28vw, 420px)",
              overflow: "hidden",
            }}
          >
            <blockquote
              key={`quote-${active}`}
              className="testimonial-quote leading-[1.02] tracking-[-0.03em] absolute inset-0"
              style={{
                color: COLORS.blue,
                fontSize: "clamp(2.5rem, 5.5vw, 5.5rem)",
                fontWeight: 500,
                fontVariantNumeric: "tabular-nums",
                letterSpacing: "-0.03em",
                overflowWrap: "normal",
                wordBreak: "normal",
                animation: "testimonialFade 0.95s cubic-bezier(0.22, 1, 0.36, 1)",
              }}
            >
              "<ScrambleText text={testimonial.quote} trigger={active} />"
            </blockquote>
          </div>

          <div
            className="mt-5 md:mt-12 flex flex-col sm:flex-row sm:items-end justify-between gap-8 border-t pt-5"
            style={{ borderColor: COLORS.blue }}
          >
            <div
              key={`testimonial-credit-${active}`}
              className="testimonial-credit"
            >
              <div
                className="text-lg font-semibold"
                style={{ color: COLORS.blue }}
              >
                {testimonial.name}
              </div>
              <div className="text-sm" style={{ color: COLORS.blue }}>
                {testimonial.label}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 767px) {
          #testimonials .testimonial-quote {
            font-size: clamp(1.6rem, 7.2vw, 2rem) !important;
            line-height: 1.04;
          }
        }

        @keyframes testimonialFade {
          0% {
            opacity: 0.15;
            filter: blur(8px);
          }
          18% {
            opacity: 0.5;
            filter: blur(3px);
          }
          32% {
            opacity: 0.78;
            filter: blur(1px);
          }
          45% {
            opacity: 0.94;
            filter: blur(0);
          }
          100% {
            opacity: 1;
            filter: blur(0);
          }
        }

        .testimonial-credit {
          opacity: 0;
          transform: translateX(48px);
          animation: testimonialCreditIn 620ms cubic-bezier(0.22, 1, 0.36, 1) 120ms forwards;
          will-change: transform, opacity;
        }

        @keyframes testimonialCreditIn {
          0% {
            opacity: 0;
            transform: translateX(48px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </section>
  );
}

function Contact() {
  return (
    <section
      id="contact"
      className="px-5 md:px-10 py-24 md:py-36"
      style={{ background: "#002FA7" }}
    >
      <div
        className="grid md:grid-cols-12 gap-8 border-t pt-6"
        style={{ borderColor: "#F2552C" }}
      >
        <div className="md:col-span-3">
          <p
            className="uppercase text-xs"
            style={{ color: "#F2552C", letterSpacing: "0.1em" }}
          >
            05 / Contact
          </p>
        </div>

        <div className="md:col-span-9">
          <ScrollRevealHeading
            className="leading-[0.9] tracking-[-0.045em] max-w-5xl"
            style={{
              color: "#F2552C",
              fontSize: "clamp(3.8rem, 9vw, 9rem)",
              fontWeight: 600,
            }}
          >
            {["Let’s talk", "numbers."]}
          </ScrollRevealHeading>

          <div
            className="grid md:grid-cols-12 gap-8 md:gap-10 mt-16 md:mt-24 border-t pt-7"
            style={{ borderColor: "#F2552C" }}
          >
            <div className="md:col-span-5">
              <div className="space-y-5">
                <a
                  href="mailto:will@creativesourceagency.com"
                  className="group block"
                >
                  <div
                    className="uppercase text-[10px] mb-1"
                    style={{
                      color: "#F2552C",
                      letterSpacing: "0.1em",
                      opacity: 0.55,
                    }}
                  >
                    Email
                  </div>
                  <div
                    className="text-xl md:text-2xl border-b pb-2 transition-opacity group-hover:opacity-55"
                    style={{
                      color: "#F2552C",
                      borderColor: "#F2552C",
                    }}
                  >
                    will@creativesourceagency.com
                  </div>
                </a>

                <a
                  href="tel:07929587585"
                  className="group block"
                >
                  <div
                    className="uppercase text-[10px] mb-1"
                    style={{
                      color: "#F2552C",
                      letterSpacing: "0.1em",
                      opacity: 0.55,
                    }}
                  >
                    Mobile
                  </div>
                  <div
                    className="text-xl md:text-2xl border-b pb-2 transition-opacity group-hover:opacity-55"
                    style={{
                      color: "#F2552C",
                      borderColor: "#F2552C",
                    }}
                  >
                    07929 587585
                  </div>
                </a>
              </div>
            </div>

            <div className="md:col-span-5 md:col-start-8">
              <p
                className="text-base md:text-lg leading-relaxed max-w-lg"
                style={{ color: "#F2552C" }}
              >
                Senior financial experience, delivered with the flexibility and
                personal approach of an independent team.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer
      className="px-5 md:px-10 py-10 md:py-12 border-t"
      style={{ background: COLORS.blue, borderColor: "#F2552C" }}
    >
      <div className="flex flex-col md:flex-row gap-8 md:items-center md:justify-between">
        <div className="flex items-center">
          <img
            src={logo}
            alt="Creative Source Agency"
            className="w-[96px] h-[96px] md:w-[72px] md:h-[72px] object-cover"
          />
        </div>

        <div className="flex flex-col items-start gap-3 md:flex-row md:flex-wrap md:gap-x-8 md:gap-y-3">
          {NAV_LINKS.map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="uppercase shrink-0 text-xs md:text-sm hover:opacity-50 transition-opacity"
              style={{ color: COLORS.green, letterSpacing: "0.07em" }}
            >
              {item}
            </a>
          ))}
        </div>

        <div
          className="text-xs md:text-sm uppercase"
          style={{ color: COLORS.green, letterSpacing: "0.08em" }}
        >
          © {new Date().getFullYear()} Creative Source Agency
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <div
      className="site-root"
      style={{ fontFamily: "'Outfit', sans-serif", background: COLORS.blue }}
    >
      <style>{`
        /* Mobile camera / notch clearance */
        @media (max-width: 767px) {
          .mobile-safe-nav {
            padding-top: max(2.25rem, calc(env(safe-area-inset-top, 0px) + 1rem));
          }
        }

        @media (min-width: 768px) {
          .mobile-safe-nav {
            padding-top: 1rem;
          }
        }

        /* Small and supporting copy — 13-4016 TPG */
        .site-root p,
        .site-root a,
        .site-root li,
        .site-root button,
        .site-root footer div,
        .site-root section span:not(.hero-line) {
          color: #D9DDE3;
        }

        /* Numbered section headers 01–05 — 13-4016 TPG */
        #about > div > div:first-child p,
        #experience > div:first-child > div:first-child p,
        #services > div:first-child > div:first-child p,
        #testimonials > div:first-child > div:first-child p,
        #contact > div:first-child > div:first-child p {
          color: #D9DDE3 !important;
        }

        /* Experience roles + tools — 13-4016 TPG */
        #experience .md\\:col-span-3 p,
        #experience .mt-14 span {
          color: #D9DDE3 !important;
        }

        /* Main headings on Flame / dark sections — 17-1562 TCX */
        #top h1,
        #about h2,
        #services h2 {
          color: #F2552C !important;
        }

        /* Main headings on burgundy / light contrasting sections — #002FA7 */
        #experience h2,
        #testimonials blockquote {
          color: #002FA7 !important;
        }

        #contact h2 {
          color: #F2552C !important;
        }

        #contact p,
        #contact a,
        #contact div,
        #contact span {
          color: #F2552C !important;
        }

        /* Preserve the hero lens light reveal */
        #top h1[aria-hidden="true"] {
          color: #D9DDE3 !important;
        }

        /* Service card headings follow the light small-text colour,
           then switch to #002FA7 on the burgundy hover background. */
        #services .service-card h3 {
          color: #D9DDE3 !important;
          transition: color 500ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        #services .service-card:hover h3 {
          color: #002FA7 !important;
        }
      `}</style>
      <Nav />
      <Hero />
      <About />
      <Experience />
      <Services />
      <Testimonials />
      <Contact />
      <Footer />
    </div>
  );
}
