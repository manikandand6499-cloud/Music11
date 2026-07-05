import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Play, ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const featuredVideo = {
  title: 'Midnight Protocol',
  subtitle: 'Nova Reign — Official Video',
  image: '/images/video-featured.jpg',
};

const thumbnails = [
  { title: 'Lagos Nights (Live)', artist: 'Zuri Lagos', image: '/images/video-1.jpg' },
  { title: 'Ocean Mind', artist: 'VOLT', image: '/images/video-2.jpg' },
  { title: 'Electric Dreams', artist: 'Mira Sol', image: '/images/video-3.jpg' },
];

export default function MusicVideos() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const featuredRef = useRef<HTMLDivElement>(null);
  const featuredImageRef = useRef<HTMLImageElement>(null);
  const featuredPlayRef = useRef<HTMLDivElement>(null);
  const featuredTitleRef = useRef<HTMLHeadingElement>(null);
  const featuredSubtitleRef = useRef<HTMLParagraphElement>(null);
  const thumbsRef = useRef<HTMLDivElement>(null);

  const labelRef = useRef<HTMLParagraphElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const allVideosBtnRef = useRef<HTMLButtonElement>(null);
  const arrowRef = useRef<SVGSVGElement>(null);

  // Per-thumbnail refs
  const thumbRefs = useRef<Array<HTMLDivElement | null>>([]);
  const thumbImageRefs = useRef<Array<HTMLImageElement | null>>([]);
  const thumbPlayRefs = useRef<Array<HTMLDivElement | null>>([]);
  const thumbTitleRefs = useRef<Array<HTMLHeadingElement | null>>([]);
  const thumbArtistRefs = useRef<Array<HTMLParagraphElement | null>>([]);

  /* ------------------------------------------------------------------
   * SCROLL-DRIVEN ANIMATIONS
   * ------------------------------------------------------------------ */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

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
           * 1. SECTION REVEAL — cinematic fade/scale/blur
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
              { opacity: 1, y: 0, rotate: 0, filter: 'blur(0px)', duration: 0.7, ease: 'power3.out' },
              0
            );
          }

          if (headingRef.current) {
            const words = headingRef.current.querySelectorAll('.videos-heading-word');
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

          if (allVideosBtnRef.current) {
            headerTl.fromTo(
              allVideosBtnRef.current,
              { opacity: 0, y: 20, filter: 'blur(6px)' },
              { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.7, ease: 'power3.out' },
              0.25
            );
          }

          /* -------------------------------------------------------
           * 3. FEATURED VIDEO REVEAL — hero-level entrance
           * ----------------------------------------------------- */
          const featuredTl = gsap.timeline({
            scrollTrigger: {
              trigger: featuredRef.current,
              start: 'top 82%',
              toggleActions: 'play none none reverse',
            },
          });

          featuredTl.fromTo(
            featuredRef.current,
            {
              opacity: 0,
              y: 70 * intensity,
              scale: 0.94,
              filter: 'blur(14px)',
            },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              filter: 'blur(0px)',
              duration: 1.2,
              ease: 'power4.out',
            },
            0
          );

          if (featuredImageRef.current) {
            featuredTl.fromTo(
              featuredImageRef.current,
              {
                scale: 1.25,
                filter: 'blur(16px)',
                clipPath: 'inset(12% round 16px)',
              },
              {
                scale: 1,
                filter: 'blur(0px)',
                clipPath: 'inset(0% round 16px)',
                duration: 1.4,
                ease: 'power3.out',
              },
              0.1
            );
          }

          if (featuredPlayRef.current) {
            featuredTl.fromTo(
              featuredPlayRef.current,
              { opacity: 0, scale: 0.6, rotate: -20 },
              { opacity: 1, scale: 1, rotate: 0, duration: 0.7, ease: 'back.out(2)' },
              0.5
            );
          }

          const featuredInfo = [featuredTitleRef.current, featuredSubtitleRef.current].filter(Boolean);
          featuredTl.fromTo(
            featuredInfo,
            { opacity: 0, y: 24, filter: 'blur(6px)' },
            {
              opacity: 1,
              y: 0,
              filter: 'blur(0px)',
              duration: 0.6,
              stagger: 0.1,
              ease: 'power3.out',
            },
            0.55
          );

          /* -------------------------------------------------------
           * THUMBNAIL ENTRANCE + IMAGE REVEAL
           * ----------------------------------------------------- */
          thumbRefs.current.forEach((thumb, i) => {
            if (!thumb) return;
            const image = thumbImageRefs.current[i];

            const thumbTl = gsap.timeline({
              scrollTrigger: {
                trigger: thumbsRef.current,
                start: 'top 88%',
                toggleActions: 'play none none reverse',
              },
            });

            thumbTl.fromTo(
              thumb,
              {
                opacity: 0,
                y: 60 * intensity,
                scale: 0.88,
                rotateX: 12 * intensity,
                filter: 'blur(10px)',
                transformPerspective: 800,
              },
              {
                opacity: 1,
                y: 0,
                scale: 1,
                rotateX: 0,
                filter: 'blur(0px)',
                duration: 1,
                delay: i * 0.1,
                ease: 'back.out(1.4)',
              },
              0
            );

            if (image) {
              thumbTl.fromTo(
                image,
                {
                  scale: 1.2,
                  filter: 'blur(12px)',
                  clipPath: 'inset(14% round 12px)',
                },
                {
                  scale: 1,
                  filter: 'blur(0px)',
                  clipPath: 'inset(0% round 12px)',
                  duration: 1.15,
                  ease: 'power3.out',
                },
                i * 0.1 + 0.1
              );
            }

            const infoEls = [thumbTitleRefs.current[i], thumbArtistRefs.current[i]].filter(Boolean);
            thumbTl.fromTo(
              infoEls,
              { opacity: 0, y: 16, filter: 'blur(5px)' },
              {
                opacity: 1,
                y: 0,
                filter: 'blur(0px)',
                duration: 0.5,
                stagger: 0.06,
                ease: 'power3.out',
              },
              i * 0.1 + 0.3
            );
          });

          /* -------------------------------------------------------
           * 13. SCROLL PARALLAX
           * ----------------------------------------------------- */
          if (featuredImageRef.current) {
            gsap.to(featuredImageRef.current, {
              scale: 1.06,
              ease: 'none',
              scrollTrigger: {
                trigger: featuredRef.current,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1.4,
              },
            });
          }

          thumbRefs.current.forEach((thumb, i) => {
            const image = thumbImageRefs.current[i];
            if (!thumb) return;
            gsap.to(thumb, {
              y: -14 * intensity,
              ease: 'none',
              scrollTrigger: {
                trigger: thumb,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1.5,
              },
            });
            if (image) {
              gsap.to(image, {
                scale: 1.05,
                ease: 'none',
                scrollTrigger: {
                  trigger: thumb,
                  start: 'top bottom',
                  end: 'bottom top',
                  scrub: 1.5,
                },
              });
            }
          });

          /* -------------------------------------------------------
           * 14. AMBIENT FLOATING ANIMATION
           * ----------------------------------------------------- */
          thumbRefs.current.forEach((thumb, i) => {
            if (!thumb) return;
            gsap.to(thumb, {
              y: '+=6',
              duration: 3.6 + i * 0.3,
              ease: 'sine.inOut',
              yoyo: true,
              repeat: -1,
              delay: i * 0.35,
            });
          });

          // Featured play button gets a slow ambient pulse — near-invisible
          if (featuredPlayRef.current) {
            gsap.to(featuredPlayRef.current, {
              scale: 1.03,
              duration: 2.4,
              ease: 'sine.inOut',
              yoyo: true,
              repeat: -1,
            });
          }
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  /* ------------------------------------------------------------------
   * FEATURED VIDEO — hover, magnetic cursor, mouse parallax
   * ------------------------------------------------------------------ */
  useEffect(() => {
    const featured = featuredRef.current;
    const isTouch = window.matchMedia('(hover: none)').matches;
    if (!featured || isTouch) return;

    const image = featuredImageRef.current;
    const play = featuredPlayRef.current;
    const title = featuredTitleRef.current;
    const subtitle = featuredSubtitleRef.current;

    const imgXTo = image ? gsap.quickTo(image, 'x', { duration: 0.9, ease: 'power3.out' }) : null;
    const imgYTo = image ? gsap.quickTo(image, 'y', { duration: 0.9, ease: 'power3.out' }) : null;
    const playXTo = play ? gsap.quickTo(play, 'x', { duration: 0.7, ease: 'power3.out' }) : null;
    const playYTo = play ? gsap.quickTo(play, 'y', { duration: 0.7, ease: 'power3.out' }) : null;
    const titleXTo = title ? gsap.quickTo(title, 'x', { duration: 1, ease: 'power3.out' }) : null;
    const subtitleXTo = subtitle ? gsap.quickTo(subtitle, 'x', { duration: 1, ease: 'power3.out' }) : null;

    let hoverTl: gsap.core.Timeline | null = null;

    const handleEnter = () => {
      featured.style.willChange = 'transform';
      if (image) image.style.willChange = 'transform';

      hoverTl?.kill();
      hoverTl = gsap.timeline();

      hoverTl.to(
        featured,
        {
          boxShadow: '0 40px 80px -20px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,60,143,0.15)',
          duration: 0.6,
          ease: 'power3.out',
        },
        0
      );

      if (image) {
        hoverTl.to(image, { scale: 1.06, duration: 1, ease: 'power3.out' }, 0);
      }
    };

    const handleLeave = () => {
      hoverTl?.kill();
      hoverTl = gsap.timeline();

      hoverTl.to(
        featured,
        { boxShadow: '0 0px 0px rgba(0,0,0,0)', duration: 0.6, ease: 'power3.inOut' },
        0
      );
      if (image) {
        hoverTl.to(image, { scale: 1, x: 0, y: 0, duration: 0.9, ease: 'power3.inOut' }, 0);
      }

      playXTo?.(0);
      playYTo?.(0);
      titleXTo?.(0);
      subtitleXTo?.(0);

      featured.style.willChange = 'auto';
      if (image) image.style.willChange = 'auto';
    };

    const handleMove = (e: MouseEvent) => {
      const rect = featured.getBoundingClientRect();
      const relX = (e.clientX - rect.left) / rect.width - 0.5;
      const relY = (e.clientY - rect.top) / rect.height - 0.5;

      // Image parallax shifts independently, slightly stronger
      imgXTo?.(relX * 16);
      imgYTo?.(relY * 16);

      // Play button reacts subtly to cursor position
      playXTo?.(relX * 10);
      playYTo?.(relY * 10);

      // Bottom info drifts minimally for depth
      titleXTo?.(relX * 5);
      subtitleXTo?.(relX * 4);
    };

    featured.addEventListener('mouseenter', handleEnter);
    featured.addEventListener('mouseleave', handleLeave);
    featured.addEventListener('mousemove', handleMove);

    return () => {
      featured.removeEventListener('mouseenter', handleEnter);
      featured.removeEventListener('mouseleave', handleLeave);
      featured.removeEventListener('mousemove', handleMove);
      hoverTl?.kill();
    };
  }, []);

  /* ------------------------------------------------------------------
   * THUMBNAILS — hover, magnetic cursor, mouse parallax
   * ------------------------------------------------------------------ */
  useEffect(() => {
    const cleanupFns: Array<() => void> = [];
    const isTouch = window.matchMedia('(hover: none)').matches;

    thumbRefs.current.forEach((thumb, i) => {
      if (!thumb || isTouch) return;

      const image = thumbImageRefs.current[i];
      const play = thumbPlayRefs.current[i];
      const title = thumbTitleRefs.current[i];
      const artist = thumbArtistRefs.current[i];

      const xTo = gsap.quickTo(thumb, 'x', { duration: 0.6, ease: 'power3.out' });
      const yTo = gsap.quickTo(thumb, 'y', { duration: 0.6, ease: 'power3.out' });
      const rotateXTo = gsap.quickTo(thumb, 'rotateX', { duration: 0.6, ease: 'power3.out' });
      const rotateYTo = gsap.quickTo(thumb, 'rotateY', { duration: 0.6, ease: 'power3.out' });

      const imgXTo = image ? gsap.quickTo(image, 'x', { duration: 0.8, ease: 'power3.out' }) : null;
      const imgYTo = image ? gsap.quickTo(image, 'y', { duration: 0.8, ease: 'power3.out' }) : null;
      const playXTo = play ? gsap.quickTo(play, 'x', { duration: 0.7, ease: 'power3.out' }) : null;
      const playYTo = play ? gsap.quickTo(play, 'y', { duration: 0.7, ease: 'power3.out' }) : null;
      const titleXTo = title ? gsap.quickTo(title, 'x', { duration: 0.9, ease: 'power3.out' }) : null;
      const artistXTo = artist ? gsap.quickTo(artist, 'x', { duration: 0.9, ease: 'power3.out' }) : null;

      let hoverTl: gsap.core.Timeline | null = null;

      const handleEnter = () => {
        thumb.style.willChange = 'transform';
        if (image) image.style.willChange = 'transform';

        hoverTl?.kill();
        hoverTl = gsap.timeline();

        hoverTl.to(
          thumb,
          {
            scale: 1.03,
            y: -8,
            boxShadow: '0 24px 50px -18px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.08)',
            duration: 0.55,
            ease: 'power3.out',
          },
          0
        );

        if (image) {
          hoverTl.to(image, { scale: 1.1, rotate: 0.8, duration: 0.85, ease: 'power3.out' }, 0);
        }
        if (play) {
          hoverTl.to(play, { scale: 1.15, duration: 0.4, ease: 'back.out(2.2)' }, 0.05);
        }
      };

      const handleLeave = () => {
        hoverTl?.kill();
        hoverTl = gsap.timeline();

        hoverTl.to(
          thumb,
          {
            scale: 1,
            y: 0,
            rotateX: 0,
            rotateY: 0,
            boxShadow: '0 0px 0px rgba(0,0,0,0)',
            duration: 0.55,
            ease: 'power3.inOut',
          },
          0
        );
        if (image) {
          hoverTl.to(image, { scale: 1, rotate: 0, x: 0, y: 0, duration: 0.8, ease: 'power3.inOut' }, 0);
        }
        if (play) {
          hoverTl.to(play, { scale: 1, x: 0, y: 0, duration: 0.4, ease: 'power2.inOut' }, 0);
        }

        xTo(0);
        yTo(0);
        titleXTo?.(0);
        artistXTo?.(0);

        thumb.style.willChange = 'auto';
        if (image) image.style.willChange = 'auto';
      };

      const handleMove = (e: MouseEvent) => {
        const rect = thumb.getBoundingClientRect();
        const relX = (e.clientX - rect.left) / rect.width - 0.5;
        const relY = (e.clientY - rect.top) / rect.height - 0.5;

        xTo(relX * 7);
        yTo(relY * 7 - 8);
        rotateYTo(relX * 4);
        rotateXTo(-relY * 4);

        imgXTo?.(relX * 12);
        imgYTo?.(relY * 12);
        playXTo?.(relX * 8);
        playYTo?.(relY * 8);

        titleXTo?.(relX * 4);
        artistXTo?.(relX * 3);
      };

      thumb.addEventListener('mouseenter', handleEnter);
      thumb.addEventListener('mouseleave', handleLeave);
      thumb.addEventListener('mousemove', handleMove);

      cleanupFns.push(() => {
        thumb.removeEventListener('mouseenter', handleEnter);
        thumb.removeEventListener('mouseleave', handleLeave);
        thumb.removeEventListener('mousemove', handleMove);
        hoverTl?.kill();
      });
    });

    return () => {
      cleanupFns.forEach((fn) => fn());
    };
  }, []);

  /* ------------------------------------------------------------------
   * ALL VIDEOS BUTTON — hover arrow slide, text shift, glow
   * ------------------------------------------------------------------ */
  const handleAllVideosEnter = () => {
    gsap.to(allVideosBtnRef.current, {
      color: '#ffffff',
      x: 2,
      textShadow: '0 0 12px rgba(255,60,143,0.3)',
      duration: 0.3,
      ease: 'power2.out',
    });
    gsap.to(arrowRef.current, { x: 6, duration: 0.35, ease: 'power3.out' });
  };

  const handleAllVideosLeave = () => {
    gsap.to(allVideosBtnRef.current, {
      color: '#B8B8B8',
      x: 0,
      textShadow: '0 0 0px rgba(255,60,143,0)',
      duration: 0.3,
      ease: 'power2.inOut',
    });
    gsap.to(arrowRef.current, { x: 0, duration: 0.35, ease: 'power3.inOut' });
  };

  return (
    <section
      id="videos"
      ref={sectionRef}
      className="relative w-full bg-[#070707]"
      style={{ padding: 'clamp(80px, 10vh, 140px) clamp(1rem, 5vw, 4rem)' }}
    >
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <p
              ref={labelRef}
              className="font-display text-xs font-medium tracking-[0.08em] uppercase text-[#B8B8B8] mb-2"
            >
              VISUALS
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
              <span className="videos-heading-word inline-block">Music</span>{' '}
              <span className="videos-heading-word gradient-text inline-block">Videos</span>
            </h2>
          </div>
          <button
            ref={allVideosBtnRef}
            onMouseEnter={handleAllVideosEnter}
            onMouseLeave={handleAllVideosLeave}
            className="hidden md:flex items-center gap-2 font-display text-sm font-medium text-[#B8B8B8]"
          >
            All Videos
            <ArrowRight ref={arrowRef} size={16} />
          </button>
        </div>

        {/* Featured Video */}
        <div
          ref={featuredRef}
          className="relative rounded-2xl overflow-hidden cursor-pointer group"
          style={{ aspectRatio: '16/9' }}
        >
          <img
            ref={featuredImageRef}
            src={featuredVideo.image}
            alt={featuredVideo.title}
            className="w-full h-full object-cover"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#070707]/85 via-transparent to-transparent" />
          {/* Play button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              ref={featuredPlayRef}
              className="w-20 h-20 rounded-full bg-[rgba(255,60,143,0.9)] flex items-center justify-center"
            >
              <Play size={24} className="text-white ml-1" fill="white" />
            </div>
          </div>
          {/* Bottom info */}
          <div className="absolute bottom-6 left-6">
            <h3 ref={featuredTitleRef} className="font-display text-xl font-medium text-white">
              {featuredVideo.title}
            </h3>
            <p ref={featuredSubtitleRef} className="text-[13px] text-[#B8B8B8] mt-1">
              {featuredVideo.subtitle}
            </p>
          </div>
        </div>

        {/* Thumbnail Row */}
        <div ref={thumbsRef} className="flex gap-4 mt-5">
          {thumbnails.map((thumb, i) => (
            <div
              key={i}
              ref={(el) => {
                thumbRefs.current[i] = el;
              }}
              className="video-thumb relative rounded-xl overflow-hidden cursor-pointer group flex-1"
              style={{ aspectRatio: '16/9', transformStyle: 'preserve-3d' }}
            >
              <img
                ref={(el) => (thumbImageRefs.current[i] = el)}
                src={thumb.image}
                alt={thumb.title}
                className="w-full h-full object-cover"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#070707]/80 via-transparent to-transparent" />
              {/* Small play button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  ref={(el) => (thumbPlayRefs.current[i] = el)}
                  className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center"
                >
                  <Play size={16} className="text-white ml-0.5" fill="white" />
                </div>
              </div>
              {/* Bottom info */}
              <div className="absolute bottom-3 left-3">
                <h4 ref={(el) => (thumbTitleRefs.current[i] = el)} className="font-display text-sm font-medium text-white">
                  {thumb.title}
                </h4>
                <p ref={(el) => (thumbArtistRefs.current[i] = el)} className="text-xs text-[#B8B8B8]">
                  {thumb.artist}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}