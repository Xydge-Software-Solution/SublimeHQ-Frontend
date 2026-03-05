'use client';
import { useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import Image from 'next/image';
import Link from 'next/link';

const navLinks = [
  { href: '#', label: 'How it works' },
  { href: '#', label: 'Features' },
  { href: '#', label: 'Blog' },
  { href: '#', label: 'Contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuItemsRef = useRef<HTMLAnchorElement[]>([]);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuRef.current || !overlayRef.current) return;

    const ctx = gsap.context(() => {
      if (isOpen) {
        // Animate overlay
        gsap.to(overlayRef.current, {
          opacity: 1,
          duration: 0.3,
          ease: 'power2.out',
        });

        // Animate menu
        gsap.fromTo(
          menuRef.current,
          { opacity: 0, y: -20, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'power3.out' }
        );

        // Stagger animate menu items
        gsap.fromTo(
          menuItemsRef.current,
          { opacity: 0, x: -20 },
          { opacity: 1, x: 0, duration: 0.3, stagger: 0.08, delay: 0.1, ease: 'power2.out' }
        );
      } else {
        gsap.to(overlayRef.current, {
          opacity: 0,
          duration: 0.2,
          ease: 'power2.in',
        });

        gsap.to(menuRef.current, {
          opacity: 0,
          y: -10,
          scale: 0.98,
          duration: 0.2,
          ease: 'power2.in',
        });
      }
    });

    return () => ctx.revert();
  }, [isOpen]);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-transparent backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="Sublime logo"
            width={36}
            height={36}
            className="h-10 w-full"
            priority
          />
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-700">
          {navLinks.map((link) => (
            <Link key={link.label} href={link.href} className="hover:text-black transition-colors">
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {/* Desktop CTA */}
          <button className="hidden sm:block px-5 py-2 text-sm font-medium text-white bg-gray-900 rounded-full hover:bg-gray-800 transition-colors">
            Start for free
          </button>

          {/* Hamburger Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden relative w-10 h-10 flex flex-col items-center justify-center gap-1.5 rounded-full bg-white/80 backdrop-blur-sm border border-gray-200 hover:bg-white transition-colors"
            aria-label="Toggle menu"
          >
            <span
              className={`w-5 h-0.5 bg-gray-800 rounded-full transition-all duration-300 ${
                isOpen ? 'rotate-45 translate-y-2' : ''
              }`}
            />
            <span
              className={`w-5 h-0.5 bg-gray-800 rounded-full transition-all duration-300 ${
                isOpen ? 'opacity-0 scale-0' : ''
              }`}
            />
            <span
              className={`w-5 h-0.5 bg-gray-800 rounded-full transition-all duration-300 ${
                isOpen ? '-rotate-45 -translate-y-2' : ''
              }`}
            />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        ref={overlayRef}
        onClick={() => setIsOpen(false)}
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden ${
          isOpen ? 'pointer-events-auto' : 'pointer-events-none opacity-0'
        }`}
      />

      {/* Mobile Dropdown Menu */}
      <div
        ref={menuRef}
        className={`fixed top-20 left-4 right-4 z-50 md:hidden bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden ${
          isOpen ? '' : 'pointer-events-none'
        }`}
        style={{ opacity: 0 }}
      >
        <div className="p-2">
          {navLinks.map((link, index) => (
            <Link
              key={link.label}
              href={link.href}
              ref={(el) => {
                if (el) menuItemsRef.current[index] = el;
              }}
              onClick={() => setIsOpen(false)}
              className="flex items-center px-4 py-3 text-base font-medium text-gray-700 rounded-xl hover:bg-gray-50 hover:text-black transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
        <div className="p-4 pt-2 border-t border-gray-100">
          <button className="w-full px-5 py-3 text-sm font-medium text-white bg-gray-900 rounded-full hover:bg-gray-800 transition-colors">
            Start for free
          </button>
        </div>
      </div>
    </>
  );
}
