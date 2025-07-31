'use client';

import Image from 'next/image';

const Navbar = () => {
  // Function to handle smooth scrolling to a section
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      // The 'start' block alignment ensures the top of the section aligns with the top of the viewport
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  return (
    <nav className="w-full py-4 px-8 lg:px-16 flex items-center justify-between bg-black relative z-50">
      
      {/* --- FIX: Added company name next to the logo --- */}
      <div className="flex items-center gap-3 cursor-pointer">
        <div className="flex-shrink-0">
          <Image
            src="/Vector.svg"
            alt="BigVision Logo"
            width={51}
            height={28}
          />
        </div>
        <span className="text-white text-2xl font-bold" style={{ fontFamily: "'Integral CF', sans-serif" }}>
          Big Vision
        </span>
      </div>

      {/* Navigation links with onClick handlers and hover effects */}
      <div className="hidden md:flex items-center gap-[40px] text-white font-medium">
        <button 
          onClick={() => scrollToSection('services')} 
          className="uppercase transition-all duration-300 hover:text-blue-500 hover:scale-110"
        >
          Services
        </button>
        <button 
          onClick={() => scrollToSection('why-us')} 
          className="uppercase transition-all duration-300 hover:text-blue-500 hover:scale-110"
        >
          Why Us
        </button>
        <button 
          onClick={() => scrollToSection('testimonials')} 
          className="uppercase transition-all duration-300 hover:text-blue-500 hover:scale-110"
        >
          Testimonials
        </button>
        <button 
          onClick={() => scrollToSection('about')} 
          className="uppercase transition-all duration-300 hover:text-blue-500 hover:scale-110"
        >
          About
        </button>
      </div>

      <a 
        href="https://wa.me/919579662005"
        target="_blank"
        rel="noopener noreferrer"
        className="text-white font-semibold py-2 px-4 rounded-full bg-gradient-to-r from-[#31A2F3] to-[#2213C4] hover:opacity-90 transition-all duration-300 ease-in-out hover:scale-105"
      >
        BOOK A CALL
      </a>

    </nav>
  );
};

export default Navbar;