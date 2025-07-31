"use client";

import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import { useRef } from 'react';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Testimonials from './components/Testimonials';
import WhyBigVision from './components/WhyBigVision';
// --- FIX: The Navbar should only be in layout.js, so we remove the import from here ---
// import Navbar from './components/Navbar';
import './globals.css';

export default function Home() {
  // --- Hooks for the underline animation ---
  const servicesTitleRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: servicesTitleRef,
    offset: ["start end", "end start"] // Track from when the bottom of the element enters the viewport to when the top leaves
  });
  // Map scroll progress to the underline's width (scaleX)
  const underlineScaleX = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0]);


  return (
    <>
      {/* --- FIX: The Navbar component is removed from here --- */}
      <main
        className="relative mx-auto overflow-hidden"
        style={{ width: '1440px', backgroundColor: '#151515' }}
      >
        {/* Hero Section */}
        <div
          className="relative overflow-hidden"
          style={{ height: '1133px', backgroundColor: '#0A0A0A' }}
        >
          {/* Layered Cloud Animation */}
          <motion.div
            className="absolute inset-0 z-10"
            initial={{ x: 0 }}
            animate={{ x: [0, -20, 0], y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 30, ease: 'linear' }}
          >
            <Image
              src="/Frame 3.svg"
              alt="Final background"
              layout="fill"
              objectFit="cover"
            />
          </motion.div>

          {/* Glowing Logo Behind */}
          <motion.div
            className="absolute top-[100px] left-1/2 z-0"
            style={{ transform: 'translateX(-50%)', width: '300px', height: '300px' }}
            animate={{ opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <div
              className="w-full h-full rounded-full"
              style={{
                boxShadow: '0 0 80px 40px rgba(0, 255, 255, 0.2)',
                background: 'radial-gradient(circle, rgba(0,255,255,0.4) 0%, rgba(0,0,0,0) 70%)'
              }}
            ></div>
          </motion.div>

          {/* Hero Content Block */}
          <div
            className="absolute z-40"
            style={{
              left: '50%',
              top: '139px',
              transform: 'translateX(-50%)',
              width: '880px',
              height: '357px',
            }}
          >
            {/* --- NEW: Sliding Text Animation --- */}
            <div className="relative w-full h-auto overflow-hidden">
                {/* Top Half Sliding from Left */}
                <div className="h-[3.75rem] overflow-hidden">
                    <motion.h1
                        initial={{ x: "-100%" }}
                        animate={{ x: 0 }}
                        transition={{ duration: 1.2, ease: [0.6, 0.01, -0.05, 0.95], delay: 0.1 }}
                        className="text-center font-bold text-[3.75rem] leading-none uppercase text-transparent bg-clip-text"
                        style={{ fontFamily: "'Integral CF', sans-serif", width: '880px', backgroundImage: 'linear-gradient(90deg, #FFFFFF 0%, #EBEBEB 32.21%, #7A7A7A 75%, #525252 99.52%)' }}
                    >
                        Where B2B Brand
                    </motion.h1>
                </div>
                {/* Bottom Half Sliding from Right */}
                <div className="h-[3.75rem] overflow-hidden">
                    <motion.h1
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        transition={{ duration: 1.2, ease: [0.6, 0.01, -0.05, 0.95], delay: 0.5 }}
                        className="text-center font-bold text-[3.75rem] leading-none uppercase text-transparent bg-clip-text"
                        style={{ fontFamily: "'Integral CF', sans-serif", width: '880px', backgroundImage: 'linear-gradient(90deg, #FFFFFF 0%, #EBEBEB 32.21%, #7A7A7A 75%, #525252 99.52%)' }}
                    >
                        become industry authorities
                    </motion.h1>
                </div>
            </div>
            


            <div className="absolute flex flex-col" style={{ left: '176px', top: '273px', gap: '0.875rem' }}>
              
              <p
                className="font-bold text-[3rem] text-transparent bg-clip-text"
                style={{
                  fontFamily: "'Integral CF', sans-serif",
                  backgroundImage: 'linear-gradient(90deg, #FFFFFF 0%, #EBEBEB 32.21%, #7A7A7A 75%, #525252 99.52%)',
                  
                }}
              >
                4000+
              </p>
              <p className="text-[1.25rem] uppercase text-white" style={{ fontFamily: "'Roboto Mono', monospace" }}>
                Leads Generated
              </p>
            </div>

            <div className="absolute flex flex-col" style={{ left: '618px', top: '266px', gap: '0.875rem' }}>
              <p
                className="font-bold text-[3rem] text-transparent bg-clip-text"
                style={{
                  fontFamily: "'Integral CF', sans-serif",
                  backgroundImage: 'linear-gradient(90deg, #FFFFFF 0%, #EBEBEB 32.21%, #7A7A7A 75%, #525252 99.52%)',
                }}
              >
                12+
              </p>
              <p className="text-[1.25rem] uppercase text-white" style={{ fontFamily: "'Roboto Mono', monospace" }}>
                Brands Scaled
              </p>
            </div>
          </div>
        </div>

        {/* Services Section */}
        <section
          id="services"
          className="relative w-full flex flex-col items-center -mt-[4.2rem] pb-[15rem] px-[5rem] gap-[4rem]"
          style={{ background: "url('/ss2.png') center/cover no-repeat" }}
        >
          <div className="z-10 flex flex-col items-center gap-8 mb-16 text-center">
            <div ref={servicesTitleRef} className="relative inline-block">
              <h2 className="text-[3.75rem] font-bold text-white" style={{ fontFamily: "'Integral CF', sans-serif" }}>
                WHAT WE DO
              </h2>
              <motion.div
                className="absolute bottom-[-10px] left-0 right-0 h-1 bg-blue-500"
                style={{ scaleX: underlineScaleX, originX: 0.5 }} // Apply the transformed scaleX
              />
            </div>
            <p
              className="text-[1.25rem] text-white max-w-2xl"
              style={{ fontFamily: "'Roboto Mono', monospace" }}
            >
              Comprehensive LinkedIn solutions designed to transform your B2B presence into a lead generating powerhouse
            </p>
          </div>

          <div className="z-10 flex flex-row gap-8 w-full max-w-7xl">
            {/* Card 1 */}
            <div
              className="flex-1 flex flex-col p-7 gap-9 rounded-lg transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-[0_0_35px_rgba(59,130,246,0.4)]"
              style={{ backgroundColor: '#191919' }}
            >
              <div className="w-full h-[22rem] relative">
                <Image src="/image 14.png" alt="Lead Generation" layout="fill" objectFit="cover" />
              </div>
              <div className="flex flex-col gap-4">
                <h3 className="text-[1.875rem] font-bold text-white" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  Lead Generation
                </h3>
                <p className="text-[1rem] text-gray-400" style={{ fontFamily: "'Roboto Mono', monospace" }}>
                  We don’t just connect - we convert.
                </p>
              </div>
              <p className="text-[1rem] text-white" style={{ fontFamily: "'Roboto Mono', monospace" }}>
                We provide lead generation globally. From cold outreach to warm conversations, we help you get in front of the right decision-makers with personalized, strategic messages. 
              </p>
            </div>

            {/* Card 2 */}
            <div
              className="flex-1 flex flex-col p-7 gap-9 rounded-lg transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-[0_0_35px_rgba(59,130,246,0.4)]"
              style={{ backgroundColor: '#191919' }}
            >
              <div className="w-full h-[22rem] relative">
                <Image src="/image 14 (1).png" alt="Personal Branding" layout="fill" objectFit="cover" />
              </div>
              <div className="flex flex-col gap-4">
                <h3 className="text-[1.875rem] font-bold text-white" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  Personal Branding
                </h3>
                <p className="text-[1rem] text-gray-400" style={{ fontFamily: "'Roboto Mono', monospace" }}>
                  We build leaders — not just profiles.
                </p>
              </div>
              <p className="text-[1rem] text-white" style={{ fontFamily: "'Roboto Mono', monospace" }}>
                Your personal brand is your modern business card. We craft bold, story-driven content that positions you as the expert in your industry.
              </p>
            </div>

            {/* Card 3 */}
            <div
              className="flex-1 flex flex-col p-7 gap-9 rounded-lg transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-[0_0_35px_rgba(59,130,246,0.4)]"
              style={{ backgroundColor: '#191919' }}
            >
              <div className="w-full h-[22rem] relative">
                <Image src="/image 14 (2).png" alt="Content Creation" layout="fill" objectFit="cover" />
              </div>
              <div className="flex flex-col gap-4">
                <h3 className="text-[1.875rem] font-bold text-white" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  Content Creation
                </h3>
                <p className="text-[1rem] text-gray-400" style={{ fontFamily: "'Roboto Mono', monospace" }}>
                  We know your audience — because we study your industry.
                </p>
              </div>
              <p className="text-[1rem] text-white" style={{ fontFamily: "'Roboto Mono', monospace" }}>
                Our team creates content that speaks your customers' language. Reels, carousels, thought-leadership posts tailored to your brand & buyer.
              </p>
            </div>
          </div>
        </section>

        {/* Other Sections */}
        <div id="why-us"><WhyBigVision /></div>
        <div id="testimonials"><Testimonials /></div>
        <div id="about"><Contact /></div>
        
        <Footer />
      </main>
    </>
  );
}