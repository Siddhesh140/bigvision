"use client";

import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import { useRef, useState } from 'react';
import { submitForm } from './actions';
import Footer from './components/Footer';
import Modal from './components/Modal';
import { CheckIcon, CalendarIcon, UserIcon, MailIcon, PhoneIcon, CompanyIcon, ChatIcon, CalendarGradientIcon } from './components/icons';
import { ServiceCard, StatCard, FeatureCard, TestimonialCard, InfoCard, CTACard } from './components/cards/cards';
import GradientText from './components/cards/GradientText';
import { FONTS, COLORS, EFFECTS } from './constants/styles';
import { testimonials } from './data/testimonials';
import { validateEmail, validatePhone, validateName, validateCompany } from './utils/validation';
import './globals.css';

export default function Home() {
  // Form state
  const [status, setStatus] = useState('idle');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errors, setErrors] = useState({});

  // Refs for animations
  const servicesTitleRef = useRef(null);
  const heroRef = useRef(null);

  // Scroll animations
  const { scrollYProgress } = useScroll({
    target: servicesTitleRef,
    offset: ["start end", "end start"]
  });
  const underlineScaleX = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0]);

  const { scrollYProgress: heroScrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  const backgroundParallaxY = useTransform(heroScrollYProgress, [0, 1], [0, 200]);
  const contentParallaxY = useTransform(heroScrollYProgress, [0, 1], [0, -300]);

  // Form submission handler
  const handleFormSubmit = async (formData) => {
    const newErrors = {};
    const name = formData.get('name');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const company = formData.get('company');

    if (!validateName(name)) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!validatePhone(phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    if (!validateCompany(company)) {
      newErrors.company = 'Company name must be at least 2 characters';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setStatus('submitting');
    const result = await submitForm(formData);
    if (result.success) {
      setStatus('success');
      setIsModalOpen(true);
      document.getElementById('contact-form')?.reset();
    } else {
      setStatus('error');
    }
  };

  return (
    <>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h3 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: FONTS.subheading }}>
          Form Submitted Successfully!
        </h3>
        <p className="text-lg text-gray-300" style={{ fontFamily: FONTS.body }}>
          Thank you for reaching out. We&apos;ll contact you soon!
        </p>
      </Modal>

      <main
        className="relative mx-auto overflow-hidden w-full"
        style={{ backgroundColor: COLORS.background.primary }}
      >
        {/* Hero Section */}
        <section
          ref={heroRef}
          className="relative overflow-hidden w-full"
          style={{ height: '1133px' }}
          aria-label="Hero section"
        >
          <motion.div
            className="absolute inset-0 z-10"
            style={{ y: backgroundParallaxY }}
          >
            <Image
              src="/Frame 3.svg"
              alt="Abstract background design"
              fill
              style={{ objectFit: 'cover' }}
              priority
              sizes="100vw"
            />
          </motion.div>

          {/* Animated Glow Effect */}
          <motion.div
            className="absolute top-[100px] left-1/2 z-0"
            style={{ transform: 'translateX(-50%)', width: '300px', height: '300px' }}
            animate={{ opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 4, repeat: Infinity }}
            aria-hidden="true"
          >
            <div
              className="w-full h-full rounded-full"
              style={{
                boxShadow: '0 0 80px 40px rgba(0, 255, 255, 0.2)',
                background: 'radial-gradient(circle, rgba(0,255,255,0.4) 0%, rgba(0,0,0,0) 70%)'
              }}
            ></div>
          </motion.div>

          {/* Hero Content with Sliding Text Animation */}
          <motion.div
            className="absolute z-40 top-[139px] left-1/2 -translate-x-1/2 w-full max-w-[880px] h-auto px-4"
            style={{ y: contentParallaxY }}
          >
            <div className="relative w-full h-auto flex flex-col gap-4">
              {/* First Line - Slide from Left */}
              <div className="h-auto md:h-[3.75rem] overflow-hidden">
                <motion.h1
                  initial={{ x: "-100%" }}
                  animate={{ x: 0 }}
                  transition={{ duration: 1.2, ease: [0.6, 0.01, -0.05, 0.95], delay: 0.1 }}
                  className="text-center font-bold text-4xl md:text-[3.75rem] leading-tight uppercase text-transparent bg-clip-text"
                  style={{
                    fontFamily: FONTS.heading,
                    backgroundImage: 'linear-gradient(90deg, #FFFFFF 0%, #EBEBEB 32.21%, #7A7A7A 75%, #525252 99.52%)'
                  }}
                >
                  Where B2B Brands
                </motion.h1>
              </div>

              {/* Second Line - Slide from Right */}
              <div className="h-auto md:h-[3.75rem] overflow-hidden">
                <motion.h1
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  transition={{ duration: 1.2, ease: [0.6, 0.01, -0.05, 0.95], delay: 0.5 }}
                  className="text-center font-bold text-4xl md:text-[3.75rem] leading-tight uppercase text-transparent bg-clip-text"
                  style={{
                    fontFamily: FONTS.heading,
                    backgroundImage: 'linear-gradient(90deg, #FFFFFF 0%, #EBEBEB 32.21%, #7A7A7A 75%, #525252 99.52%)'
                  }}
                >
                  Become Industry Authorities
                </motion.h1>
              </div>

              {/* Subtitle with Fade In */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1 }}
                className="text-center text-lg sm:text-xl md:text-2xl text-white max-w-4xl mx-auto mt-8"
                style={{ fontFamily: FONTS.body }}
              >
                We help manufacturing leaders generate real business through strategic LinkedIn marketing
              </motion.p>
            </div>
          </motion.div>
        </section>

        {/* Services Section */}
        <section
          id="services"
          className="w-full flex flex-col items-center py-16 px-4 sm:px-8 lg:px-20 gap-12"
          style={{ backgroundColor: COLORS.background.primary }}
          aria-labelledby="services-title"
        >
          <div className="text-center flex flex-col items-center gap-8">
            <div ref={servicesTitleRef} className="relative">
              <h2
                id="services-title"
                className="text-4xl md:text-6xl font-bold text-white"
                style={{ fontFamily: FONTS.heading }}
              >
                What We Do
              </h2>
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#31A2F3] to-[#2213C4]"
                style={{ scaleX: underlineScaleX, transformOrigin: 'center' }}
                aria-hidden="true"
              />
            </div>
            <p className="text-lg md:text-xl text-white" style={{ fontFamily: FONTS.body }}>
              Full-service LinkedIn marketing for B2B manufacturers
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-7 w-full max-w-7xl">
            <ServiceCard
              image="/image 14 (1).png"
              title="Personal Branding"
              subtitle="We don&apos;t just connect - we convert."
              description="Your LinkedIn profile is your digital handshake. We transform it into a lead-generating asset that positions you as the go-to expert in your industry."
              alt="Professional networking and personal branding illustration"
            />
            <ServiceCard
              image="/image 14 (2).png"
              title="Content Creation"
              subtitle="Content that speaks manufacturing."
              description="From reels to carousels, we create scroll-stopping content that resonates with decision-makers. Every post is designed to educate, engage, and convert."
              alt="Content creation and digital marketing illustration"
            />
            <ServiceCard
              image="/image 14.png"
              title="Lead Generation"
              subtitle="Qualified leads, not just likes."
              description="Our team creates content that speaks your customers&apos; language. Reels, carousels, thought-leadership posts tailored to your brand & buyer."
              alt="Lead generation and business growth illustration"
            />
          </div>
        </section>

        {/* Why Big Vision Section */}
        <section
          id="why-us"
          className="w-full flex flex-col items-center py-16 px-4 sm:px-8 lg:px-20 gap-12"
          style={{ backgroundColor: COLORS.background.primary }}
        >
          <div className="text-center flex flex-col items-center gap-8">
            <h2 className="text-4xl md:text-6xl font-bold text-white" style={{ fontFamily: FONTS.heading }}>
              Why Big Vision?
            </h2>
            <p className="text-lg md:text-xl text-white" style={{ fontFamily: FONTS.body }}>
              No fluff. Just focused execution.
            </p>
            <p className="text-xl md:text-2xl text-white max-w-3xl mt-4" style={{ fontFamily: FONTS.subheading }}>
              We combine deep manufacturing insight with marketing precision to bring you one thing: business growth
            </p>
          </div>

          {/* Large Image with Text Overlay */}
          <div className="relative w-full max-w-7xl h-[400px] md:h-[644px]">
            <Image
              src="/image15.png"
              alt="Team collaborating on business strategy"
              fill
              style={{ objectFit: 'cover' }}
              sizes="(max-width: 768px) 100vw, 1280px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
            <div className="absolute bottom-8 left-8 md:bottom-14 md:left-14 z-10 text-white">
              <h3 className="text-2xl md:text-4xl font-bold" style={{ fontFamily: FONTS.subheading }}>
                We make social media work like sales.
              </h3>
              <p className="text-base md:text-xl mt-4" style={{ fontFamily: FONTS.body }}>
                Strategic. Targeted. Results-driven.
              </p>
            </div>
          </div>

          {/* Stat Cards */}
          <div className="flex flex-col md:flex-row gap-7 w-full max-w-7xl">
            <StatCard icon="/logo100.png" number="4000+" label="B2B leads" />
            <StatCard icon="/logo101.png" number="12+" label="Brands scaled" />
            <StatCard icon="/logo102.png" number="75%+" label="Conversions" />
          </div>
        </section>

        {/* Who We Work With / What Makes Us Different */}
        <section
          className="w-full flex flex-col items-center py-16 px-4 sm:px-8 lg:px-20"
          style={{ backgroundColor: COLORS.background.primary }}
        >
          <div className="flex flex-col lg:flex-row gap-16 w-full max-w-7xl">
            <FeatureCard
              title="Who We Work With"
              subtitle="We specialize in scaling B2B brands in:"
              features={[
                "Manufacturing (automotive, aerospace, tooling, X-ray, robotics)",
                "Industrial SaaS & Tech for factories",
                "MSME / SME founders targeting global growth",
                "Founders/MDs seeking a stronger LinkedIn presence"
              ]}
              icon={CheckIcon}
            />
            <FeatureCard
              title="What Makes Us Different"
              subtitle="One partner. One plan. All execution."
              features={[
                "We understand how industrial buying works",
                "We speak manufacturing — no generic marketing",
                "We treat your brand like it's our own",
                "And we care more about conversions than clicks"
              ]}
              icon={CheckIcon}
              isDark={true}
            />
          </div>
        </section>

        {/* Call to Action Section */}
        <section
          className="w-full flex flex-col items-center py-16 px-4 sm:px-8 lg:px-20"
          style={{ backgroundColor: COLORS.background.primary }}
        >
          <div className="flex flex-col lg:flex-row justify-between items-center w-full max-w-7xl gap-12">
            <div className="flex flex-col gap-8 text-center lg:text-left">
              <div className="flex flex-col gap-6">
                <h2 className="text-4xl md:text-5xl font-bold text-white" style={{ fontFamily: FONTS.heading }}>
                  You&apos;ve spent years building your company.
                </h2>
                <p className="text-lg md:text-xl text-white" style={{ fontFamily: FONTS.body }}>
                  Now it&apos;s time to make the world notice. Let&apos;s grow your presence and pipeline — together.
                </p>
              </div>
              <p className="text-sm md:text-base text-gray-400" style={{ fontFamily: FONTS.body }}>
                Click to start a WhatsApp conversation • Free consultation • No commitment required
              </p>
            </div>
            <a
              href="https://wa.me/919579662005"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 py-3 px-5 bg-[#2C76E5] text-white rounded-lg transition-transform duration-300 hover:scale-105 flex-shrink-0"
              aria-label="Schedule a strategy call via WhatsApp"
            >
              <CalendarIcon />
              <span className="text-base md:text-lg font-bold" style={{ fontFamily: FONTS.subheading }}>
                Schedule a Strategy Call
              </span>
            </a>
          </div>
        </section>

        {/* Testimonials Section */}
        <section
          id="testimonials"
          className="w-full flex flex-col items-center py-16 px-4 sm:px-8 lg:px-20 gap-12"
          style={{ backgroundColor: COLORS.background.primary }}
        >
          <div className="text-center flex flex-col items-center gap-8">
            <GradientText as="h2" className="text-4xl md:text-6xl font-bold">
              Client Wins
            </GradientText>
            <p className="text-lg md:text-xl text-white" style={{ fontFamily: FONTS.body }}>
              Real results from real manufacturing leaders
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-7 w-full max-w-7xl">
            {testimonials.map((testimonial) => (
              <TestimonialCard
                key={testimonial.id}
                quote={testimonial.quote}
                author={testimonial.author}
              />
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section
          id="about"
          className="w-full flex flex-col items-center py-16 px-4 sm:px-8 lg:px-20 gap-12"
          style={{ backgroundColor: COLORS.background.primary }}
        >
          <div className="text-center flex flex-col items-center gap-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white" style={{ fontFamily: FONTS.heading }}>
              Ready to Transform Your LinkedIn Presence?
            </h2>
            <p className="text-base md:text-xl text-white max-w-3xl" style={{ fontFamily: FONTS.body }}>
              Fill out the form below and we&apos;ll reach out to discuss how we can help grow your business
            </p>
          </div>

          <div className="flex flex-col lg:flex-row justify-center gap-8 w-full max-w-7xl">
            {/* Contact Form */}
            <form
              id="contact-form"
              action={handleFormSubmit}
              className={`flex-1 p-6 flex flex-col gap-8 rounded-lg ${EFFECTS.cardHover}`}
              style={{ backgroundColor: COLORS.background.secondary }}
            >
              <div className="flex flex-col gap-4">
                <label htmlFor="name" className="text-xl md:text-2xl text-white" style={{ fontFamily: FONTS.body }}>Name</label>
                <div className={`flex items-center p-4 gap-4 bg-[${COLORS.background.tertiary}] rounded ${errors.name ? 'border-2 border-red-500' : 'border border-[#424242]'}`}>
                  <UserIcon />
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter Your Name"
                    className="bg-transparent text-white placeholder-gray-500 outline-none w-full"
                    required
                    maxLength="100"
                    aria-invalid={errors.name ? 'true' : 'false'}
                    aria-describedby={errors.name ? 'name-error' : undefined}
                  />
                </div>
                {errors.name && <p id="name-error" className="text-red-500 text-sm">{errors.name}</p>}
              </div>

              <div className="flex flex-col gap-4">
                <label htmlFor="email" className="text-xl md:text-2xl text-white" style={{ fontFamily: FONTS.body }}>Email</label>
                <div className={`flex items-center p-4 gap-4 bg-[${COLORS.background.tertiary}] rounded ${errors.email ? 'border-2 border-red-500' : ''}`}>
                  <MailIcon />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email address"
                    className="bg-transparent text-white placeholder-gray-500 outline-none w-full"
                    required
                    maxLength="100"
                    aria-invalid={errors.email ? 'true' : 'false'}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                  />
                </div>
                {errors.email && <p id="email-error" className="text-red-500 text-sm">{errors.email}</p>}
              </div>

              <div className="flex flex-col gap-4">
                <label htmlFor="phone" className="text-xl md:text-2xl text-white" style={{ fontFamily: FONTS.body }}>Phone Number</label>
                <div className={`flex items-center p-4 gap-4 bg-[${COLORS.background.tertiary}] rounded ${errors.phone ? 'border-2 border-red-500' : ''}`}>
                  <PhoneIcon />
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    className="bg-transparent text-white placeholder-gray-500 outline-none w-full"
                    required
                    maxLength="20"
                    aria-invalid={errors.phone ? 'true' : 'false'}
                    aria-describedby={errors.phone ? 'phone-error' : undefined}
                  />
                </div>
                {errors.phone && <p id="phone-error" className="text-red-500 text-sm">{errors.phone}</p>}
              </div>

              <div className="flex flex-col gap-4">
                <label htmlFor="company" className="text-xl md:text-2xl text-white" style={{ fontFamily: FONTS.body }}>Company Name</label>
                <div className={`flex items-center p-4 gap-4 bg-[${COLORS.background.tertiary}] rounded ${errors.company ? 'border-2 border-red-500' : ''}`}>
                  <CompanyIcon />
                  <input
                    id="company"
                    name="company"
                    type="text"
                    placeholder="Enter your company name"
                    className="bg-transparent text-white placeholder-gray-500 outline-none w-full"
                    required
                    maxLength="100"
                    aria-invalid={errors.company ? 'true' : 'false'}
                    aria-describedby={errors.company ? 'company-error' : undefined}
                  />
                </div>
                {errors.company && <p id="company-error" className="text-red-500 text-sm">{errors.company}</p>}
              </div>

              <button
                type="submit"
                className="py-4 px-8 bg-[#2C76E5] text-white text-xl md:text-2xl disabled:bg-gray-500 disabled:cursor-not-allowed transition-opacity hover:opacity-90"
                style={{ fontFamily: FONTS.body }}
                disabled={status === 'submitting'}
                aria-busy={status === 'submitting'}
              >
                {status === 'submitting' ? 'Submitting...' : 'Submit'}
              </button>
              {status === 'error' && <p className="text-red-500 text-center" role="alert">Something went wrong. Please try again.</p>}
            </form>

            {/* Info Cards */}
            <div className="flex-1 flex flex-col gap-6">
              <div
                className={`p-8 flex-1 flex flex-col gap-8 rounded-lg ${EFFECTS.cardHover}`}
                style={{ backgroundColor: COLORS.background.secondary }}
              >
                <h3 className="text-2xl font-bold text-white" style={{ fontFamily: FONTS.subheading }}>What Happens Next?</h3>
                <div className="flex flex-col gap-6">
                  <InfoCard
                    icon={ChatIcon}
                    title="Quick Response"
                    description="We'll respond within 24 hours to schedule your call"
                  />
                  <InfoCard
                    icon={CalendarGradientIcon}
                    title="Strategy Session"
                    description="Free consultation to discuss your LinkedIn goals"
                  />
                </div>
              </div>

              <CTACard
                title="Ready to Scale Your Business?"
                description="Join 12+ manufacturing brands who've already transformed their LinkedIn presence with Big Vision."
                clientImages={[
                  "/karthikeyan jawahar.jpeg",
                  "/anand mulay.jpeg",
                  "/dinesh alone.jpeg"
                ]}
                stats="4,000+ leads generated and counting..."
              />
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}