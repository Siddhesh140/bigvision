
import { Inter } from 'next/font/google';
import Script from 'next/script'; // Import the Script component
import Navbar from './components/Navbar'; // Assuming this path is correct for your setup
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'BigVision',
  description: 'Unlock Your Business\'s Full Potential',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-black`}>
        <Navbar />
        <main>{children}</main>
        
        {/* Load GSAP and ScrollTrigger using the next/script component */}
        <Script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js" strategy="afterInteractive" />
        <Script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
