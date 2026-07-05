import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Menu, X } from 'lucide-react';

// ---------------------------------------------------------------------------
// Content
// ---------------------------------------------------------------------------

const NAV_LINKS = [
  { label: 'Artists', href: '#artists' },
  { label: 'Releases', href: '#releases' },
  { label: 'Videos', href: '#videos' },
  { label: 'Charts', href: '#charts' },
  { label: 'News', href: '#news' },
  { label: 'Merch', href: '#merch' },
] as const;

// ---------------------------------------------------------------------------
// Underlined nav link — animated hover indicator instead of a static CSS
// underline, so it matches the rest of the site's motion language.
// ---------------------------------------------------------------------------

function NavLink({ label, onClick }: { label: string; onClick: () => void }) {
  const underlineRef = useRef<HTMLSpanElement>(null);

  const handleEnter = () => {
    gsap.to(underlineRef.current, { scaleX: 1, duration: 0.3, ease: 'power2.out' });
  };
  const handleLeave = () => {
    gsap.to(underlineRef.current, { scaleX: 0, duration: 0.25, ease: 'power2.in' });
  };

  return (
    <button
      onClick={onClick}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      className="relative font-display text-[13px] font-medium tracking-[0.06em] uppercase text-[#B8B8B8] hover:text-white transition-colors duration-200"
    >
      {label}
      <span
        ref={underlineRef}
        className="absolute left-0 -bottom-1 h-[1.5px] w-full origin-left scale-x-0 bg-gradient-to-r from-[#ff3c8f] to-[#8d4dff]"
      />
    </button>
  );
}

// ---------------------------------------------------------------------------
// Navigation
// ---------------------------------------------------------------------------

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuLinksRef = useRef<HTMLDivElement>(null);

  // ---- Scroll state (adds the blurred background past 50px) -------------
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ---- Entrance animation: nav slides down and fades in on mount --------
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    gsap.fromTo(
      navRef.current,
      { y: -24, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', delay: 0.15 }
    );
  }, []);

  // ---- Mobile menu open/close animation ----------------------------------
  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const menu = menuRef.current;
    if (!menu) return;

    const links = gsap.utils.toArray<HTMLElement>('[data-menu-link]', menuLinksRef.current);

    if (mobileOpen) {
      menu.style.display = 'block';
      if (reduceMotion) {
        gsap.set(menu, { opacity: 1 });
        gsap.set(links, { opacity: 1, y: 0 });
      } else {
        gsap.fromTo(menu, { opacity: 0 }, { opacity: 1, duration: 0.25, ease: 'power1.out' });
        gsap.fromTo(
          links,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.4, stagger: 0.06, delay: 0.1, ease: 'power2.out' }
        );
      }
    } else if (menu.style.display === 'block') {
      if (reduceMotion) {
        menu.style.display = 'none';
      } else {
        gsap.to(menu, {
          opacity: 0,
          duration: 0.2,
          ease: 'power1.in',
          onComplete: () => {
            menu.style.display = 'none';
          },
        });
      }
    }
  }, [mobileOpen]);

  // ---- Lock body scroll while the mobile menu is open --------------------
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  // ---- Close on Escape -----------------------------------------------------
  useEffect(() => {
    if (!mobileOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileOpen]);

  const scrollTo = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <nav
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-50 h-[72px] flex items-center justify-between transition-colors duration-300 ${
          scrolled ? 'bg-[#070707]/85 backdrop-blur-[12px]' : 'bg-transparent'
        }`}
        style={{ padding: '0 clamp(1rem, 5vw, 4rem)' }}
      >
        {/* Logo */}
        <a href="#" className="font-display text-[20px] font-bold tracking-[0.12em] text-white">
          ELEV<span className="gradient-text">8</span>
        </a>

        {/* Center nav — desktop */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <NavLink key={link.label} label={link.label} onClick={() => scrollTo(link.href)} />
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          <button className="hidden md:block font-display text-[13px] font-medium tracking-[0.06em] uppercase text-[#B8B8B8] hover:text-white transition-colors duration-200">
            Sign In
          </button>
          <button className="hidden md:flex items-center gap-2 gradient-accent text-white font-display text-[13px] font-medium px-6 py-2.5 rounded-full transition-shadow duration-300 hover:shadow-[0_0_24px_rgba(255,60,143,0.4)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
            Get Started
          </button>
          <button
            className="md:hidden text-white p-2"
            onClick={() => setMobileOpen((open) => !open)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        ref={menuRef}
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        className="fixed inset-0 z-40 bg-[#070707]/95 backdrop-blur-xl pt-[72px] md:hidden"
        style={{ display: 'none', opacity: 0 }}
      >
        <div ref={menuLinksRef} className="flex flex-col items-center gap-8 pt-12">
          {NAV_LINKS.map((link) => (
            <button
              key={link.label}
              data-menu-link
              onClick={() => scrollTo(link.href)}
              className="font-display text-lg font-medium tracking-[0.06em] uppercase text-[#B8B8B8] hover:text-white transition-colors"
            >
              {link.label}
            </button>
          ))}
          <button
            data-menu-link
            className="gradient-accent text-white font-display text-sm font-medium px-8 py-3 rounded-full mt-4"
          >
            Get Started
          </button>
        </div>
      </div>
    </>
  );
}