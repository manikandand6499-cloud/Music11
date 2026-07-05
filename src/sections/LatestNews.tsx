import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const articles = [
  {
    category: 'Interview',
    title: "Nova Reign's Blueprint for the Future of Hip-Hop",
    excerpt: 'The breakout artist discusses her genre-blurring sound, creative process, and what\'s next for her highly anticipated sophomore album.',
    date: 'Jun 28, 2025',
    image: '/images/news-1.jpg',
  },
  {
    category: 'Industry',
    title: 'How Afrobeats Conquered the Global Charts',
    excerpt: 'From Lagos to London to Los Angeles, the sound reshaping popular music and the artists leading the charge.',
    date: 'Jun 25, 2025',
    image: '/images/news-2.jpg',
  },
  {
    category: 'Behind the Scenes',
    title: "Inside the Recording of VOLT's New Album",
    excerpt: 'An exclusive look at the electronic producer\'s months-long studio journey and the gear that shaped the sound.',
    date: 'Jun 22, 2025',
    image: '/images/news-3.jpg',
  },
];

// Heading split into words so each can reveal individually. Text and the
// gradient word are unchanged — only wrapped for per-word animation.
const HEADING_WORDS: { text: string; gradient?: boolean }[] = [
  { text: 'Latest' },
  { text: 'News', gradient: true },
];

