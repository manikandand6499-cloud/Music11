import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flip } from 'gsap/Flip';
import { ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger, Flip);

const artists = [
  { name: 'Nova Reign', genre: 'Alternative R&B', image: '/images/artist-nova.jpg', size: 'large' },
  { name: 'Mira Sol', genre: 'Dream Pop', image: '/images/artist-mira.jpg', size: 'medium' },
  { name: 'BRUNO', genre: 'Hip-Hop', image: '/images/artist-bruno.jpg', size: 'standard' },
  { name: 'VOLT', genre: 'Electronic', image: '/images/artist-volt.jpg', size: 'standard' },
  { name: 'Aura Lewis', genre: 'Soul', image: '/images/artist-aura.jpg', size: 'standard' },
  { name: 'Zuri Lagos', genre: 'Afrobeats', image: '/images/artist-zuri.jpg', size: 'standard' },
];

export default function FeaturedArtists() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const grid = gridRef.current;
    if (!section || !grid) return;

    const cards = gsap.utils.toArray<HTMLElement>('.artist-card');
    if (cards.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cards,
        {
          scale: 0.5,
          rotationX: 75,
          rotationY: 10,
          autoAlpha: 0,
        },
        {
          scale: 1,
          rotationX: 0,
          rotationY: 0,
          autoAlpha: 1,
          ease: 'sine',
          stagger: {
            amount: 0.3,
            from: 'start',
          },
          scrollTrigger: {
            trigger: grid,
            start: 'top 85%',
            end: 'center center',
            scrub: 1,
          },
        }
      );
    }, section);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section
      id="artists"
      ref={sectionRef}
      className="relative w-full bg-[#070707]"
      style={{ padding: 'clamp(80px, 10vh, 140px) clamp(1rem, 5vw, 4rem)' }}
    >
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="font-display text-xs font-medium tracking-[0.08em] uppercase text-[#B8B8B8] mb-2">
              OUR ROSTER
            </p>
            <h2
              className="font-display font-bold text-white"
              style={{
                fontSize: 'clamp(2rem, 5vw, 4rem)',
                lineHeight: 1.0,
                letterSpacing: '-0.02em',
              }}
            >
              Featured <span className="gradient-text">Artists</span>
            </h2>
          </div>
          <button className="hidden md:flex items-center gap-2 font-display text-sm font-medium text-[#B8B8B8] hover:text-white transition-colors group">
            View All Artists
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Grid */}
        <div
          ref={gridRef}
          className="grid gap-4"
          style={{
            perspective: '1000px',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gridTemplateRows: 'repeat(2, 280px)',
          }}
        >
          {artists.map((artist, i) => {
            const isLarge = artist.size === 'large';
            const isMedium = artist.size === 'medium';
            return (
              <div
                key={i}
                className={`artist-card group relative rounded-xl overflow-hidden border border-white/[0.06] cursor-pointer ${isLarge
                    ? 'col-span-2 row-span-2'
                    : isMedium
                      ? 'col-span-1 row-span-2'
                      : 'col-span-1 row-span-1'
                  }`}
                style={{ willChange: 'transform' }}
              >
                <img
                  src={artist.image}
                  alt={artist.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#070707]/90 via-transparent to-transparent" />
                {/* Hover glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 shadow-[0_8px_32px_rgba(255,60,143,0.15)]" />
                {/* Artist info */}
                <div className="absolute bottom-5 left-5">
                  <h3 className="font-display text-lg font-medium text-white">
                    {artist.name}
                  </h3>
                  <p className="font-display text-[11px] uppercase tracking-wide text-[#B8B8B8] mt-1">
                    {artist.genre}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
