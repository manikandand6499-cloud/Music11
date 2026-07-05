import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { value: 2.4, suffix: 'B', label: 'Monthly Streams' },
  { value: 47, suffix: '', label: 'Signed Artists' },
  { value: 12, suffix: '', label: 'Countries' },
  { value: 380, suffix: '+', label: 'Industry Awards' },
];

function AnimatedCounter({
  value,
  suffix,
  triggered,
}: {
  value: number;
  suffix: string;
  triggered: boolean;
}) {
  const [display, setDisplay] = useState('0');
  const isDecimal = value % 1 !== 0;

  useEffect(() => {
    if (!triggered) return;

    const obj = { val: 0 };
    gsap.to(obj, {
      val: value,
      duration: 2,
      ease: 'power2.out',
      snap: { val: isDecimal ? 0.1 : 1 },
      onUpdate: () => {
        if (isDecimal) {
          setDisplay(obj.val.toFixed(1));
        } else {
          setDisplay(String(Math.round(obj.val)));
        }
      },
    });
  }, [triggered, value, isDecimal]);

  return (
    <span>
      {display}
      {suffix}
    </span>
  );
}

export default function Statistics() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top 85%',
        once: true,
        onEnter: () => setTriggered(true),
      });

      // Entrance animation
      gsap.fromTo(
        section.querySelectorAll('.stat-item'),
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 85%',
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
      className="relative w-full bg-[#070707] border-y border-white/[0.06]"
      style={{ padding: 'clamp(60px, 8vh, 100px) clamp(1rem, 5vw, 4rem)' }}
    >
      <div className="max-w-[1400px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((stat, i) => (
          <div key={i} className="stat-item text-center opacity-0">
            <div
              className="font-display font-bold gradient-text"
              style={{
                fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
                lineHeight: 1.0,
                textShadow: '0 0 40px rgba(255,60,143,0.3)',
              }}
            >
              <AnimatedCounter value={stat.value} suffix={stat.suffix} triggered={triggered} />
            </div>
            <p className="font-display text-xs font-medium tracking-[0.08em] uppercase text-[#B8B8B8] mt-2">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