export default function LatestNews() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentInnerRef = useRef<HTMLDivElement>(null);
  const editorialRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const contentInner = contentInnerRef.current;
    const editorial = editorialRef.current;
    const button = buttonRef.current;
    const grid = gridRef.current;
    if (!section || !contentInner || !editorial || !button || !grid) return;

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
          const cards = Array.from(section.querySelectorAll<HTMLElement>('.news-card'));
          const imageWraps = cards.map((c) => c.querySelector<HTMLElement>('.news-card-image-wrap'));
          const images = cards.map((c) => c.querySelector<HTMLImageElement>('img'));
          const badges = cards.map((c) => c.querySelector<HTMLElement>('.news-card-badge'));
          const titles = cards.map((c) => c.querySelector<HTMLElement>('.news-card-title'));
          const readMores = cards.map((c) => c.querySelector<HTMLElement>('.news-card-readmore'));
          const readMoreArrows = cards.map((c) =>
            c.querySelector<HTMLElement>('.news-card-readmore-arrow')
          );
          const readMoreUnderlines = cards.map((c) =>
            c.querySelector<HTMLElement>('.news-card-readmore-underline')
          );
          const cleanupFns: Array<() => void> = [];

          // -----------------------------------------------------------------
          // Reduced motion: show the final state immediately, no motion.
          // -----------------------------------------------------------------
          if (reduceMotion) {
            gsap.set([contentInner, editorial, button, ...cards], {
              opacity: 1,
              y: 0,
              x: 0,
              scale: 1,
              rotate: 0,
              rotateX: 0,
              filter: 'blur(0px)',
            });
            gsap.set(words, { opacity: 1, y: 0, rotate: 0 });
            gsap.set(images.filter(Boolean) as HTMLElement[], {
              opacity: 1,
              scale: 1,
              filter: 'blur(0px)',
              clipPath: 'inset(0% 0% 0% 0%)',
            });
            return;
          }

          const power = isMobile ? 0.55 : 1;

          gsap.set([section, contentInner, ...cards], {
            willChange: 'transform, opacity, filter',
          });

          // -----------------------------------------------------------------
          // Whole-section scroll parallax — a very slight vertical drift as
          // the section passes through the viewport.
          // -----------------------------------------------------------------
          const sectionScrollTween = gsap.to(section, {
            y: -24 * power,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          });

          // -----------------------------------------------------------------
          // Section reveal — fade, rise, tiny scale, blur-to-clear.
          // -----------------------------------------------------------------
          const revealTl = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          });

          revealTl
            .fromTo(
              contentInner,
              { opacity: 0, y: 40 * power, scale: 0.98, filter: 'blur(10px)' },
              { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: 1, ease: 'power3.out' }
            )
            // ---- Header: editorial label, heading words, button ----------
            .fromTo(
              editorial,
              { opacity: 0, y: 24 * power, rotate: -3 },
              { opacity: 1, y: 0, rotate: 0, duration: 0.6, ease: 'power2.out' },
              '-=0.75'
            )
            .fromTo(
              words,
              { opacity: 0, y: 40 * power, rotate: -6 },
              { opacity: 1, y: 0, rotate: 0, duration: 0.8, stagger: 0.1, ease: 'expo.out' },
              '-=0.4'
            )
            .fromTo(
              button,
              { opacity: 0, y: 20 * power, rotate: 2 },
              { opacity: 1, y: 0, rotate: 0, duration: 0.6, ease: 'power2.out' },
              '-=0.55'
            )
            // ---- Cards: spring-like 3D entrance, one after another --------
            .fromTo(
              cards,
              { opacity: 0, y: 80 * power, scale: 0.9, rotateX: 12 },
              {
                opacity: 1,
                y: 0,
                scale: 1,
                rotateX: 0,
                duration: 0.9,
                stagger: 0.12,
                ease: 'back.out(1.6)',
              },
              '-=0.3'
            )
            // ---- Images: clip-reveal + zoom-settle + blur-to-clear --------
            .fromTo(
              imageWraps.filter(Boolean) as HTMLElement[],
              { clipPath: 'inset(100% 0% 0% 0%)' },
              { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.9, stagger: 0.12, ease: 'power3.out' },
              '<'
            )
            .fromTo(
              images.filter(Boolean) as HTMLElement[],
              { opacity: 0, scale: 1.15, filter: 'blur(10px)' },
              {
                opacity: 1,
                scale: 1,
                filter: 'blur(0px)',
                duration: 0.9,
                stagger: 0.12,
                ease: 'power3.out',
              },
              '<'
            );

          // -----------------------------------------------------------------
          // Ambient idle motion — near-invisible float on each card, and a
          // slow breathing zoom on each image. Both pause during hover so
          // they never fight the interactive tweens below.
          // -----------------------------------------------------------------
          const floatTweens = cards.map((card, i) =>
            gsap.to(card, {
              y: '+=6',
              duration: 3.4 + i * 0.3,
              ease: 'sine.inOut',
              repeat: -1,
              yoyo: true,
              delay: 0.5 + i * 0.2,
            })
          );

          const breatheTweens = images.map((img, i) => {
            if (!img) return null;
            return gsap.to(img, {
              scale: 1.03,
              duration: 5 + i * 0.4,
              ease: 'sine.inOut',
              repeat: -1,
              yoyo: true,
              delay: 0.8 + i * 0.25,
            });
          });

          // -----------------------------------------------------------------
          // Per-card hover: lift, scale, 3D tilt, glow, image zoom, arrow
          // slide, badge glow, plus a small magnetic pull and internal
          // parallax on fine-pointer devices only.
          // -----------------------------------------------------------------
          if (isFinePointer) {
            cards.forEach((card, i) => {
              const img = images[i];
              const badge = badges[i];
              const title = titles[i];
              const readMore = readMores[i];
              const arrow = readMoreArrows[i];
              const underline = readMoreUnderlines[i];

              const handleEnter = () => {
                floatTweens[i].pause();
                breatheTweens[i]?.pause();

                gsap.to(card, {
                  boxShadow: '0 28px 64px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,60,143,0.25)',
                  duration: 0.4,
                  ease: 'power3.out',
                });
                if (img) {
                  gsap.to(img, { scale: 1.08, duration: 0.6, ease: 'power3.out' });
                }
                if (badge) {
                  gsap.to(badge, {
                    boxShadow: '0 0 18px rgba(255,60,143,0.55)',
                    duration: 0.4,
                    ease: 'power2.out',
                  });
                }
                if (arrow) {
                  gsap.to(arrow, { x: 6, duration: 0.35, ease: 'power2.out' });
                }
                if (underline) {
                  gsap.to(underline, { scaleX: 1, duration: 0.35, ease: 'power2.out' });
                }
              };

              const handleMove = (e: MouseEvent) => {
                const rect = card.getBoundingClientRect();
                const px = (e.clientX - rect.left) / rect.width - 0.5;
                const py = (e.clientY - rect.top) / rect.height - 0.5;

                // Card: lift + tiny magnetic pull + 3D tilt, all in one tween
                // so nothing overwrites a sibling property mid-gesture.
                gsap.to(card, {
                  y: -10,
                  x: px * 6,
                  scale: 1.02,
                  rotateX: -py * 6,
                  rotateY: px * 6,
                  duration: 0.5,
                  ease: 'power3.out',
                  transformPerspective: 900,
                });

                // Internal parallax layers — image moves most, text least.
                if (img) gsap.to(img, { x: px * 10, y: py * 10, duration: 0.6, ease: 'power3.out' });
                if (badge) gsap.to(badge, { x: px * 5, y: py * 5, duration: 0.6, ease: 'power3.out' });
                if (title) gsap.to(title, { x: px * 4, y: py * 4, duration: 0.6, ease: 'power3.out' });
                if (readMore) gsap.to(readMore, { x: px * 3, y: py * 3, duration: 0.6, ease: 'power3.out' });
              };

              const handleLeave = () => {
                gsap.to(card, {
                  y: 0,
                  x: 0,
                  scale: 1,
                  rotateX: 0,
                  rotateY: 0,
                  boxShadow: '0 0px 0px rgba(0,0,0,0)',
                  duration: 0.6,
                  ease: 'elastic.out(1, 0.6)',
                  onComplete: () => {
                    floatTweens[i].resume();
                    breatheTweens[i]?.resume();
                  },
                });
                if (img) gsap.to(img, { x: 0, y: 0, scale: 1, duration: 0.6, ease: 'power3.out' });
                if (badge) {
                  gsap.to(badge, {
                    x: 0,
                    y: 0,
                    boxShadow: '0 0 0px rgba(255,60,143,0)',
                    duration: 0.5,
                    ease: 'power3.out',
                  });
                }
                if (title) gsap.to(title, { x: 0, y: 0, duration: 0.5, ease: 'power3.out' });
                if (readMore) gsap.to(readMore, { x: 0, y: 0, duration: 0.5, ease: 'power3.out' });
                if (arrow) gsap.to(arrow, { x: 0, duration: 0.4, ease: 'power2.out' });
                if (underline) gsap.to(underline, { scaleX: 0, duration: 0.3, ease: 'power2.in' });
              };

              card.addEventListener('mouseenter', handleEnter);
              card.addEventListener('mousemove', handleMove);
              card.addEventListener('mouseleave', handleLeave);
              cleanupFns.push(() => {
                card.removeEventListener('mouseenter', handleEnter);
                card.removeEventListener('mousemove', handleMove);
                card.removeEventListener('mouseleave', handleLeave);
              });
            });

            // ---- "All Stories" button: glow, scale, arrow + text shift ----
            const buttonArrow = button.querySelector<HTMLElement>('.news-btn-arrow');
            const buttonText = button.querySelector<HTMLElement>('.news-btn-text');
            const handleButtonEnter = () => {
              gsap.to(button, {
                scale: 1.05,
                textShadow: '0 0 16px rgba(255,60,143,0.5)',
                duration: 0.35,
                ease: 'power2.out',
              });
              if (buttonArrow) gsap.to(buttonArrow, { x: 5, duration: 0.35, ease: 'power2.out' });
              if (buttonText) gsap.to(buttonText, { x: -2, duration: 0.35, ease: 'power2.out' });
            };
            const handleButtonLeave = () => {
              gsap.to(button, {
                scale: 1,
                textShadow: '0 0 0px rgba(255,60,143,0)',
                duration: 0.4,
                ease: 'power2.out',
              });
              if (buttonArrow) gsap.to(buttonArrow, { x: 0, duration: 0.4, ease: 'power2.out' });
              if (buttonText) gsap.to(buttonText, { x: 0, duration: 0.4, ease: 'power2.out' });
            };
            button.addEventListener('mouseenter', handleButtonEnter);
            button.addEventListener('mouseleave', handleButtonLeave);
            cleanupFns.push(() => {
              button.removeEventListener('mouseenter', handleButtonEnter);
              button.removeEventListener('mouseleave', handleButtonLeave);
            });
          }

          // gsap.context() + gsap.matchMedia() auto-revert every tween and
          // ScrollTrigger created above; this covers the plain DOM
          // listeners and infinite tweens that context can't see.
          return () => {
            sectionScrollTween.kill();
            floatTweens.forEach((t) => t.kill());
            breatheTweens.forEach((t) => t?.kill());
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
      id="news"
      ref={sectionRef}
      className="relative w-full bg-[#070707]"
      style={{ padding: 'clamp(80px, 10vh, 140px) clamp(1rem, 5vw, 4rem)' }}
    >
      <div ref={contentInnerRef} className="max-w-[1400px] mx-auto opacity-0">
        {/* Header */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <p
              ref={editorialRef}
              className="font-display text-xs font-medium tracking-[0.08em] uppercase text-[#B8B8B8] mb-2 opacity-0"
            >
              EDITORIAL
            </p>
            <h2
              className="font-display font-bold text-white"
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
          </div>
          <button
            ref={buttonRef}
            className="hidden md:flex items-center gap-2 font-display text-sm font-medium text-[#B8B8B8] hover:text-white transition-colors opacity-0"
          >
            <span className="news-btn-text">All Stories</span>
            <ArrowRight size={16} className="news-btn-arrow" />
          </button>
        </div>

        {/* Grid */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-3 gap-6" style={{ perspective: '1000px' }}>
          {articles.map((article, i) => (
            <article key={i} className="news-card cursor-pointer opacity-0">
              <div className="news-card-image-wrap relative overflow-hidden rounded-t-xl" style={{ aspectRatio: '16/10' }}>
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="bg-[#111111] p-6 rounded-b-xl border border-white/[0.06] border-t-0">
                <span className="news-card-badge inline-block px-3 py-1 rounded-full bg-[rgba(255,60,143,0.12)] text-[#ff3c8f] text-[11px] font-medium uppercase mb-3">
                  {article.category}
                </span>
                <h3 className="news-card-title font-display text-lg font-medium text-white leading-snug mb-2">
                  {article.title}
                </h3>
                <p className="text-sm text-[#B8B8B8] leading-relaxed line-clamp-2">
                  {article.excerpt}
                </p>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-xs text-[#B8B8B8]">{article.date}</span>
                  <span className="news-card-readmore relative inline-flex items-center gap-1 text-xs font-medium text-[#ff3c8f]">
                    Read More
                    <span className="news-card-readmore-arrow inline-block" aria-hidden="true">
                      &rarr;
                    </span>
                    <span className="news-card-readmore-underline absolute left-0 -bottom-0.5 h-px w-full origin-left scale-x-0 bg-[#ff3c8f]" />
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}