import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const products = [
  { name: 'ELEV8 Vintage Hoodie', price: '$89', image: '/images/merch-hoodie.jpg' },
  { name: 'Midnight Protocol Vinyl', price: '$34', image: '/images/merch-vinyl.jpg' },
  { name: 'Chromatic Tour Cap', price: '$42', image: '/images/merch-cap.jpg' },
  { name: 'Nova Reign Poster Set', price: '$28', image: '/images/merch-posters.jpg' },
];

export default function PremiumMerch() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const shopLabelRef = useRef<HTMLParagraphElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const shopAllRef = useRef<HTMLButtonElement>(null);
  const arrowRef = useRef<SVGSVGElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // Per-card refs (arrays indexed by product index)
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const imageWrapRefs = useRef<Array<HTMLDivElement | null>>([]);
  const imageRefs = useRef<Array<HTMLImageElement | null>>([]);
  const overlayRefs = useRef<Array<HTMLDivElement | null>>([]);
  const quickViewTextRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const nameRefs = useRef<Array<HTMLHeadingElement | null>>([]);
  const priceRefs = useRef<Array<HTMLParagraphElement | null>>([]);
  const cartBtnRefs = useRef<Array<HTMLButtonElement | null>>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // matchMedia lets us dial down intensity on smaller screens
      // without duplicating animation logic.
      const mm = gsap.matchMedia();

      mm.add(
        {
          isDesktop: '(min-width: 1024px)',
          isTablet: '(min-width: 640px) and (max-width: 1023px)',
          isMobile: '(max-width: 639px)',
        },
        (context) => {
          const { isDesktop } = context.conditions as { isDesktop: boolean };

          // Intensity scales down automatically on smaller viewports
          const intensity = isDesktop ? 1 : 0.55;

          /* ------------------------------------------------------------
           * 1. SECTION REVEAL — cinematic fade/scale/blur on enter
           * ---------------------------------------------------------- */
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

          /* ------------------------------------------------------------
           * 2. HEADER ANIMATION — label, heading words, shop-all button
           * ---------------------------------------------------------- */
          const headerTl = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          });

          if (shopLabelRef.current) {
            headerTl.fromTo(
              shopLabelRef.current,
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
            const words = headingRef.current.querySelectorAll('.merch-heading-word');
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

          if (shopAllRef.current) {
            headerTl.fromTo(
              shopAllRef.current,
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

          /* ------------------------------------------------------------
           * 3 & 4. PRODUCT CARD ENTRANCE + IMAGE REVEAL
           * ---------------------------------------------------------- */
          cardRefs.current.forEach((card, i) => {
            if (!card) return;
            const image = imageRefs.current[i];

            const cardTl = gsap.timeline({
              scrollTrigger: {
                trigger: card,
                start: 'top 90%',
                toggleActions: 'play none none reverse',
              },
            });

            cardTl.fromTo(
              card,
              {
                opacity: 0,
                y: 100 * intensity,
                scale: 0.85,
                rotateX: 15 * intensity,
                filter: 'blur(10px)',
                transformPerspective: 800,
              },
              {
                opacity: 1,
                y: 0,
                scale: 1,
                rotateX: 0,
                filter: 'blur(0px)',
                duration: 1.1,
                delay: i * 0.12,
                ease: 'back.out(1.4)',
              },
              0
            );

            if (image) {
              cardTl.fromTo(
                image,
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
                  duration: 1.3,
                  ease: 'power3.out',
                },
                i * 0.12 + 0.15
              );
            }

            // Info stagger: name -> price -> button
            const infoEls = [nameRefs.current[i], priceRefs.current[i], cartBtnRefs.current[i]].filter(
              Boolean
            );
            cardTl.fromTo(
              infoEls,
              { opacity: 0, y: 24, filter: 'blur(6px)' },
              {
                opacity: 1,
                y: 0,
                filter: 'blur(0px)',
                duration: 0.6,
                stagger: 0.08,
                ease: 'power3.out',
              },
              i * 0.12 + 0.35
            );
          });

          /* ------------------------------------------------------------
           * 13. SCROLL PARALLAX — subtle drift while scrolling
           * ---------------------------------------------------------- */
          if (gridRef.current) {
            gsap.to(gridRef.current, {
              y: -30 * intensity,
              ease: 'none',
              scrollTrigger: {
                trigger: section,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1.2,
              },
            });
          }

          cardRefs.current.forEach((card, i) => {
            const image = imageRefs.current[i];
            if (!card) return;
            gsap.to(card, {
              y: -18 * intensity,
              ease: 'none',
              scrollTrigger: {
                trigger: card,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1.5,
              },
            });
            if (image) {
              gsap.to(image, {
                scale: 1.06,
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

          /* ------------------------------------------------------------
           * 14. AMBIENT FLOATING ANIMATION — near-invisible idle motion
           * ---------------------------------------------------------- */
          cardRefs.current.forEach((card, i) => {
            if (!card) return;
            gsap.to(card, {
              y: '+=6',
              duration: 3.4 + i * 0.3,
              ease: 'sine.inOut',
              yoyo: true,
              repeat: -1,
              delay: i * 0.4,
            });
            const image = imageRefs.current[i];
            if (image) {
              gsap.to(image, {
                scale: '+=0.015',
                duration: 4 + i * 0.25,
                ease: 'sine.inOut',
                yoyo: true,
                repeat: -1,
                delay: i * 0.3,
              });
            }
          });

          return () => {
            // matchMedia cleanup handled by gsap.context revert
          };
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  /* ------------------------------------------------------------------
   * PER-CARD INTERACTION SETUP — hover, magnetic cursor, mouse parallax
   * ------------------------------------------------------------------ */
  useEffect(() => {
    const cleanupFns: Array<() => void> = [];

    cardRefs.current.forEach((card, i) => {
      if (!card) return;
      const image = imageRefs.current[i];
      const imageWrap = imageWrapRefs.current[i];
      const overlay = overlayRefs.current[i];
      const quickViewText = quickViewTextRefs.current[i];
      const name = nameRefs.current[i];
      const price = priceRefs.current[i];
      const cartBtn = cartBtnRefs.current[i];

      const isTouch = window.matchMedia('(hover: none)').matches;
      if (isTouch) return; // skip cursor-driven effects on touch devices

      // quickTo tweens for buttery, GPU-cheap magnetic + parallax motion
      const xTo = gsap.quickTo(card, 'x', { duration: 0.6, ease: 'power3.out' });
      const yTo = gsap.quickTo(card, 'y', { duration: 0.6, ease: 'power3.out' });
      const rotateXTo = gsap.quickTo(card, 'rotateX', { duration: 0.6, ease: 'power3.out' });
      const rotateYTo = gsap.quickTo(card, 'rotateY', { duration: 0.6, ease: 'power3.out' });

      const imgXTo = image ? gsap.quickTo(image, 'x', { duration: 0.8, ease: 'power3.out' }) : null;
      const imgYTo = image ? gsap.quickTo(image, 'y', { duration: 0.8, ease: 'power3.out' }) : null;

      const nameXTo = name ? gsap.quickTo(name, 'x', { duration: 0.9, ease: 'power3.out' }) : null;
      const priceXTo = price ? gsap.quickTo(price, 'x', { duration: 0.9, ease: 'power3.out' }) : null;
      const btnXTo = cartBtn ? gsap.quickTo(cartBtn, 'x', { duration: 0.9, ease: 'power3.out' }) : null;

      let hoverTl: gsap.core.Timeline | null = null;

      const handleEnter = () => {
        card.style.willChange = 'transform';
        if (image) image.style.willChange = 'transform';

        hoverTl?.kill();
        hoverTl = gsap.timeline();

        // 5. Card hover: lift, scale, glow, floating feel
        hoverTl.to(
          card,
          {
            scale: 1.03,
            y: -10,
            boxShadow:
              '0 30px 60px -20px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.08)',
            duration: 0.6,
            ease: 'power3.out',
          },
          0
        );

        // Border glow via a pseudo box-shadow ring animated with gsap
        hoverTl.to(
          card,
          {
            '--merch-glow-opacity': 1,
            duration: 0.5,
            ease: 'power2.out',
          } as gsap.TweenVars,
          0
        );

        // 6. Image hover: zoom + gentle rotation
        if (image) {
          hoverTl.to(
            image,
            {
              scale: 1.12,
              rotate: 1.2,
              duration: 0.9,
              ease: 'power3.out',
            },
            0
          );
        }

        // 7. Quick view overlay: cinematic reveal
        if (overlay) {
          hoverTl.fromTo(
            overlay,
            { opacity: 0, scale: 1.06, y: 16, filter: 'blur(8px)' },
            {
              opacity: 1,
              scale: 1,
              y: 0,
              filter: 'blur(0px)',
              duration: 0.5,
              ease: 'power3.out',
            },
            0
          );
        }
        if (quickViewText) {
          hoverTl.fromTo(
            quickViewText,
            { opacity: 0, y: 12, scale: 0.9 },
            { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'back.out(2)' },
            0.08
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
            '--merch-glow-opacity': 0,
            duration: 0.6,
            ease: 'power3.inOut',
          } as gsap.TweenVars,
          0
        );

        if (image) {
          hoverTl.to(
            image,
            { scale: 1, rotate: 0, x: 0, y: 0, duration: 0.8, ease: 'power3.inOut' },
            0
          );
        }
        if (overlay) {
          hoverTl.to(overlay, { opacity: 0, duration: 0.35, ease: 'power2.inOut' }, 0);
        }

        xTo(0);
        yTo(0);
        nameXTo?.(0);
        priceXTo?.(0);
        btnXTo?.(0);

        card.style.willChange = 'auto';
        if (image) image.style.willChange = 'auto';
      };

      // 11 & 12. Magnetic cursor + mouse parallax (combined per-frame handler)
      const handleMove = (e: MouseEvent) => {
        const rect = card.getBoundingClientRect();
        const relX = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 .. 0.5
        const relY = (e.clientY - rect.top) / rect.height - 0.5;

        // Card magnetic pull — elegant and minimal
        xTo(relX * 10);
        yTo(relY * 10 - 10); // combine with lift from hover state
        rotateYTo(relX * 6);
        rotateXTo(-relY * 6);

        // Image shifts independently, slightly stronger
        imgXTo?.(relX * 18);
        imgYTo?.(relY * 18);

        // Text/button subtle parallax
        nameXTo?.(relX * 6);
        priceXTo?.(relX * 4);
        btnXTo?.(relX * 3);
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
   * ADD TO CART — hover glow/lift + click bounce/ripple
   * ------------------------------------------------------------------ */
  const handleCartHoverEnter = (i: number) => {
    const btn = cartBtnRefs.current[i];
    if (!btn) return;
    gsap.to(btn, {
      scale: 1.03,
      y: -2,
      boxShadow: '0 12px 30px -8px rgba(139,92,246,0.45)',
      duration: 0.4,
      ease: 'power3.out',
    });
  };

  const handleCartHoverLeave = (i: number) => {
    const btn = cartBtnRefs.current[i];
    if (!btn) return;
    gsap.to(btn, {
      scale: 1,
      y: 0,
      boxShadow: '0 0px 0px rgba(0,0,0,0)',
      duration: 0.4,
      ease: 'power3.inOut',
    });
  };

  const handleCartClick = (i: number, e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = cartBtnRefs.current[i];
    if (!btn) return;

    // Bounce feedback
    gsap.timeline()
      .to(btn, { scale: 0.94, duration: 0.1, ease: 'power2.out' })
      .to(btn, { scale: 1, duration: 0.35, ease: 'elastic.out(1, 0.5)' });

    // Ripple feedback — a transient absolutely-positioned circle
    const rect = btn.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.style.position = 'absolute';
    ripple.style.left = `${e.clientX - rect.left}px`;
    ripple.style.top = `${e.clientY - rect.top}px`;
    ripple.style.width = '0px';
    ripple.style.height = '0px';
    ripple.style.borderRadius = '9999px';
    ripple.style.background = 'rgba(255,255,255,0.35)';
    ripple.style.transform = 'translate(-50%, -50%)';
    ripple.style.pointerEvents = 'none';
    btn.style.position = 'relative';
    btn.style.overflow = 'hidden';
    btn.appendChild(ripple);

    gsap.to(ripple, {
      width: 160,
      height: 160,
      opacity: 0,
      duration: 0.6,
      ease: 'power2.out',
      onComplete: () => ripple.remove(),
    });
  };

  /* ------------------------------------------------------------------
   * SHOP ALL — hover arrow slide, text shift, glow
   * ------------------------------------------------------------------ */
  const handleShopAllEnter = () => {
    gsap.to(shopAllRef.current, {
      color: '#ffffff',
      x: 2,
      duration: 0.3,
      ease: 'power2.out',
    });
    gsap.to(arrowRef.current, {
      x: 6,
      duration: 0.35,
      ease: 'power3.out',
    });
  };

  const handleShopAllLeave = () => {
    gsap.to(shopAllRef.current, {
      color: '#B8B8B8',
      x: 0,
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
      id="merch"
      ref={sectionRef}
      className="relative w-full bg-[#111111]"
      style={{ padding: 'clamp(80px, 10vh, 140px) clamp(1rem, 5vw, 4rem)' }}
    >
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <p
              ref={shopLabelRef}
              className="font-display text-xs font-medium tracking-[0.08em] uppercase text-[#B8B8B8] mb-2"
            >
              SHOP
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
              <span className="merch-heading-word inline-block">Premium</span>{' '}
              <span className="merch-heading-word gradient-text inline-block">Merch</span>
            </h2>
          </div>
          <button
            ref={shopAllRef}
            onMouseEnter={handleShopAllEnter}
            onMouseLeave={handleShopAllLeave}
            className="hidden md:flex items-center gap-2 font-display text-sm font-medium text-[#B8B8B8]"
          >
            Shop All
            <ArrowRight ref={arrowRef} size={16} />
          </button>
        </div>

        {/* Grid */}
        <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, i) => (
            <div
              key={i}
              ref={(el) => (cardRefs.current[i] = el)}
              className="merch-card group"
              style={
                {
                  transformStyle: 'preserve-3d',
                  '--merch-glow-opacity': 0,
                } as React.CSSProperties
              }
            >
              {/* Image */}
              <div
                ref={(el) => (imageWrapRefs.current[i] = el)}
                className="relative aspect-square bg-[#161616] rounded-xl overflow-hidden"
              >
                <img
                  ref={(el) => (imageRefs.current[i] = el)}
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {/* Quick View overlay */}
                <div
                  ref={(el) => (overlayRefs.current[i] = el)}
                  className="absolute inset-0 bg-[#070707]/70 flex items-center justify-center opacity-0"
                >
                  <span
                    ref={(el) => (quickViewTextRefs.current[i] = el)}
                    className="font-display text-sm font-medium text-white"
                  >
                    Quick View
                  </span>
                </div>
              </div>
              {/* Info */}
              <h3
                ref={(el) => (nameRefs.current[i] = el)}
                className="font-display text-base font-medium text-white mt-4"
              >
                {product.name}
              </h3>
              <p ref={(el) => (priceRefs.current[i] = el)} className="text-sm text-[#B8B8B8] mt-1">
                {product.price}
              </p>
              <button
                ref={(el) => (cartBtnRefs.current[i] = el)}
                onMouseEnter={() => handleCartHoverEnter(i)}
                onMouseLeave={() => handleCartHoverLeave(i)}
                onClick={(e) => handleCartClick(i, e)}
                className="w-full mt-3 py-2.5 rounded-lg border border-white/10 bg-transparent text-white text-[13px] font-medium hover:gradient-accent hover:border-transparent"
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}