import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const topSongs = [
  { rank: 1, song: 'Midnight Protocol', artist: 'Nova Reign', change: '+24%', up: true },
  { rank: 2, song: 'Lagos Nights', artist: 'Zuri Lagos', change: '+18%', up: true },
  { rank: 3, song: 'Ocean Mind', artist: 'VOLT', change: '+12%', up: true },
  { rank: 4, song: 'Golden Hour', artist: 'Aura Lewis', change: '+8%', up: true },
  { rank: 5, song: 'Electric', artist: 'Mira Sol', change: '-3%', up: false },
];

const topArtists = [
  { rank: 1, name: 'Nova Reign', plays: '4.2M', change: '+32%', up: true },
  { rank: 2, name: 'Zuri Lagos', plays: '3.8M', change: '+21%', up: true },
  { rank: 3, name: 'VOLT', plays: '2.9M', change: '+15%', up: true },
  { rank: 4, name: 'Mira Sol', plays: '2.1M', change: '+9%', up: true },
  { rank: 5, name: 'BRUNO', plays: '1.8M', change: '-5%', up: false },
];

const rankImages: Record<string, string> = {
  'Midnight Protocol': '/images/album-2.jpg',
  'Lagos Nights': '/images/album-5.jpg',
  'Ocean Mind': '/images/album-9.jpg',
  'Golden Hour': '/images/album-11.jpg',
  'Electric': '/images/album-7.jpg',
};

const artistImages: Record<string, string> = {
  'Nova Reign': '/images/artist-nova.jpg',
  'Zuri Lagos': '/images/artist-zuri.jpg',
  'VOLT': '/images/artist-volt.jpg',
  'Mira Sol': '/images/artist-mira.jpg',
  'BRUNO': '/images/artist-bruno.jpg',
};

export default function TrendingCharts() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Card entrance
      gsap.fromTo(
        cardRef.current,
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

      // Rows stagger
      const rows = section.querySelectorAll('.chart-row');
      gsap.fromTo(
        rows,
        { x: -20, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          stagger: 0.06,
          duration: 0.5,
          ease: 'power2.out',
          delay: 0.3,
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
      id="charts"
      ref={sectionRef}
      className="relative w-full bg-[#111111]"
      style={{ padding: 'clamp(80px, 10vh, 140px) clamp(1rem, 5vw, 4rem)' }}
    >
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="mb-12">
          <p className="font-display text-xs font-medium tracking-[0.08em] uppercase text-[#B8B8B8] mb-2">
            THIS WEEK
          </p>
          <h2
            className="font-display font-bold text-white"
            style={{
              fontSize: 'clamp(2rem, 5vw, 4rem)',
              lineHeight: 1.0,
              letterSpacing: '-0.02em',
            }}
          >
            Trending <span className="gradient-text">Charts</span>
          </h2>
        </div>

        {/* Glass Card */}
        <div
          ref={cardRef}
          className="rounded-2xl p-6 md:p-10 opacity-0"
          style={{
            background: 'rgba(22,22,22,0.6)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <div className="flex flex-col md:flex-row gap-8 md:gap-12">
            {/* Top Songs */}
            <div className="flex-1">
              <h3 className="font-display text-sm font-medium uppercase tracking-[0.08em] text-[#B8B8B8] pb-3 mb-6 border-b border-white/[0.06]">
                Top Songs
              </h3>
              <div className="space-y-0">
                {topSongs.map((item) => (
                  <div
                    key={item.rank}
                    className="chart-row flex items-center gap-4 py-3.5 px-3 -mx-3 rounded-lg hover:bg-white/[0.03] transition-colors cursor-pointer opacity-0"
                  >
                    <span
                      className={`font-display text-xl font-bold w-8 ${
                        item.rank <= 3 ? 'gradient-text' : 'text-[#B8B8B8]'
                      }`}
                    >
                      {item.rank}
                    </span>
                    <img
                      src={rankImages[item.song]}
                      alt={item.song}
                      className="w-11 h-11 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-display text-[15px] font-medium text-white truncate">
                        {item.song}
                      </p>
                      <p className="text-[13px] text-[#B8B8B8]">{item.artist}</p>
                    </div>
                    <span
                      className={`text-xs font-medium ${
                        item.up ? 'text-green-400' : 'text-red-400'
                      }`}
                    >
                      {item.change}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Artists */}
            <div className="flex-1">
              <h3 className="font-display text-sm font-medium uppercase tracking-[0.08em] text-[#B8B8B8] pb-3 mb-6 border-b border-white/[0.06]">
                Top Artists
              </h3>
              <div className="space-y-0">
                {topArtists.map((item) => (
                  <div
                    key={item.rank}
                    className="chart-row flex items-center gap-4 py-3.5 px-3 -mx-3 rounded-lg hover:bg-white/[0.03] transition-colors cursor-pointer opacity-0"
                  >
                    <span
                      className={`font-display text-xl font-bold w-8 ${
                        item.rank <= 3 ? 'gradient-text' : 'text-[#B8B8B8]'
                      }`}
                    >
                      {item.rank}
                    </span>
                    <img
                      src={artistImages[item.name]}
                      alt={item.name}
                      className="w-11 h-11 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-display text-[15px] font-medium text-white truncate">
                        {item.name}
                      </p>
                      <p className="text-[13px] text-[#B8B8B8]">{item.plays} plays</p>
                    </div>
                    <span
                      className={`text-xs font-medium ${
                        item.up ? 'text-green-400' : 'text-red-400'
                      }`}
                    >
                      {item.change}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
