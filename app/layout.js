
import { Inter } from 'next/font/google';
import Script from 'next/script';
import Navbar from './components/Navbar';
import './globals.css';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata = {
  title: 'BigVision - Where B2B Brands Become Industry Authorities',
  description: 'Transform your B2B presence into a lead generating powerhouse. LinkedIn lead generation, personal branding, and content creation for manufacturing and industrial brands.',
  keywords: 'B2B marketing, LinkedIn lead generation, personal branding, content creation, manufacturing marketing',
  authors: [{ name: 'BigVision' }],
  viewport: 'width=device-width, initial-scale=1',
  openGraph: {
    title: 'BigVision - Where B2B Brands Become Industry Authorities',
    description: 'Transform your B2B presence into a lead generating powerhouse',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${inter.className} bg-black`}>
        <Navbar />
        {children}

        {/* Analytics tracking script */}
        <Script
          id="leadsy-tracking"
          src="https://r2.leadsy.ai/tag.js"
          data-pid="6DjidSJU6Y8nhbXa"
          data-version="062024"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
