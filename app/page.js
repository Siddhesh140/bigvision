"use client";

import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import { useRef } from 'react';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Testimonials from './components/Testimonials';
import WhyBigVision from './components/WhyBigVision';
import './globals.css';

export default function Home() {
  const servicesTitleRef = useRef(null);
  const heroRef = useRef(null); // Ref for the hero section

  const { scrollYProgress } = useScroll({
    target: servicesTitleRef,
    offset: ["start end", "end start"]
  });
  const underlineScaleX = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0]);

  // --- Re-added hooks for parallax animation ---
  const { scrollYProgress: heroScrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  const backgroundParallaxY = useTransform(heroScrollYProgress, [0, 1], [0, 200]); 
  const contentParallaxY = useTransform(heroScrollYProgress, [0, 1], [0, -300]);


  return (
    <>
      <main
        className="relative mx-auto overflow-hidden w-full"
        style={{ backgroundColor: '#151515' }}
      >
        {/* Hero Section */}
        <div
          ref={heroRef} // Added ref to the hero container
          className="relative overflow-hidden w-full"
          style={{ height: '1133px' }}
        >
          <motion.div
            className="absolute inset-0 z-10"
            style={{ y: backgroundParallaxY }} // Apply parallax to background
          >
            <Image
              src="/Frame 3.svg"
              alt="Final background"
              layout="fill"
              objectFit="cover"
            />
          </motion.div>

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

          {/* Hero Content Block with Parallax */}
          <motion.div
            className="absolute z-40 top-[139px] left-1/2 -translate-x-1/2 w-full max-w-[880px] h-[357px] px-4"
            style={{ y: contentParallaxY }} // Apply parallax to content
          >
            {/* Sliding Text Animation */}
            <div className="relative w-full h-auto">
                <div className="h-auto md:h-[3.75rem] overflow-hidden">
                    <motion.h1
                        initial={{ x: "-100%" }}
                        animate={{ x: 0 }}
                        transition={{ duration: 1.2, ease: [0.6, 0.01, -0.05, 0.95], delay: 0.1 }}
                        className="text-center font-bold text-4xl md:text-[3.75rem] leading-tight uppercase text-transparent bg-clip-text"
                        style={{ fontFamily: "'Integral CF', sans-serif", backgroundImage: 'linear-gradient(90deg, #FFFFFF 0%, #EBEBEB 32.21%, #7A7A7A 75%, #525252 99.52%)' }}
                    >
                        Where B2B Brand
                    </motion.h1>
                </div>
                <div className="h-auto md:h-[3.75rem] overflow-hidden">
                    <motion.h1
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        transition={{ duration: 1.2, ease: [0.6, 0.01, -0.05, 0.95], delay: 0.5 }}
                        className="text-center font-bold text-4xl md:text-[3.75rem] leading-tight uppercase text-transparent bg-clip-text"
                        style={{ fontFamily: "'Integral CF', sans-serif", backgroundImage: 'linear-gradient(90deg, #FFFFFF 0%, #EBEBEB 32.21%, #7A7A7A 75%, #525252 99.52%)' }}
                    >
                        become industry authorities
                    </motion.h1>
                </div>
            </div>
            
            <div className="absolute top-[273px] left-0 right-0 flex flex-col sm:flex-row justify-center items-center gap-12 sm:gap-48">
              <div className="flex flex-col items-center gap-2">
                <p
                  className="font-bold text-4xl md:text-[3rem] text-transparent bg-clip-text"
                  style={{
                    fontFamily: "'Integral CF', sans-serif",
                    backgroundImage: 'linear-gradient(90deg, #FFFFFF 0%, #EBEBEB 32.21%, #7A7A7A 75%, #525252 99.52%)',
                  }}
                >
                  4000+
                </p>
                <p className="text-base md:text-[1.25rem] uppercase text-white" style={{ fontFamily: "'Roboto Mono', monospace" }}>
                  Leads Generated
                </p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <p
                  className="font-bold text-4xl md:text-[3rem] text-transparent bg-clip-text"
                  style={{
                    fontFamily: "'Integral CF', sans-serif",
                    backgroundImage: 'linear-gradient(90deg, #FFFFFF 0%, #EBEBEB 32.21%, #7A7A7A 75%, #525252 99.52%)',
                  }}
                >
                  12+
                </p>
                <p className="text-base md:text-[1.25rem] uppercase text-white" style={{ fontFamily: "'Roboto Mono', monospace" }}>
                  Brands Scaled
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Services Section */}
        <section
          id="services"
          className="relative w-full flex flex-col items-center -mt-16 md:-mt-[4.2rem] py-24 px-4 sm:px-8 lg:px-16 gap-16"
          style={{ background: "url('/ss2.png') center/cover no-repeat" }}
        >
          <div className="z-10 flex flex-col items-center gap-8 text-center">
            <div ref={servicesTitleRef} className="relative inline-block">
              <h2 className="text-4xl md:text-5xl lg:text-[3.75rem] font-bold text-white" style={{ fontFamily: "'Integral CF', sans-serif" }}>
                WHAT WE DO
              </h2>
              <motion.div
                className="absolute bottom-[-10px] left-0 right-0 h-1 bg-blue-500"
                style={{ scaleX: underlineScaleX, originX: 0.5 }}
              />
            </div>
            <p
              className="text-lg md:text-[1.25rem] text-white max-w-3xl"
              style={{ fontFamily: "'Roboto Mono', monospace" }}
            >
              Comprehensive LinkedIn solutions designed to transform your B2B presence into a lead generating powerhouse
            </p>
          </div>

          <div className="z-10 flex flex-col md:flex-row gap-8 w-full max-w-7xl">
            <div
              className="flex-1 flex flex-col p-7 gap-9 rounded-lg transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-[0_0_35px_rgba(59,130,246,0.4)]"
              style={{ backgroundColor: '#191919' }}
            >
              <div className="w-full h-64 sm:h-[22rem] relative">
                <Image src="/image 14.png" alt="Lead Generation" layout="fill" objectFit="cover" />
              </div>
              <div className="flex flex-col gap-4">
                <h3 className="text-2xl lg:text-[1.875rem] font-bold text-white" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  Lead Generation
                </h3>
                <p className="text-base lg:text-[1rem] text-gray-400" style={{ fontFamily: "'Roboto Mono', monospace" }}>
                  We don’t just connect - we convert.
                </p>
              </div>
              <p className="text-base lg:text-[1rem] text-white" style={{ fontFamily: "'Roboto Mono', monospace" }}>
                We provide lead generation globally. From cold outreach to warm conversations, we help you get in front of the right decision-makers with personalized, strategic messages. 
              </p>
            </div>

            <div
              className="flex-1 flex flex-col p-7 gap-9 rounded-lg transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-[0_0_35px_rgba(59,130,246,0.4)]"
              style={{ backgroundColor: '#191919' }}
            >
              <div className="w-full h-64 sm:h-[22rem] relative">
                <Image src="/image 14 (1).png" alt="Personal Branding" layout="fill" objectFit="cover" />
              </div>
              <div className="flex flex-col gap-4">
                <h3 className="text-2xl lg:text-[1.875rem] font-bold text-white" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  Personal Branding
                </h3>
                <p className="text-base lg:text-[1rem] text-gray-400" style={{ fontFamily: "'Roboto Mono', monospace" }}>
                  We build leaders — not just profiles.
                </p>
              </div>
              <p className="text-base lg:text-[1rem] text-white" style={{ fontFamily: "'Roboto Mono', monospace" }}>
                Your personal brand is your modern business card. We craft bold, story-driven content that positions you as the expert in your industry.
              </p>
            </div>

            <div
              className="flex-1 flex flex-col p-7 gap-9 rounded-lg transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-[0_0_35px_rgba(59,130,246,0.4)]"
              style={{ backgroundColor: '#191919' }}
            >
              <div className="w-full h-64 sm:h-[22rem] relative">
                <Image src="/image 14 (2).png" alt="Content Creation" layout="fill" objectFit="cover" />
              </div>
              <div className="flex flex-col gap-4">
                <h3 className="text-2xl lg:text-[1.875rem] font-bold text-white" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  Content Creation
                </h3>
                <p className="text-base lg:text-[1rem] text-gray-400" style={{ fontFamily: "'Roboto Mono', monospace" }}>
                  We know your audience — because we study your industry.
                </p>
              </div>
              <p className="text-base lg:text-[1rem] text-white" style={{ fontFamily: "'Roboto Mono', monospace" }}>
                Our team creates content that speaks your customers' language. Reels, carousels, thought-leadership posts tailored to your brand & buyer.
              </p>
            </div>
          </div>
        </section>

        <div id="why-us"><WhyBigVision /></div>
        <div id="testimonials"><Testimonials /></div>
        <div id="about"><Contact /></div>
        
        <Footer />
      </main>
    </>
  );
}