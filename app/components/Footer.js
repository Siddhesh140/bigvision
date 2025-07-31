// File: app/components/Footer.js
import Image from 'next/image';

const Footer = () => {
  return (
    <footer className="w-full flex flex-row justify-between items-start py-16 px-20" style={{ backgroundColor: '#191919' }}>
      <div className="flex flex-col gap-9 max-w-md">
        <div className="flex items-center gap-2">
          <div className="relative w-11 h-6">
            <Image src="/Vector.svg" alt="BigVision Logo" layout="fill" />
          </div>
          <p className="text-2xl font-bold text-white" style={{ fontFamily: "'Integral CF', sans-serif" }}>Big Vision</p>
        </div>
        <p className="text-base text-white" style={{ fontFamily: "'Roboto Mono', monospace" }}>Where B2B Brands Become Industry Authorities</p>
        <p className="text-base text-gray-400" style={{ fontFamily: "'Roboto Mono', monospace" }}>Helping manufacturing leaders generate real business through strategic LinkedIn marketing.</p>
      </div>

      <div className="flex flex-row gap-16">
        <div className="flex flex-col gap-6">
          <h4 className="text-lg font-bold text-white" style={{ fontFamily: "'Montserrat', sans-serif" }}>Services</h4>
          <ul className="flex flex-col gap-5 text-base text-gray-400" style={{ fontFamily: "'Roboto Mono', monospace" }}>
            <li>LinkedIn Lead Generation</li>
            <li>Personal Branding</li>
            <li>Content Creation</li>
            <li>B2B Marketing Strategy</li>
          </ul>
        </div>
        <div className="flex flex-col gap-6">
          <h4 className="text-lg font-bold text-white" style={{ fontFamily: "'Montserrat', sans-serif" }}>Contact</h4>
          <ul className="flex flex-col gap-5 text-base text-gray-400" style={{ fontFamily: "'Roboto Mono', monospace" }}>
            <li>anshreja1234@gmail.com</li>
            <li>+91 95796 62005</li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;