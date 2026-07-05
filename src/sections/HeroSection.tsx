import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ---------------------------------------------------------------------------
// Content
// ---------------------------------------------------------------------------

const ALBUM_IMAGES = [
  '/images/album-1.jpg', '/images/album-2.jpg', '/images/album-3.jpg', '/images/album-4.jpg',
  '/images/album-5.jpg', '/images/album-6.jpg', '/images/album-7.jpg', '/images/album-8.jpg',
  '/images/album-9.jpg', '/images/album-10.jpg', '/images/album-11.jpg', '/images/album-12.jpg',
  '/images/album-1.jpg', '/images/album-3.jpg', '/images/album-5.jpg', '/images/album-7.jpg',
  '/images/album-9.jpg', '/images/album-11.jpg', '/images/album-2.jpg', '/images/album-4.jpg',
  '/images/album-6.jpg', '/images/album-8.jpg', '/images/album-10.jpg', '/images/album-12.jpg',
] as const;

const GENRE_PILLS = [
  'Hip-Hop', 'R&B', 'Electronic', 'Afrobeats', 'Pop', 'Soul',
  'Jazz', 'Indie', 'Latin', 'Rock', 'Reggae', 'Gospel',
] as const;

// ---------------------------------------------------------------------------
// Ambient wave canvas
// ---------------------------------------------------------------------------

function CurtainWave() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    const RESOLUTION = 0.5;
    const NOISE_SPEED = prefersReducedMotion ? 0 : 0.0008;
    const PARTICLE_COUNT = 200;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let amplitude = height * 0.18;
    let baseY = height * 0.58;
    let waveResolution = width * RESOLUTION;
    let time = 0;
    let rafId = 0;
    let resizeTimeout: ReturnType<typeof setTimeout>;

    const applySize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * DPR;
      canvas.height = height * DPR;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      amplitude = height * 0.18;
      baseY = height * 0.58;
      waveResolution = width * RESOLUTION;
    };

    const noise = (x: number, t: number) =>
      Math.sin(x * 0.005 + t * 1.0) * 1.0 +
      Math.sin(x * 0.02 + t * 1.5) * 0.5 +
      Math.cos(x * 0.05 + t * 0.1) * 0.2;

    const drawWaveLine = (color: string, alpha: number, lineWidth: number, phase: number) => {
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.beginPath();
      for (let i = 0; i <= waveResolution; i++) {
        const x = (i / waveResolution) * width;
        const y = baseY + noise(x, time - phase) * amplitude;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.globalAlpha = 1;
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = 'lighter';
      time += NOISE_SPEED;

      drawWaveLine('#ff3c8f', 1, 3, 0); // primary wave
      drawWaveLine('#8d4dff', 0.5, 2, 10); // ghost echo

      const maxDist = Math.sqrt(width * width + height * height) / 2;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const x = (i / PARTICLE_COUNT) * width;
        const y = baseY + noise(x, time) * amplitude;
        const dist = Math.hypot(x - width / 2, y - height / 2);
        const fade = 1 - dist / maxDist;
        const size = 2 + fade * 2;
        ctx.fillStyle = `rgba(255, 60, 143, ${Math.max(fade, 0) * 0.8})`;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }

      rafId = requestAnimationFrame(draw);
    };

    applySize();
    draw();

    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(applySize, 150);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(resizeTimeout);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-[2] pointer-events-none"
    />
  );
}

// ---------------------------------------------------------------------------
// Magnetic button — subtle cursor-follow micro-interaction
// ---------------------------------------------------------------------------

