import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Instagram, Twitter, Youtube, Music, Headphones } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const artistsLinks = ['Nova Reign', 'Mira Sol', 'VOLT', 'BRUNO', 'Zuri Lagos', 'Aura Lewis'];
const companyLinks = ['About', 'Careers', 'Press', 'Contact'];
const listenLinks = ['Apple Music', 'Spotify', 'YouTube Music', 'TIDAL', 'Amazon Music'];

const socialIcons = [
  { icon: Instagram, label: 'Instagram' },
  { icon: Twitter, label: 'Twitter' },
  { icon: Youtube, label: 'YouTube' },
  { icon: Music, label: 'Spotify' },
  { icon: Headphones, label: 'Apple Music' },
];

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const contentInnerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const socialWrapRef = useRef<HTMLDivElement>(null);
  const bottomBarRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const copyrightRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const footer = footerRef.current;
    const contentInner = contentInnerRef.current;
    const logo = logoRef.current;
    const desc = descRef.current;
    const socialWrap = socialWrapRef.current;
    const bottomBar = bottomBarRef.current;
    const divider = dividerRef.current;
    const copyright = copyrightRef.current;
    if (!footer || !contentInner || !logo || !desc || !socialWrap || !bottomBar || !divider || !copyright)
      return;

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

          const columns = Array.from(footer.querySelectorAll<HTMLElement>('.footer-column'));
          const headings = Array.from(footer.querySelectorAll<HTMLElement>('.footer-heading'));
          const links = Array.from(footer.querySelectorAll<HTMLElement>('.footer-link'));
          const socialButtons = Array.from(
            footer.querySelectorAll<HTMLElement>('.footer-social-icon')
          );
          const legalLinks = Array.from(footer.querySelectorAll<HTMLElement>('.footer-legal-link'));
          const gradientWord = logo.querySelector<HTMLElement>('.gradient-text');
          const cleanupFns: Array<() => void> = [];

          // -----------------------------------------------------------------
          // Reduced motion: show final state immediately, skip all motion.
          // -----------------------------------------------------------------
          if (reduceMotion) {
            gsap.set(
              [contentInner, logo, desc, bottomBar, divider, copyright, ...columns, ...socialButtons, ...links, ...legalLinks],
              { opacity: 1, y: 0, x: 0, scale: 1, rotate: 0, filter: 'blur(0px)' }
            );
            gsap.set(divider, { scaleX: 1 });
            return;
          }

          const power = isMobile ? 0.55 : 1;

          gsap.set([footer, contentInner, logo, ...columns, ...socialButtons], {
            willChange: 'transform, opacity, filter',
          });

          // -----------------------------------------------------------------
          // Whole-footer scroll parallax + logo scale settle while scrolling.
          // -----------------------------------------------------------------
          const footerScrollTween = gsap.to(contentInner, {
            y: -18 * power,
            ease: 'none',
            scrollTrigger: {
              trigger: footer,
              start: 'top bottom',
              end: 'bottom bottom',
              scrub: true,
            },
          });

          const logoScrollTween = gsap.to(logo, {
            scale: 1.04,
            ease: 'none',
            scrollTrigger: {
              trigger: footer,
              start: 'top bottom',
              end: 'bottom bottom',
              scrub: true,
            },
          });

          // -----------------------------------------------------------------
          // Master reveal timeline.
          // -----------------------------------------------------------------
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: footer,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          });

          tl
            // Footer reveal — fade, rise, tiny scale, blur-to-clear.
            .fromTo(
              contentInner,
              { opacity: 0, y: 36 * power, scale: 0.98, filter: 'blur(10px)' },
              { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: 1, ease: 'power3.out' }
            )
            // Logo — fade, rise, slight rotate + scale settle.
            .fromTo(
              logo,
              { opacity: 0, y: 24 * power, rotate: -4, scale: 0.92 },
              { opacity: 1, y: 0, rotate: 0, scale: 1, duration: 0.7, ease: 'power3.out' },
              '-=0.7'
            )
            // Description — synced right after the logo.
            .fromTo(
              desc,
              { opacity: 0, y: 16 * power, filter: 'blur(6px)' },
              { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.6, ease: 'power2.out' },
              '-=0.45'
            )
            // Social icons — spring in, one after another.
            .fromTo(
              socialButtons,
              { opacity: 0, scale: 0, rotate: -12 },
              {
                opacity: 1,
                scale: 1,
                rotate: 0,
                duration: 0.6,
                stagger: 0.07,
                ease: 'back.out(1.8)',
              },
              '-=0.35'
            )
            // Columns — Brand → Artists → Company → Listen On.
            .fromTo(
              columns,
              { opacity: 0, y: 28 * power, filter: 'blur(6px)' },
              {
                opacity: 1,
                y: 0,
                filter: 'blur(0px)',
                duration: 0.7,
                stagger: 0.12,
                ease: 'power2.out',
              },
              '-=0.5'
            )
            // Links — fade + slide in from the left, staggered.
            .fromTo(
              links,
              { opacity: 0, x: -14 * power, filter: 'blur(4px)' },
              {
                opacity: 1,
                x: 0,
                filter: 'blur(0px)',
                duration: 0.5,
                stagger: 0.025,
                ease: 'power2.out',
              },
              '-=0.55'
            )
            // Bottom bar — divider grows left to right, then copyright + legal links.
            .fromTo(divider, { scaleX: 0 }, { scaleX: 1, duration: 0.7, ease: 'power2.inOut' }, '-=0.15')
            .fromTo(
              copyright,
              { opacity: 0, y: 10 },
              { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
              '-=0.3'
            )
            .fromTo(
              legalLinks,
              { opacity: 0, y: 10 },
              { opacity: 1, y: 0, duration: 0.4, stagger: 0.06, ease: 'power2.out' },
              '-=0.35'
            );

          // -----------------------------------------------------------------
          // Ambient idle motion — near-invisible float on the logo and each
          // social icon, plus a slow shimmer sweeping across the gradient
          // wordmark. All paused during hover so nothing fights.
          // -----------------------------------------------------------------
          const logoFloatTween = gsap.to(logo, {
            y: '+=4',
            duration: 3.6,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
            delay: 1,
          });

          if (gradientWord) {
            gsap.set(gradientWord, { backgroundSize: '200% 100%', backgroundPosition: '0% 50%' });
            gsap.to(gradientWord, {
              backgroundPosition: '200% 50%',
              duration: 4.5,
              ease: 'sine.inOut',
              repeat: -1,
              yoyo: true,
              delay: 1.2,
            });
          }

          const iconFloatTweens = socialButtons.map((btn, i) =>
            gsap.to(btn, {
              y: '+=4',
              duration: 2.8 + i * 0.25,
              ease: 'sine.inOut',
              repeat: -1,
              yoyo: true,
              delay: 1.2 + i * 0.15,
            })
          );

          // -----------------------------------------------------------------
          // Social icon hover + magnetic pull + click bounce.
          // -----------------------------------------------------------------
          if (isFinePointer) {
            socialButtons.forEach((btn, i) => {
              const handleEnter = () => {
                iconFloatTweens[i].pause();
                gsap.to(btn, {
                  scale: 1.15,
                  y: -4,
                  rotate: 6,
                  boxShadow: '0 10px 24px rgba(255,60,143,0.4)',
                  duration: 0.35,
                  ease: 'power2.out',
                });
              };
              const handleMove = (e: MouseEvent) => {
                const rect = btn.getBoundingClientRect();
                const relX = e.clientX - (rect.left + rect.width / 2);
                const relY = e.clientY - (rect.top + rect.height / 2);
                gsap.to(btn, {
                  x: relX * 0.25,
                  y: relY * 0.25 - 4,
                  duration: 0.3,
                  ease: 'power2.out',
                });
              };
              const handleLeave = () => {
                gsap.to(btn, {
                  x: 0,
                  y: 0,
                  scale: 1,
                  rotate: 0,
                  boxShadow: '0 0px 0px rgba(255,60,143,0)',
                  duration: 0.5,
                  ease: 'elastic.out(1, 0.5)',
                  onComplete: () => iconFloatTweens[i].resume(),
                });
              };
              const handleClick = () => {
                gsap.timeline()
                  .to(btn, { scale: 0.85, duration: 0.1, ease: 'power2.out' })
                  .to(btn, { scale: 1.15, duration: 0.15, ease: 'power2.out' })
                  .to(btn, { scale: 1, duration: 0.2, ease: 'power2.out' });
              };
              btn.addEventListener('mouseenter', handleEnter);
              btn.addEventListener('mousemove', handleMove);
              btn.addEventListener('mouseleave', handleLeave);
              btn.addEventListener('click', handleClick);
              cleanupFns.push(() => {
                btn.removeEventListener('mouseenter', handleEnter);
                btn.removeEventListener('mousemove', handleMove);
                btn.removeEventListener('mouseleave', handleLeave);
                btn.removeEventListener('click', handleClick);
              });
            });

            // ---- Footer link hover: slide right + underline reveal --------
            links.forEach((link) => {
              const underline = link.querySelector<HTMLElement>('.footer-link-underline');
              const handleEnter = () => {
                gsap.to(link, { x: 4, duration: 0.3, ease: 'power2.out' });
                if (underline) gsap.to(underline, { scaleX: 1, duration: 0.3, ease: 'power2.out' });
              };
              const handleLeave = () => {
                gsap.to(link, { x: 0, duration: 0.35, ease: 'power2.out' });
                if (underline) gsap.to(underline, { scaleX: 0, duration: 0.25, ease: 'power2.in' });
              };
              link.addEventListener('mouseenter', handleEnter);
              link.addEventListener('mouseleave', handleLeave);
              cleanupFns.push(() => {
                link.removeEventListener('mouseenter', handleEnter);
                link.removeEventListener('mouseleave', handleLeave);
              });
            });

            // ---- Subtle whole-footer mouse parallax ------------------------
            const handleFooterMove = (e: MouseEvent) => {
              const rect = footer.getBoundingClientRect();
              const nx = (e.clientX - rect.left) / rect.width - 0.5;
              const ny = (e.clientY - rect.top) / rect.height - 0.5;

              gsap.to(logo, { x: nx * 10, duration: 1, ease: 'power3.out', overwrite: 'auto' });
              gsap.to(socialWrap, { x: nx * 8, duration: 1, ease: 'power3.out', overwrite: 'auto' });
              gsap.to(headings, {
                x: nx * 5,
                duration: 1.1,
                ease: 'power3.out',
                overwrite: 'auto',
              });
              gsap.to(columns, {
                y: ny * 4,
                duration: 1.2,
                ease: 'power3.out',
                overwrite: 'auto',
              });
            };
            footer.addEventListener('mousemove', handleFooterMove);
            cleanupFns.push(() => footer.removeEventListener('mousemove', handleFooterMove));
          }

          // gsap.context() + gsap.matchMedia() auto-revert every tween and
          // ScrollTrigger created above; this covers the plain DOM
          // listeners and infinite tweens that context can't see.
          return () => {
            footerScrollTween.kill();
            logoScrollTween.kill();
            logoFloatTween.kill();
            iconFloatTweens.forEach((t) => t.kill());
            cleanupFns.forEach((fn) => fn());
          };
        }
      );
    }, footer);

    return () => {
      ctx.revert();
      mm.revert();
    };
  }, []);

  return (
    <footer ref={footerRef} className="relative w-full bg-[#111111] border-t border-white/[0.06]">
      <div
        ref={contentInnerRef}
        className="max-w-[1400px] mx-auto opacity-0"
        style={{ padding: '60px clamp(1rem, 5vw, 4rem) 32px' }}
      >
        {/* Top Area */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="footer-column">
            <a
              ref={logoRef}
              href="#"
              className="font-display text-[20px] font-bold tracking-[0.12em] text-white inline-block opacity-0"
            >
              ELEV<span className="gradient-text">8</span>
            </a>
            <p
              ref={descRef}
              className="text-base text-[#B8B8B8] mt-3 max-w-[240px] opacity-0"
              style={{ lineHeight: 1.6 }}
            >
              Music that shapes culture.
            </p>
            <div ref={socialWrapRef} className="flex gap-4 mt-6">
              {socialIcons.map((social) => (
                <button
                  key={social.label}
                  aria-label={social.label}
                  className="footer-social-icon w-10 h-10 rounded-full bg-white/[0.06] flex items-center justify-center text-[#B8B8B8] hover:bg-[#ff3c8f] hover:text-white transition-colors duration-200 opacity-0"
                >
                  <social.icon size={18} />
                </button>
              ))}
            </div>
          </div>

          {/* Artists */}
          <div className="footer-column">
            <h4 className="footer-heading font-display text-xs font-medium tracking-[0.08em] uppercase text-[#B8B8B8] mb-5">
              Artists
            </h4>
            <ul className="space-y-0">
              {artistsLinks.map((link) => (
                <li key={link}>
                  <button className="footer-link relative inline-block text-sm text-[#B8B8B8] hover:text-white transition-colors duration-150 leading-[2.2]">
                    {link}
                    <span className="footer-link-underline absolute left-0 -bottom-0.5 h-px w-full origin-left scale-x-0 bg-white" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="footer-column">
            <h4 className="footer-heading font-display text-xs font-medium tracking-[0.08em] uppercase text-[#B8B8B8] mb-5">
              Company
            </h4>
            <ul className="space-y-0">
              {companyLinks.map((link) => (
                <li key={link}>
                  <button className="footer-link relative inline-block text-sm text-[#B8B8B8] hover:text-white transition-colors duration-150 leading-[2.2]">
                    {link}
                    <span className="footer-link-underline absolute left-0 -bottom-0.5 h-px w-full origin-left scale-x-0 bg-white" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Listen On */}
          <div className="footer-column">
            <h4 className="footer-heading font-display text-xs font-medium tracking-[0.08em] uppercase text-[#B8B8B8] mb-5">
              Listen On
            </h4>
            <ul className="space-y-0">
              {listenLinks.map((link) => (
                <li key={link}>
                  <button className="footer-link relative inline-block text-sm text-[#B8B8B8] hover:text-white transition-colors duration-150 leading-[2.2]">
                    {link}
                    <span className="footer-link-underline absolute left-0 -bottom-0.5 h-px w-full origin-left scale-x-0 bg-white" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          ref={bottomBarRef}
          className="mt-12 pt-6 flex flex-col sm:flex-row justify-between gap-4 relative"
        >
          <div
            ref={dividerRef}
            className="absolute top-0 left-0 w-full h-px bg-white/[0.06] origin-left scale-x-0"
          />
          <p ref={copyrightRef} className="text-xs text-[#B8B8B8] opacity-0">
            &copy; 2025 ELEV8 Music. All rights reserved.
          </p>
          <div className="flex gap-6">
            {['Privacy', 'Terms', 'Cookies'].map((link) => (
              <button
                key={link}
                className="footer-legal-link text-xs text-[#B8B8B8] hover:text-white transition-colors opacity-0"
              >
                {link}
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}