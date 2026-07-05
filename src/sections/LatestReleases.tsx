import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const releases = [
  { title: 'Midnight Protocol', artist: 'Nova Reign', genre: 'Alternative', image: '/images/album-2.jpg' },
  { title: 'Ocean Mind', artist: 'VOLT', genre: 'Electronic', image: '/images/album-9.jpg' },
  { title: 'Lagos Nights', artist: 'Zuri Lagos', genre: 'Afrobeats', image: '/images/album-5.jpg' },
  { title: 'Golden Hour', artist: 'Aura Lewis', genre: 'Soul', image: '/images/album-11.jpg' },
  { title: 'Electric', artist: 'Mira Sol', genre: 'Dream Pop', image: '/images/album-7.jpg' },
  { title: 'Neon Void', artist: 'BRUNO', genre: 'Hip-Hop', image: '/images/album-6.jpg' },
  { title: 'Saturn', artist: 'Collective', genre: 'Jazz Fusion', image: '/images/album-8.jpg' },
  { title: 'Roots Deep', artist: 'Various', genre: 'Reggae', image: '/images/album-12.jpg' },
];

export default function LatestReleases() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  const labelRef = useRef<HTMLParagraphElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const catalogBtnRef = useRef<HTMLButtonElement>(null);
  const arrowRef = useRef<SVGSVGElement>(null);

  // Per-card refs
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const coverWrapRefs = useRef<Array<HTMLDivElement | null>>([]);
  const coverRefs = useRef<Array<HTMLImageElement | null>>([]);
  const titleRefs = useRef<Array<HTMLHeadingElement | null>>([]);
  const artistRefs = useRef<Array<HTMLParagraphElement | null>>([]);
  const badgeRefs = useRef<Array<HTMLSpanElement | null>>([]);

  /* ------------------------------------------------------------------
   * SCROLL-DRIVEN ANIMATIONS (section reveal, header, card entrance,
   * cover reveal, horizontal/vertical parallax, ambient floating)
   * ------------------------------------------------------------------ */
  useEffect(() => {
    const section = sectionRef.current;
    const cards = cardsRef.current;
    if (!section || !cards) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          isDesktop: '(min-width: 1024px)',
        },
        (context) => {
          const { isDesktop } = context.conditions as { isDesktop: boolean };
          const intensity = isDesktop ? 1 : 0.55;

          /* -------------------------------------------------------
           * 1. SECTION REVEAL
           * ----------------------------------------------------- */
          gsap.fromTo(
            section,
            {
              opacity: 0,
              y: 60 * intensity,
              scale: 0.98,
              filter: 'blur(12px)',
            },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              filter: 'blur(0px)',
              duration: 1.4,
              ease: 'power4.out',
              scrollTrigger: {
                trigger: section,
                start: 'top 88%',
                toggleActions: 'play none none reverse',
              },
            }
          );

          /* -------------------------------------------------------
           * 2. HEADER ANIMATION
           * ----------------------------------------------------- */
          const headerTl = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          });

          if (labelRef.current) {
            headerTl.fromTo(
              labelRef.current,
              { opacity: 0, y: 24, rotate: -2, filter: 'blur(6px)' },
              {
                opacity: 1,
                y: 0,
                rotate: 0,
                filter: 'blur(0px)',
                duration: 0.7,
                ease: 'power3.out',
              },
              0
            );
          }

          if (headingRef.current) {
            const words = headingRef.current.querySelectorAll('.releases-heading-word');
            headerTl.fromTo(
              words,
              { opacity: 0, y: 40, rotate: -3, filter: 'blur(8px)' },
              {
                opacity: 1,
                y: 0,
                rotate: 0,
                filter: 'blur(0px)',
                duration: 0.9,
                stagger: 0.12,
                ease: 'power4.out',
              },
              0.1
            );
          }

          if (catalogBtnRef.current) {
            headerTl.fromTo(
              catalogBtnRef.current,
              { opacity: 0, y: 20, filter: 'blur(6px)' },
              {
                opacity: 1,
                y: 0,
                filter: 'blur(0px)',
                duration: 0.7,
                ease: 'power3.out',
              },
              0.25
            );
          }

          /* -------------------------------------------------------
           * 3 & 4. CARD ENTRANCE + COVER REVEAL
           * ----------------------------------------------------- */
          cardRefs.current.forEach((card, i) => {
            if (!card) return;
            const cover = coverRefs.current[i];

            const cardTl = gsap.timeline({
              scrollTrigger: {
                trigger: section,
                start: 'top 85%',
                toggleActions: 'play none none reverse',
              },
            });

            cardTl.fromTo(
              card,
              {
                opacity: 0,
                x: 80 * intensity,
                y: 40 * intensity,
                scale: 0.9,
                rotateY: 12 * intensity,
                filter: 'blur(10px)',
                transformPerspective: 800,
              },
              {
                opacity: 1,
                x: 0,
                y: 0,
                scale: 1,
                rotateY: 0,
                filter: 'blur(0px)',
                duration: 1.05,
                delay: i * 0.09,
                ease: 'back.out(1.4)',
              },
              0
            );

            if (cover) {
              cardTl.fromTo(
                cover,
                {
                  scale: 1.2,
                  opacity: 0,
                  filter: 'blur(14px)',
                  clipPath: 'inset(15% round 12px)',
                },
                {
                  scale: 1,
                  opacity: 1,
                  filter: 'blur(0px)',
                  clipPath: 'inset(0% round 12px)',
                  duration: 1.2,
                  ease: 'power3.out',
                },
                i * 0.09 + 0.12
              );
            }

            // 8. Album info stagger: title -> artist -> genre badge
            const infoEls = [titleRefs.current[i], artistRefs.current[i], badgeRefs.current[i]].filter(
              Boolean
            );
            cardTl.fromTo(
              infoEls,
              { opacity: 0, y: 20, filter: 'blur(6px)' },
              {
                opacity: 1,
                y: 0,
                filter: 'blur(0px)',
                duration: 0.55,
                stagger: 0.08,
                ease: 'power3.out',
              },
              i * 0.09 + 0.3
            );

            // 7. Genre badge gets its own extra scale pop on top of the stagger above
            const badge = badgeRefs.current[i];
            if (badge) {
              cardTl.fromTo(
                badge,
                { scale: 0.85 },
                { scale: 1, duration: 0.4, ease: 'back.out(2)' },
                i * 0.09 + 0.3
              );
            }
          });

          /* -------------------------------------------------------
           * 13. VERTICAL SCROLL PARALLAX
           * ----------------------------------------------------- */
          gsap.to(cards, {
            y: -24 * intensity,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.2,
            },
          });

          cardRefs.current.forEach((card, i) => {
            const cover = coverRefs.current[i];
            if (!card) return;
            gsap.to(card, {
              y: -14 * intensity,
              ease: 'none',
              scrollTrigger: {
                trigger: card,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1.5,
              },
            });
            if (cover) {
              gsap.to(cover, {
                scale: 1.05,
                ease: 'none',
                scrollTrigger: {
                  trigger: card,
                  start: 'top bottom',
                  end: 'bottom top',
                  scrub: 1.5,
                },
              });
            }
          });

          /* -------------------------------------------------------
           * 9. HORIZONTAL SCROLL EXPERIENCE — cover moves slower
           * than its card while the row is scrolled horizontally,
           * giving a subtle depth/momentum feel.
           * ----------------------------------------------------- */
          const handleHorizontalScroll = () => {
            const scrollLeft = cards.scrollLeft;
            coverRefs.current.forEach((cover, i) => {
              const card = cardRefs.current[i];
              if (!cover || !card) return;
              // Cover drifts at ~35% of the card's own scroll delta,
              // creating a gentle parallax "lag" as the row moves.
              const lag = scrollLeft * 0.035 * intensity;
              gsap.to(cover, {
                x: -lag,
                duration: 0.6,
                ease: 'power3.out',
                overwrite: 'auto',
              });
            });
          };

          cards.addEventListener('scroll', handleHorizontalScroll, { passive: true });

          /* -------------------------------------------------------
           * 14. AMBIENT FLOATING ANIMATION
           * ----------------------------------------------------- */
          cardRefs.current.forEach((card, i) => {
            if (!card) return;
            gsap.to(card, {
              y: '+=6',
              duration: 3.4 + i * 0.25,
              ease: 'sine.inOut',
              yoyo: true,
              repeat: -1,
              delay: i * 0.3,
            });
            const cover = coverRefs.current[i];
            if (cover) {
              gsap.to(cover, {
                scale: '+=0.012',
                duration: 4 + i * 0.2,
                ease: 'sine.inOut',
                yoyo: true,
                repeat: -1,
                delay: i * 0.25,
              });
            }
          });

          return () => {
            cards.removeEventListener('scroll', handleHorizontalScroll);
          };
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  /* ------------------------------------------------------------------
   * PER-CARD INTERACTIONS — hover, magnetic cursor, mouse parallax
   * ------------------------------------------------------------------ */
  useEffect(() => {
    const cleanupFns: Array<() => void> = [];
    const isTouch = window.matchMedia('(hover: none)').matches;

    cardRefs.current.forEach((card, i) => {
      if (!card || isTouch) return;

      const cover = coverRefs.current[i];
      const title = titleRefs.current[i];
      const artist = artistRefs.current[i];
      const badge = badgeRefs.current[i];

      const xTo = gsap.quickTo(card, 'x', { duration: 0.6, ease: 'power3.out' });
      const yTo = gsap.quickTo(card, 'y', { duration: 0.6, ease: 'power3.out' });
      const rotateXTo = gsap.quickTo(card, 'rotateX', { duration: 0.6, ease: 'power3.out' });
      const rotateYTo = gsap.quickTo(card, 'rotateY', { duration: 0.6, ease: 'power3.out' });

      const coverXTo = cover ? gsap.quickTo(cover, 'x', { duration: 0.8, ease: 'power3.out' }) : null;
      const coverYTo = cover ? gsap.quickTo(cover, 'y', { duration: 0.8, ease: 'power3.out' }) : null;
      const titleXTo = title ? gsap.quickTo(title, 'x', { duration: 0.9, ease: 'power3.out' }) : null;
      const artistXTo = artist ? gsap.quickTo(artist, 'x', { duration: 0.9, ease: 'power3.out' }) : null;
      const badgeXTo = badge ? gsap.quickTo(badge, 'x', { duration: 0.9, ease: 'power3.out' }) : null;

      let hoverTl: gsap.core.Timeline | null = null;

      const handleEnter = () => {
        card.style.willChange = 'transform';
        if (cover) cover.style.willChange = 'transform';

        hoverTl?.kill();
        hoverTl = gsap.timeline();

        // 5. Card hover: lift, scale, glow
        hoverTl.to(
          card,
          {
            scale: 1.04,
            y: -10,
            boxShadow:
              '0 30px 60px -20px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.08)',
            duration: 0.6,
            ease: 'power3.out',
          },
          0
        );

        hoverTl.to(
          card,
          {
            '--release-glow-opacity': 1,
            duration: 0.5,
            ease: 'power2.out',
          } as gsap.TweenVars,
          0
        );

        // 6. Cover hover: zoom + gentle rotation
        if (cover) {
          hoverTl.to(
            cover,
            {
              scale: 1.1,
              rotate: 1,
              duration: 0.9,
              ease: 'power3.out',
            },
            0
          );
        }

        // 7. Genre badge hover: glow + scale
        if (badge) {
          hoverTl.to(
            badge,
            {
              scale: 1.08,
              boxShadow: '0 0 16px rgba(255,255,255,0.15)',
              borderColor: 'rgba(255,255,255,0.3)',
              duration: 0.4,
              ease: 'power2.out',
            },
            0.05
          );
        }
      };

      const handleLeave = () => {
        hoverTl?.kill();
        hoverTl = gsap.timeline();

        hoverTl.to(
          card,
          {
            scale: 1,
            y: 0,
            rotateX: 0,
            rotateY: 0,
            boxShadow: '0 0px 0px rgba(0,0,0,0)',
            '--release-glow-opacity': 0,
            duration: 0.6,
            ease: 'power3.inOut',
          } as gsap.TweenVars,
          0
        );

        if (cover) {
          hoverTl.to(cover, { scale: 1, rotate: 0, duration: 0.8, ease: 'power3.inOut' }, 0);
        }
        if (badge) {
          hoverTl.to(
            badge,
            {
              scale: 1,
              boxShadow: '0 0 0px rgba(255,255,255,0)',
              borderColor: 'rgba(255,255,255,0.08)',
              duration: 0.4,
              ease: 'power2.inOut',
            },
            0
          );
        }

        xTo(0);
        yTo(0);
        coverXTo?.(0);
        coverYTo?.(0);
        titleXTo?.(0);
        artistXTo?.(0);
        badgeXTo?.(0);

        card.style.willChange = 'auto';
        if (cover) cover.style.willChange = 'auto';
      };

      // 11 & 12. Magnetic cursor + mouse parallax
      const handleMove = (e: MouseEvent) => {
        const rect = card.getBoundingClientRect();
        const relX = (e.clientX - rect.left) / rect.width - 0.5;
        const relY = (e.clientY - rect.top) / rect.height - 0.5;

        xTo(relX * 8);
        yTo(relY * 8 - 10);
        rotateYTo(relX * 5);
        rotateXTo(-relY * 5);

        coverXTo?.(relX * 14);
        coverYTo?.(relY * 14);

        titleXTo?.(relX * 5);
        artistXTo?.(relX * 4);
        badgeXTo?.(relX * 3);
      };

      card.addEventListener('mouseenter', handleEnter);
      card.addEventListener('mouseleave', handleLeave);
      card.addEventListener('mousemove', handleMove);

      cleanupFns.push(() => {
        card.removeEventListener('mouseenter', handleEnter);
        card.removeEventListener('mouseleave', handleLeave);
        card.removeEventListener('mousemove', handleMove);
        hoverTl?.kill();
      });
    });

    return () => {
      cleanupFns.forEach((fn) => fn());
    };
  }, []);

  /* ------------------------------------------------------------------
   * FULL CATALOG BUTTON — hover arrow slide, text shift, glow
   * ------------------------------------------------------------------ */
  const handleCatalogEnter = () => {
    gsap.to(catalogBtnRef.current, {
      color: '#ffffff',
      x: 2,
      textShadow: '0 0 12px rgba(255,255,255,0.25)',
      duration: 0.3,
      ease: 'power2.out',
    });
    gsap.to(arrowRef.current, {
      x: 6,
      duration: 0.35,
      ease: 'power3.out',
    });
  };

  const handleCatalogLeave = () => {
    gsap.to(catalogBtnRef.current, {
      color: '#B8B8B8',
      x: 0,
      textShadow: '0 0 0px rgba(255,255,255,0)',
      duration: 0.3,
      ease: 'power2.inOut',
    });
    gsap.to(arrowRef.current, {
      x: 0,
      duration: 0.35,
      ease: 'power3.inOut',
    });
  };

  return (
    <section
      id="releases"
      ref={sectionRef}
      className="relative w-full bg-[#111111] border-t border-white/[0.06]"
      style={{ padding: 'clamp(80px, 10vh, 140px) 0' }}
    >
      <div style={{ padding: '0 clamp(1rem, 5vw, 4rem)' }}>
        <div className="max-w-[1400px] mx-auto">
          {/* Header */}
          <div className="flex items-end justify-between mb-12">
            <div>
              <p
                ref={labelRef}
                className="font-display text-xs font-medium tracking-[0.08em] uppercase text-[#B8B8B8] mb-2"
              >
                NEW MUSIC
              </p>
              <h2
                ref={headingRef}
                className="font-display font-bold text-white"
                style={{
                  fontSize: 'clamp(2rem, 5vw, 4rem)',
                  lineHeight: 1.0,
                  letterSpacing: '-0.02em',
                }}
              >
                <span className="releases-heading-word inline-block">Latest</span>{' '}
                <span className="releases-heading-word gradient-text inline-block">Releases</span>
              </h2>
            </div>
            <button
              ref={catalogBtnRef}
              onMouseEnter={handleCatalogEnter}
              onMouseLeave={handleCatalogLeave}
              className="hidden md:flex items-center gap-2 font-display text-sm font-medium text-[#B8B8B8]"
            >
              Full Catalog
              <ArrowRight ref={arrowRef} size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Horizontal Scroll */}
      <div
        ref={cardsRef}
        className="flex gap-5 overflow-x-auto scrollbar-hide snap-x snap-mandatory"
        style={{
          padding: '0 clamp(1rem, 5vw, 4rem)',
          paddingBottom: '20px',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {releases.map((release, i) => (
          <div
            key={i}
            ref={(el) => (cardRefs.current[i] = el)}
            className="release-card flex-shrink-0 snap-start group cursor-pointer"
            style={
              {
                width: '260px',
                transformStyle: 'preserve-3d',
                '--release-glow-opacity': 0,
              } as React.CSSProperties
            }
          >
            <div
              ref={(el) => (coverWrapRefs.current[i] = el)}
              className="relative aspect-square rounded-xl overflow-hidden"
            >
              <img
                ref={(el) => (coverRefs.current[i] = el)}
                src={release.image}
                alt={release.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="mt-3">
              <h3
                ref={(el) => (titleRefs.current[i] = el)}
                className="font-display text-[15px] font-medium text-white"
              >
                {release.title}
              </h3>
              <p ref={(el) => (artistRefs.current[i] = el)} className="text-[13px] text-[#B8B8B8] mt-1">
                {release.artist}
              </p>
              <span
                ref={(el) => (badgeRefs.current[i] = el)}
                className="inline-block mt-2 px-2.5 py-1 rounded-full border border-white/[0.08] text-[11px] text-[#B8B8B8]"
              >
                {release.genre}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}