function MagneticButton({
  children,
  className,
}: {
  children: React.ReactNode;
  className: string;
}) {
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const el = btnRef.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const handleMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const relX = e.clientX - (rect.left + rect.width / 2);
      const relY = e.clientY - (rect.top + rect.height / 2);
      gsap.to(el, {
        x: relX * 0.25,
        y: relY * 0.4,
        duration: 0.4,
        ease: 'power2.out',
      });
    };

    const handleLeave = () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
    };

    el.addEventListener('mousemove', handleMove);
    el.addEventListener('mouseleave', handleLeave);
    return () => {
      el.removeEventListener('mousemove', handleMove);
      el.removeEventListener('mouseleave', handleLeave);
    };
  }, []);

  return (
    <button ref={btnRef} className={className}>
      {children}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Genre marquee — continuous scrolling ticker, pauses on hover
// ---------------------------------------------------------------------------

function GenreMarquee() {
  const trackRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // The track renders the pill list twice back-to-back; animating exactly
    // one copy's width creates a seamless, endless loop.
    const halfWidth = track.scrollWidth / 2;

    tweenRef.current = gsap.to(track, {
      x: -halfWidth,
      duration: GENRE_PILLS.length * 2.2,
      ease: 'none',
      repeat: -1,
    });

    return () => {
      tweenRef.current?.kill();
    };
  }, []);

  const handleEnter = () => tweenRef.current?.pause();
  const handleLeave = () => tweenRef.current?.resume();

  return (
    <div
      className="mt-10 overflow-hidden"
      style={{
        maskImage: 'linear-gradient(90deg, transparent, black 8%, black 92%, transparent)',
        WebkitMaskImage:
          'linear-gradient(90deg, transparent, black 8%, black 92%, transparent)',
      }}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <div ref={trackRef} className="flex gap-2.5 w-max">
        {[...GENRE_PILLS, ...GENRE_PILLS].map((genre, i) => (
          <span
            key={`${genre}-${i}`}
            data-pill
            className="shrink-0 px-4 py-1.5 rounded-full border border-white/10 bg-white/[0.03] text-[#B8B8B8] text-xs font-medium cursor-pointer transition-colors duration-200 hover:border-[rgba(255,60,143,0.4)] hover:text-white hover:bg-[rgba(255,60,143,0.08)]"
          >
            {genre}
          </span>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Album tile — subtle 3D tilt toward the cursor
// ---------------------------------------------------------------------------

function AlbumTile({ src }: { src: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const handleMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      gsap.to(el, {
        rotateY: px * 22,
        rotateX: -py * 22,
        scale: 1.08,
        duration: 0.4,
        ease: 'power2.out',
      });
    };

    const handleLeave = () => {
      gsap.to(el, { rotateY: 0, rotateX: 0, scale: 1, duration: 0.5, ease: 'power2.out' });
    };

    el.addEventListener('mousemove', handleMove);
    el.addEventListener('mouseleave', handleLeave);
    return () => {
      el.removeEventListener('mousemove', handleMove);
      el.removeEventListener('mouseleave', handleLeave);
    };
  }, []);

  return (
    <div
      data-tile
      className="overflow-hidden"
      style={{ aspectRatio: '1/1', opacity: 0, perspective: '600px' }}
    >
      <div ref={wrapRef} className="w-full h-full" style={{ transformStyle: 'preserve-3d' }}>
        <img
          src={src}
          alt=""
          className="w-full h-full object-cover"
          style={{ filter: 'grayscale(20%)' }}
          loading="eager"
        />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Hero section
// ---------------------------------------------------------------------------

export default function HeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const tilesRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const gradientWordRef = useRef<HTMLSpanElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const pillsWrapRef = useRef<HTMLDivElement>(null);
  const scrollCueRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();

    const ctx = gsap.context(() => {
      const reduceMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;

      const tiles = gsap.utils.toArray<HTMLElement>('[data-tile]', tilesRef.current);
      const words = gsap.utils.toArray<HTMLElement>('[data-word]', headlineRef.current);

      if (reduceMotion) {
        // Respect reduced motion: show final state immediately, no motion.
        gsap.set(
          [
            gridRef.current,
            eyebrowRef.current,
            headlineRef.current,
            subtitleRef.current,
            ctaRef.current,
            pillsWrapRef.current,
          ],
          { opacity: 1, y: 0 }
        );
        gsap.set(words, { opacity: 1, y: 0 });
        gsap.set(tiles, { opacity: 0.35, scale: 1 });
        if (scrollCueRef.current) scrollCueRef.current.style.display = 'none';
        return;
      }

      // ---- Master load-in timeline ------------------------------------
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.to(gridRef.current, { opacity: 1, duration: 0.6, ease: 'power1.out' })
        .fromTo(
          tiles,
          { opacity: 0, scale: 1.15 },
          {
            opacity: 0.35,
            scale: 1,
            duration: 1.1,
            stagger: { each: 0.015, from: 'random' },
            ease: 'power2.out',
          },
          '<'
        )
        .fromTo(
          eyebrowRef.current,
          { opacity: 0, y: 12, letterSpacing: '0.3em' },
          { opacity: 1, y: 0, letterSpacing: '0.12em', duration: 0.7 },
          '-=0.8'
        )
        .fromTo(
          words,
          { opacity: 0, y: 46, filter: 'blur(10px)' },
          { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.9, stagger: 0.08 },
          '-=0.5'
        )
        .fromTo(
          subtitleRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.7 },
          '-=0.45'
        )
        .fromTo(
          ctaRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.7 },
          '-=0.4'
        )
        .fromTo(
          pillsWrapRef.current,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.5 },
          '-=0.35'
        )
        .fromTo(
          scrollCueRef.current,
          { opacity: 0, y: -8 },
          { opacity: 1, y: 0, duration: 0.6 },
          '-=0.2'
        );

      // ---- Ambient loop: gradient text breathing glow ------------------
      if (gradientWordRef.current) {
        gsap.to(gradientWordRef.current, {
          filter: 'drop-shadow(0 0 18px rgba(255,60,143,0.55))',
          duration: 2.2,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
        });
      }

      // ---- Ambient loop: scroll cue bob ---------------------------------
      if (scrollCueRef.current) {
        gsap.to(scrollCueRef.current, {
          y: 8,
          duration: 1.1,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
          delay: 1.4,
        });
      }

      // ---- Scroll-linked parallax + fade on foreground content ---------
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
        onUpdate: (self) => {
          gsap.set(contentRef.current, {
            y: self.progress * 150,
            opacity: 1 - self.progress * 1.2,
          });
          gsap.set(scrollCueRef.current, { opacity: 1 - self.progress * 4 });
        },
      });

      // ---- Slow ambient drift on the album collage while scrolling -----
      gsap.to(gridRef.current, {
        yPercent: -4,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      });

      // ---- Cursor parallax on the album wall (pointer devices only) ----
      mm.add('(pointer: fine)', () => {
        const handlePointerMove = (e: PointerEvent) => {
          const nx = e.clientX / window.innerWidth - 0.5;
          const ny = e.clientY / window.innerHeight - 0.5;
          gsap.to(gridRef.current, {
            x: nx * 18,
            y: ny * 18,
            duration: 1.2,
            ease: 'power3.out',
            overwrite: 'auto',
          });
        };
        window.addEventListener('pointermove', handlePointerMove);
        return () => window.removeEventListener('pointermove', handlePointerMove);
      });
    }, sectionRef);

    return () => {
      ctx.revert();
      mm.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden"
      style={{ height: '100vh' }}
    >
      {/* Album collage background */}
      <div
        ref={gridRef}
        className="absolute inset-0 z-[1] opacity-0"
        style={{ willChange: 'transform, opacity' }}
      >
        <div
          ref={tilesRef}
          className="absolute inset-0"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(6, 1fr)',
            gridTemplateRows: 'repeat(4, 1fr)',
            gap: 0,
          }}
        >
          {ALBUM_IMAGES.map((src, i) => (
            <AlbumTile key={`${src}-${i}`} src={src} />
          ))}
        </div>
        <div className="absolute inset-0 gradient-dark" />
      </div>

      {/* Ambient wave canvas */}
      <CurtainWave />

      {/* Foreground content */}
      <div
        ref={contentRef}
        className="absolute z-[3] flex flex-col justify-end"
        style={{
          bottom: '15vh',
          left: 'clamp(1rem, 5vw, 4rem)',
          maxWidth: '700px',
        }}
      >
        <p
          ref={eyebrowRef}
          className="font-display text-xs font-medium tracking-[0.12em] uppercase text-[#B8B8B8] mb-4 opacity-0"
        >
          NEW DROPS // EXCLUSIVE TRACKS
        </p>

        <h1
          ref={headlineRef}
          className="font-display font-bold text-white"
          style={{
            fontSize: 'clamp(3rem, 8vw, 7rem)',
            lineHeight: 0.95,
            letterSpacing: '-0.03em',
          }}
        >
          <span data-word style={{ display: 'inline-block', opacity: 0 }}>Music That</span>
          <br />
          <span
            ref={gradientWordRef}
            data-word
            className="gradient-text"
            style={{ display: 'inline-block', opacity: 0 }}
          >
            Shapes
          </span>
          <br />
          <span data-word style={{ display: 'inline-block', opacity: 0 }}>Culture</span>
        </h1>

        <p
          ref={subtitleRef}
          className="text-base text-[#B8B8B8] mt-5 max-w-[480px] opacity-0"
          style={{ lineHeight: 1.6 }}
        >
          Discover the artists, sounds, and stories pushing culture forward.
        </p>

        <div ref={ctaRef} className="flex flex-wrap gap-4 mt-8 opacity-0">
          <MagneticButton className="gradient-accent text-white font-display text-sm font-medium px-8 py-3.5 rounded-full transition-shadow duration-300 hover:shadow-[0_0_32px_rgba(255,60,143,0.5)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
            Explore Artists
          </MagneticButton>
          <MagneticButton className="bg-transparent text-white font-display text-sm font-medium px-8 py-3.5 rounded-full border border-white/20 transition-all duration-300 hover:border-white/40 hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
            Latest Releases
          </MagneticButton>
        </div>

        <div ref={pillsWrapRef} className="opacity-0" style={{ maxWidth: '560px' }}>
          <GenreMarquee />
        </div>
      </div>

      {/* Scroll cue */}
      <div
        ref={scrollCueRef}
        className="absolute z-[3] bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-0"
      >
        <span className="text-[#B8B8B8] text-[10px] font-display tracking-[0.2em] uppercase">
          Scroll
        </span>
        <span className="block w-px h-8 bg-gradient-to-b from-white/50 to-transparent" />
      </div>
    </section>
  );
}