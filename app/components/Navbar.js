'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { FONTS } from '../constants/styles';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Close menu on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isMenuOpen]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
    setIsMenuOpen(false);
  };

  return (
    <>
      <nav className="w-full py-4 px-4 sm:px-8 lg:px-16 flex items-center justify-between bg-black relative z-[100]" role="navigation" aria-label="Main navigation">

        {/* Logo and Company Name */}
        <div className="flex items-center gap-3 cursor-pointer">
          <div className="flex-shrink-0">
            <Image
              src="/Vector.svg"
              alt="BigVision Logo"
              width={51}
              height={28}
            />
          </div>
          <span
            className="text-white text-2xl font-bold"
            style={{
              fontFamily: FONTS.heading,
              textShadow: '0 0 15px rgba(59, 130, 246, 0.8)'
            }}
          >
            Big Vision
          </span>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-[40px] text-white font-medium">
          <button
            onClick={() => scrollToSection('services')}
            className="uppercase transition-all duration-300 hover:text-blue-500 hover:scale-110"
            aria-label="Navigate to Services section"
          >
            Services
          </button>
          <button
            onClick={() => scrollToSection('why-us')}
            className="uppercase transition-all duration-300 hover:text-blue-500 hover:scale-110"
            aria-label="Navigate to Why Us section"
          >
            Why Us
          </button>
          <button
            onClick={() => scrollToSection('testimonials')}
            className="uppercase transition-all duration-300 hover:text-blue-500 hover:scale-110"
            aria-label="Navigate to Testimonials section"
          >
            Testimonials
          </button>
          <button
            onClick={() => scrollToSection('about')}
            className="uppercase transition-all duration-300 hover:text-blue-500 hover:scale-110"
            aria-label="Navigate to About section"
          >
            About
          </button>
        </div>

        {/* Book a Call Button (Visible on Desktop) */}
        <button
          onClick={() => scrollToSection('about')}
          className="hidden md:block text-white font-semibold py-2 px-4 rounded-full bg-gradient-to-r from-[#31A2F3] to-[#2213C4] hover:opacity-90 transition-all duration-300 ease-in-out hover:scale-110"
          aria-label="Book a call with BigVision"
        >
          BOOK A CALL
        </button>

        {/* Hamburger Menu Icon (Visible on Mobile) */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-white focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}></path>
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        id="mobile-menu"
        className={`fixed top-0 left-0 w-full h-full bg-black bg-opacity-95 z-[90] transition-opacity duration-300 ease-in-out ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation menu"
      >
        <div className="flex flex-col items-center justify-center h-full gap-8 text-white text-2xl">
          <button
            onClick={() => scrollToSection('services')}
            className="uppercase focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-4 py-2"
          >
            Services
          </button>
          <button
            onClick={() => scrollToSection('why-us')}
            className="uppercase focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-4 py-2"
          >
            Why Us
          </button>
          <button
            onClick={() => scrollToSection('testimonials')}
            className="uppercase focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-4 py-2"
          >
            Testimonials
          </button>
          <button
            onClick={() => scrollToSection('about')}
            className="uppercase focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-4 py-2"
          >
            About
          </button>
          <button
            onClick={() => scrollToSection('about')}
            className="mt-8 text-white font-semibold py-3 px-6 rounded-full bg-gradient-to-r from-[#31A2F3] to-[#2213C4] focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            BOOK A CALL
          </button>
        </div>
      </div>
    </>
  );
};

export default Navbar;