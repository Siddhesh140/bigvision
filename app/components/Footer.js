// File: app/components/Footer.js
import Image from 'next/image';
import { FONTS, COLORS } from '../constants/styles';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="w-full flex flex-col lg:flex-row justify-between items-start py-16 px-8 sm:px-16 lg:px-20 gap-12 lg:gap-16"
      style={{ backgroundColor: COLORS.background.secondary }}
    >
      {/* Left Column: Logo and Info */}
      <div className="flex flex-col gap-8 max-w-md">
        <div className="flex items-center gap-2">
          <div className="relative w-11 h-6 flex-shrink-0">
            <Image
              src="/Vector.svg"
              alt="BigVision Logo"
              fill
              style={{ objectFit: 'contain' }}
              sizes="44px"
            />
          </div>
          <p className="text-2xl font-bold text-white" style={{ fontFamily: FONTS.heading }}>Big Vision</p>
        </div>
        <p className="text-base text-white" style={{ fontFamily: FONTS.body }}>Where B2B Brands Become Industry Authorities</p>
        <p className="text-base text-gray-400" style={{ fontFamily: FONTS.body }}>Helping manufacturing leaders generate real business through strategic LinkedIn marketing.</p>
        <p className="text-sm text-gray-500" style={{ fontFamily: FONTS.body }}>© {currentYear} BigVision. All rights reserved.</p>
      </div>

      {/* Right Columns: Links */}
      <div className="flex flex-col sm:flex-row gap-12 sm:gap-16">
        <div className="flex flex-col gap-6">
          <h4 className="text-lg font-bold text-white" style={{ fontFamily: FONTS.subheading }}>Services</h4>
          <ul className="flex flex-col gap-5 text-base text-gray-400" style={{ fontFamily: FONTS.body }}>
            <li>LinkedIn Lead Generation</li>
            <li>Personal Branding</li>
            <li>Content Creation</li>
            <li>B2B Marketing Strategy</li>
          </ul>
        </div>
        <div className="flex flex-col gap-6">
          <h4 className="text-lg font-bold text-white" style={{ fontFamily: FONTS.subheading }}>Contact</h4>
          <ul className="flex flex-col gap-5 text-base text-gray-400" style={{ fontFamily: FONTS.body }}>
            <li>
              <a
                href="mailto:anshreja1234@gmail.com"
                className="hover:text-blue-400 transition-colors"
                aria-label="Email BigVision"
              >
                anshreja1234@gmail.com
              </a>
            </li>
            <li>
              <a
                href="tel:+919579662005"
                className="hover:text-blue-400 transition-colors"
                aria-label="Call BigVision"
              >
                +91 95796 62005
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
