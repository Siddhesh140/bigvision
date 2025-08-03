'use client';

import Image from 'next/image';
import { useState } from 'react'; // Import useState for menu toggle

const Navbar = () => {
  // State to manage the visibility of the mobile menu
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Function to handle smooth scrolling to a section
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
    // Close the menu after clicking a link on mobile
    setIsMenuOpen(false);
  };

  return (
    <>
      <nav className="w-full py-4 px-4 sm:px-8 lg:px-16 flex items-center justify-between bg-black relative z-[100]">
        
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
              fontFamily: "'Integral CF', sans-serif",
              textShadow: '0 0 15px rgba(59, 130, 246, 0.8)'
            }}
          >
            Big Vision
          </span>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-[40px] text-white font-medium">
          <button onClick={() => scrollToSection('services')} className="uppercase transition-all duration-300 hover:text-blue-500 hover:scale-110">Services</button>
          <button onClick={() => scrollToSection('why-us')} className="uppercase transition-all duration-300 hover:text-blue-500 hover:scale-110">Why Us</button>
          <button onClick={() => scrollToSection('testimonials')} className="uppercase transition-all duration-300 hover:text-blue-500 hover:scale-110">Testimonials</button>
          <button onClick={() => scrollToSection('about')} className="uppercase transition-all duration-300 hover:text-blue-500 hover:scale-110">About</button>
        </div>

        {/* Book a Call Button (Visible on Desktop) */}
        <button 
          onClick={() => scrollToSection('about')}
          className="hidden md:block text-white font-semibold py-2 px-4 rounded-full bg-gradient-to-r from-[#31A2F3] to-[#2213C4] hover:opacity-90 transition-all duration-300 ease-in-out hover:scale-110"
        >
          BOOK A CALL
        </button>

        {/* Hamburger Menu Icon (Visible on Mobile) */}
        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white focus:outline-none">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}></path>
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`fixed top-0 left-0 w-full h-full bg-black bg-opacity-95 z-[99] transition-opacity duration-300 ease-in-out ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="flex flex-col items-center justify-center h-full gap-8 text-white text-2xl">
          <button onClick={() => scrollToSection('services')} className="uppercase">Services</button>
          <button onClick={() => scrollToSection('why-us')} className="uppercase">Why Us</button>
          <button onClick={() => scrollToSection('testimonials')} className="uppercase">Testimonials</button>
          <button onClick={() => scrollToSection('about')} className="uppercase">About</button>
          <button 
            onClick={() => scrollToSection('about')}
            className="mt-8 text-white font-semibold py-3 px-6 rounded-full bg-gradient-to-r from-[#31A2F3] to-[#2213C4]"
          >
            BOOK A CALL
          </button>
        </div>
      </div>
    </>
  );
};

export default Navbar;