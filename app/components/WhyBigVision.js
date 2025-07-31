// File: app/components/WhyBigVision.js
import Image from 'next/image';

// Reusable Icon component for this section
const CheckIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="iconGradient" x1="16" y1="0" x2="16" y2="32" gradientUnits="userSpaceOnUse">
        <stop stopColor="#31A2F3"/>
        <stop offset="1" stopColor="#2213C4"/>
      </linearGradient>
    </defs>
    <path d="M28 8L12 24L4 16" stroke="url(#iconGradient)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CalendarIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 2V5" stroke="white" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M16 2V5" stroke="white" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M3.5 9.09H20.5" stroke="white" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z" stroke="white" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M11.9955 13.7H12.0045" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M8.29431 13.7H8.3033" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M8.29431 16.7H8.3033" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);


const WhyBigVision = () => {
  return (
    <>
      {/* Section 1: Main Intro */}
      <section className="w-full flex flex-col items-center py-20 px-20 gap-16" style={{ backgroundColor: '#151515' }}>
        <div className="text-center flex flex-col items-center gap-8">
          <h2 className="text-6xl font-bold text-white" style={{ fontFamily: "'Integral CF', sans-serif" }}>
            Why Big Vision?
          </h2>
          <p className="text-xl text-white" style={{ fontFamily: "'Roboto Mono', monospace" }}>
            No fluff. Just focused execution.
          </p>
          <p className="text-2xl text-white max-w-3xl mt-8" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            We combine deep manufacturing insight with marketing precision to bring you one thing: business growth
          </p>
        </div>

        {/* Large Image with Text Overlay */}
        <div className="relative w-full max-w-7xl h-[644px]">
          <Image src="/image15.png" alt="Team working" layout="fill" objectFit="cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
          <div className="absolute bottom-14 left-14 z-10 text-white">
            <h3 className="text-4xl font-bold" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              We make social media work like sales.
            </h3>
            <p className="text-xl mt-4" style={{ fontFamily: "'Roboto Mono', monospace" }}>
              Strategic. Targeted. Results-driven.
            </p>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="flex flex-row gap-7 w-full max-w-7xl">
          <div className="flex-1 flex flex-col p-12 gap-12 rounded-lg transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-[0_0_35px_rgba(59,130,246,0.4)]" style={{ backgroundColor: '#191919' }}>
            <div className="relative w-12 h-12">
              <Image src="/logo100.png" alt="Leads Icon" layout="fill" objectFit="contain" />
            </div>
            <div className="flex flex-col gap-7">
              <p className="text-6xl font-medium text-white" style={{ fontFamily: "'Integral CF', sans-serif" }}>4000+</p>
              <p className="text-3xl text-white" style={{ fontFamily: "'Roboto Mono', monospace" }}>B2B leads</p>
            </div>
          </div>
          <div className="flex-1 flex flex-col p-12 gap-12 rounded-lg transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-[0_0_35px_rgba(59,130,246,0.4)]" style={{ backgroundColor: '#191919' }}>
            <div className="relative w-12 h-12">
              <Image src="/logo101.png" alt="Brands Icon" layout="fill" objectFit="contain" />
            </div>
            <div className="flex flex-col gap-7">
              <p className="text-6xl font-medium text-white" style={{ fontFamily: "'Integral CF', sans-serif" }}>12+</p>
              <p className="text-3xl text-white" style={{ fontFamily: "'Roboto Mono', monospace" }}>Brands scaled</p>
            </div>
          </div>
          <div className="flex-1 flex flex-col p-12 gap-12 rounded-lg transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-[0_0_35px_rgba(59,130,246,0.4)]" style={{ backgroundColor: '#191919' }}>
            <div className="relative w-12 h-12">
              <Image src="/logo102.png" alt="Conversions Icon" layout="fill" objectFit="contain" />
            </div>
            <div className="flex flex-col gap-7">
              <p className="text-6xl font-medium text-white" style={{ fontFamily: "'Integral CF', sans-serif" }}>75%+</p>
              <p className="text-3xl text-white" style={{ fontFamily: "'Roboto Mono', monospace" }}>Conversions</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Who We Work With & What Makes Us Different */}
      <section className="w-full flex flex-col items-center py-20 px-20" style={{ backgroundColor: '#151515' }}>
        <div className="flex flex-row gap-16 w-full max-w-7xl">
          {/* Left Column */}
          <div className="flex-1 p-10 flex flex-col gap-14 rounded-lg transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-[0_0_35px_rgba(59,130,246,0.4)]" style={{ backgroundColor: '#191919' }}>
            <div className="flex flex-col gap-4">
              <h3 className="text-4xl font-bold text-white" style={{ fontFamily: "'Integral CF', sans-serif" }}>Who We Work With</h3>
              <p className="text-2xl text-white" style={{ fontFamily: "'Montserrat', sans-serif" }}>We specialize in scaling B2B brands in:</p>
            </div>
            <div className="flex flex-col gap-8">
              <div className="flex items-start gap-4"><CheckIcon /> <p className="text-xl text-white flex-1" style={{ fontFamily: "'Roboto Mono', monospace" }}>Manufacturing (automotive, aerospace, tooling, X-ray, robotics)</p></div>
              <div className="flex items-center gap-4"><CheckIcon /> <p className="text-xl text-white flex-1" style={{ fontFamily: "'Roboto Mono', monospace" }}>Industrial SaaS & Tech for factories</p></div>
              <div className="flex items-start gap-4"><CheckIcon /> <p className="text-xl text-white flex-1" style={{ fontFamily: "'Roboto Mono', monospace" }}>MSME / SME founders targeting global growth</p></div>
              <div className="flex items-start gap-4"><CheckIcon /> <p className="text-xl text-white flex-1" style={{ fontFamily: "'Roboto Mono', monospace" }}>Founders/MDs seeking a stronger LinkedIn presence</p></div>
            </div>
          </div>
          {/* Right Column */}
          <div className="flex-1 p-10 flex flex-col gap-14 bg-gray-100 text-black rounded-lg transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-[0_0_35px_rgba(59,130,246,0.4)]">
            <div className="flex flex-col gap-4">
              <h3 className="text-4xl font-bold" style={{ fontFamily: "'Integral CF', sans-serif" }}>What Makes Us Different</h3>
              <p className="text-2xl" style={{ fontFamily: "'Montserrat', sans-serif" }}>One partner. One plan. All execution.</p>
            </div>
            <div className="flex flex-col gap-8">
              <div className="flex items-center gap-4"><CheckIcon /> <p className="text-xl flex-1" style={{ fontFamily: "'Roboto Mono', monospace" }}>We understand how industrial buying works</p></div>
              <div className="flex items-start gap-4"><CheckIcon /> <p className="text-xl flex-1" style={{ fontFamily: "'Roboto Mono', monospace" }}>We speak manufacturing — no generic marketing</p></div>
              <div className="flex items-center gap-4"><CheckIcon /> <p className="text-xl flex-1" style={{ fontFamily: "'Roboto Mono', monospace" }}>We treat your brand like it's our own</p></div>
              <div className="flex items-start gap-4"><CheckIcon /> <p className="text-xl flex-1" style={{ fontFamily: "'Roboto Mono', monospace" }}>And we care more about conversions than clicks</p></div>
            </div>
          </div>
        </div>
      </section>

      {/* --- NEW: Call to Action Section --- */}
      <section className="w-full flex flex-col items-center py-20 px-20" style={{ backgroundColor: '#151515' }}>
        <div className="flex flex-row justify-between items-center w-full max-w-7xl">
            <div className="flex flex-col gap-12">
                <div className="flex flex-col gap-8">
                    <h2 className="text-5xl font-bold text-white max-w-xl" style={{ fontFamily: "'Integral CF', sans-serif" }}>
                        You've spent years building your company.
                    </h2>
                    <p className="text-xl text-white max-w-lg" style={{ fontFamily: "'Roboto Mono', monospace" }}>
                        Now it's time to make the world notice. Let's grow your presence and pipeline — together.
                    </p>
                </div>
                <p className="text-base text-gray-400" style={{ fontFamily: "'Roboto Mono', monospace" }}>
                    Click to start a WhatsApp conversation • Free consultation • No commitment required
                </p>
            </div>
            <a 
                href="https://wa.me/919579662005"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 py-3 px-5 bg-[#2C76E5] text-white rounded-lg transition-transform duration-300 hover:scale-105"
            >
                <CalendarIcon />
                <span className="text-lg font-bold" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                    Schedule a Strategy Call
                </span>
            </a>
        </div>
      </section>
    </>
  );
};

export default WhyBigVision;