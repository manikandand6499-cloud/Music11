import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const genres = [
  'Hip-Hop', 'R&B', 'Electronic', 'Afrobeats', 'Pop', 'Rock',
  'Jazz', 'Soul', 'Indie', 'Latin', 'Classical', 'Reggae',
];

// Heading split into individually-animatable words. Kept as data so the
// JSX below stays declarative and the gradient word keeps its exact class.
const HEADING_WORDS: { text: string; gradient?: boolean }[] = [
  { text: 'Explore' },
  { text: 'Genres', gradient: true },
];

export default function ExploreGenres() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const bgImgRef = useRef<HTMLImageElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const contentInnerRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const bg = bgRef.current;
    const bgImg = bgImgRef.current;
    const content = contentRef.current;
    const contentInner = contentInnerRef.current;
    if (!section || !bg || !bgImg || !content || !contentInner) return;

    const mm = gsap.matchMedia();

    const ctx = gsap.context(() => {
      mm.add(
        {
          reduceMotion: '(prefers-reduced-motion: reduce)',
          isMobile: '(max-width: 767px)',
          isFinePointer: '(pointer: fine)',
        },
        (context) => {
          const { reduceMotion, isMobile, isFinePointer } = context.conditions as {
            reduceMotion: boolean;
            isMobile: boolean;
            isFinePointer: boolean;
          };

          const words = contentInner.querySelectorAll<HTMLElement>('[data-word]');
          const pills = contentInner.querySelectorAll<HTMLElement>('.genre-pill');
          const cleanupFns: Array<() => void> = [];

          // -----------------------------------------------------------------
          // Reduced motion: show final state immediately, skip all motion.
          // -----------------------------------------------------------------
          if (reduceMotion) {
            gsap.set([content, contentInner, subtitleRef.current], {
              opacity: 1,
              y: 0,
              x: 0,
              scale: 1,
              filter: 'blur(0px)',
            });
            gsap.set(words, { opacity: 1, y: 0, rotate: 0 });
            gsap.set(pills, { opacity: 1, y: 0, scale: 1 });
            return;
          }

          // Softer motion on small screens — same choreography, less travel.
          const power = isMobile ? 0.55 : 1;

          gsap.set([bg, content, contentInner], { willChange: 'transform, opacity, filter' });
          gsap.set(pills, { willChange: 'transform' });

          // -----------------------------------------------------------------
          // Background: parallax drift + slow zoom, tied to scroll position.
          // -----------------------------------------------------------------
          const bgScrollTween = gsap.to(bg, {
            yPercent: -20 * power,
            scale: 1 + 0.08 * power,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          });

          // Ambient floating drift on the image itself — independent of
          // scroll, gives the background a slow, luxurious "breathing" feel.
          const bgFloatTween = gsap.to(bgImg, {
            x: 8 * power,
            y: 12 * power,
            duration: 7,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
          });

          // -----------------------------------------------------------------
          // Content: slight upward drift while the section scrolls by, plus
          // subtle mouse parallax — different transform axes, so the two
          // never fight for the same property.
          // -----------------------------------------------------------------
          const contentScrollTween = gsap.to(content, {
            y: -30 * power,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          });

          if (isFinePointer) {
            const handleSectionMove = (e: MouseEvent) => {
              const rect = section.getBoundingClientRect();
              const nx = (e.clientX - rect.left) / rect.width - 0.5;
              const ny = (e.clientY - rect.top) / rect.height - 0.5;
              gsap.to(content, {
                x: nx * 14,
                rotateZ: nx * 0.6,
                duration: 1,
                ease: 'power3.out',
                overwrite: 'auto',
              });
              gsap.to(bgImg, {
                x: `+=${nx * 0.001}`, // negligible nudge, keeps float tween owning x
                duration: 1.2,
                ease: 'power3.out',
              });
            };
            section.addEventListener('mousemove', handleSectionMove);
            cleanupFns.push(() => section.removeEventListener('mousemove', handleSectionMove));
          }

          // -----------------------------------------------------------------
          // Master entrance timeline — cinematic reveal, then heading,
          // subtitle, and pills each pick up where the last leaves off.
          // -----------------------------------------------------------------
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              start: 'top 75%',
              toggleActions: 'play none none none',
            },
          });

          tl.fromTo(
            contentInner,
            { opacity: 0, y: 60 * power, scale: 0.96, filter: 'blur(14px)' },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              filter: 'blur(0px)',
              duration: 1.1,
              ease: 'power3.out',
            }
          )
            .fromTo(
              words,
              { opacity: 0, y: 46 * power, rotate: -6 },
              {
                opacity: 1,
                y: 0,
                rotate: 0,
                duration: 0.9,
                stagger: 0.12,
                ease: 'expo.out',
              },
              '-=0.65'
            )
            .fromTo(
              subtitleRef.current,
              { opacity: 0, y: 20, filter: 'blur(6px)' },
              { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.7, ease: 'power2.out' },
              '-=0.45'
            )
            .fromTo(
              pills,
              { opacity: 0, y: 24 * power, scale: 0.8 },
              {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.6,
                stagger: { each: 0.045, from: 'random' },
                ease: 'back.out(1.7)',
              },
              '-=0.3'
            );

          // -----------------------------------------------------------------
          // Pills: hover lift/glow + a very small magnetic pull toward the
          // cursor. Fine-pointer devices only.
          // -----------------------------------------------------------------
          if (isFinePointer) {
            pills.forEach((pill) => {
              const handleEnter = () => {
                gsap.to(pill, {
                  scale: 1.07,
                  boxShadow: '0 10px 28px rgba(255,60,143,0.35)',
                  duration: 0.35,
                  ease: 'power2.out',
                });
              };
              const handleMove = (e: MouseEvent) => {
                const rect = pill.getBoundingClientRect();
                const relX = e.clientX - (rect.left + rect.width / 2);
                const relY = e.clientY - (rect.top + rect.height / 2);
                gsap.to(pill, {
                  x: relX * 0.12,
                  y: relY * 0.25 - 4,
                  duration: 0.3,
                  ease: 'power2.out',
                });
              };
              const handleLeave = () => {
                gsap.to(pill, {
                  x: 0,
                  y: 0,
                  scale: 1,
                  boxShadow: '0 0px 0px rgba(255,60,143,0)',
                  duration: 0.5,
                  ease: 'elastic.out(1, 0.5)',
                });
              };
              pill.addEventListener('mouseenter', handleEnter);
              pill.addEventListener('mousemove', handleMove);
              pill.addEventListener('mouseleave', handleLeave);
              cleanupFns.push(() => {
                pill.removeEventListener('mouseenter', handleEnter);
                pill.removeEventListener('mousemove', handleMove);
                pill.removeEventListener('mouseleave', handleLeave);
              });
            });
          }

          // gsap.context() + gsap.matchMedia() already track and revert
          // every tween/ScrollTrigger created above; this covers the plain
          // DOM listeners that context can't see.
          return () => {
            bgScrollTween.kill();
            bgFloatTween.kill();
            contentScrollTween.kill();
            cleanupFns.forEach((fn) => fn());
          };
        }
      );
    }, section);

    return () => {
      ctx.revert();
      mm.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden"
      style={{ height: '60vh', minHeight: '400px' }}
    >
      {/* Parallax background */}
      <div ref={bgRef} className="absolute inset-0" style={{ transform: 'translateY(0)' }}>
        <img
          ref={bgImgRef}
          src="/images/genre-bg.jpg"
          alt=""
          className="w-full h-[120%] object-cover"
        />
        <div className="absolute inset-0 bg-[#070707]/60" />
      </div>

      {/* Content */}
      <div
        ref={contentRef}
        className="relative z-10 flex flex-col items-center justify-center h-full"
        style={{ padding: '0 clamp(1rem, 5vw, 4rem)' }}
      >
        <div ref={contentInnerRef} className="flex flex-col items-center opacity-0">
          <h2
            className="font-display font-bold text-white text-center"
            style={{
              fontSize: 'clamp(2rem, 5vw, 4rem)',
              lineHeight: 1.0,
              letterSpacing: '-0.02em',
            }}
          >
            {HEADING_WORDS.map((word, i) => (
              <span
                key={word.text}
                data-word
                className={word.gradient ? 'gradient-text opacity-0' : 'opacity-0'}
                style={{ display: 'inline-block' }}
              >
                {word.text}
                {i < HEADING_WORDS.length - 1 ? '\u00A0' : ''}
              </span>
            ))}
          </h2>

          <p
            ref={subtitleRef}
            className="text-base text-[#B8B8B8] text-center max-w-[400px] mt-3 opacity-0"
            style={{ lineHeight: 1.6 }}
          >
            Find your sound. Every genre, every mood, every moment.
          </p>

          {/* Genre pills */}
          <div className="flex flex-wrap justify-center gap-3 mt-8 max-w-[600px]">
            {genres.map((genre) => (
              <button
                key={genre}
                className="genre-pill px-6 py-2.5 rounded-full bg-white/[0.08] backdrop-blur-lg border border-white/10 text-white font-display text-sm font-medium hover:gradient-accent hover:border-transparent transition-colors duration-250 opacity-0"
              >
                {genre}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}