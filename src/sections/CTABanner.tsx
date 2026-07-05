import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLenisContext } from '../hooks/useLenis';

gsap.registerPlugin(ScrollTrigger);

function VelocityText({ text }: { text: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const spanRefs = useRef<HTMLSpanElement[]>([]);
  const offsetsRef = useRef<number[]>([]);
  const rafRef = useRef<number>(0);
  const { lenis } = useLenisContext();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const spans = spanRefs.current.filter(Boolean);
    const total = spans.length;
    if (total === 0) return;

    const mid = (total - 1) / 2;
    offsetsRef.current = new Array(total).fill(0);

    const MAX_OFFSET = 50;
    const DAMPING = 0.001;
    const LERP = 0.1;

    function update() {
      // Read velocity from window scroll or fallback
      const velocity = lenis?.velocity ?? 0;

      for (let i = 0; i < total; i++) {
        const distFromCenter = Math.abs(i - mid) / mid || 0;
        const direction = i < mid ? -1 : 1;
        let targetOffset = velocity * DAMPING * distFromCenter * direction;
        targetOffset = Math.max(-MAX_OFFSET, Math.min(MAX_OFFSET, targetOffset));

        offsetsRef.current[i] += (targetOffset - offsetsRef.current[i]) * LERP;
        spans[i].style.transform = `translateY(${offsetsRef.current[i]}px)`;
      }

      rafRef.current = requestAnimationFrame(update);
    }

    rafRef.current = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(rafRef.current);
    };
  }, [lenis]);

  const chars = text.split('');

  return (
    <div ref={containerRef} className="relative">
      {/* Hidden original for sizing */}
      <span className="invisible" aria-hidden="true">
        {text}
      </span>
      {/* Visible split characters */}
      <span className="absolute inset-0 flex justify-center">
        {chars.map((char, i) => (
          <span
            key={i}
            ref={(el) => {
              if (el) spanRefs.current[i] = el;
            }}
            style={{
              display: 'inline-block',
              whiteSpace: 'pre',
              willChange: 'transform',
            }}
            className="gradient-text"
          >
            {char}
          </span>
        ))}
      </span>
    </div>
  );
}

export default function CTABanner() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-[#070707] overflow-hidden"
      style={{ padding: 'clamp(100px, 15vh, 180px) clamp(1rem, 5vw, 4rem)' }}
    >
      {/* Radial glow */}
      <div className="absolute inset-0 gradient-radial-glow opacity-60" />

      {/* Content */}
      <div
        ref={contentRef}
        className="relative z-10 max-w-[800px] mx-auto text-center opacity-0"
      >
        {/* Velocity-reactive headline */}
        <div
          className="font-display font-bold"
          style={{
            fontSize: 'clamp(3rem, 10vw, 8rem)',
            lineHeight: 1.0,
            letterSpacing: '-0.03em',
          }}
        >
          <VelocityText text="Stay Elev8ed" />
        </div>

        <p className="text-base text-[#B8B8B8] max-w-[420px] mx-auto mt-5" style={{ lineHeight: 1.6 }}>
          New drops, exclusive content, tour dates — direct to your inbox.
        </p>

        {/* Email Input */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full sm:w-[320px] px-5 py-3.5 rounded-full bg-white/5 border border-white/15 text-white placeholder-[#B8B8B8] text-sm outline-none focus:border-[#ff3c8f] transition-colors"
          />
          <button className="gradient-accent text-white font-display text-sm font-medium px-7 py-3.5 rounded-full hover:shadow-[0_0_24px_rgba(255,60,143,0.4)] transition-shadow duration-300 flex-shrink-0">
            Subscribe
          </button>
        </div>
      </div>
    </section>
  );
}
