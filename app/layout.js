
import { Inter } from 'next/font/google';
import Script from 'next/script';
import Navbar from './components/Navbar';
import './globals.css';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata = {
  title: 'BigVision - Where B2B Brands Become Industry Authorities',
  description: 'Transform your B2B manufacturing brand into a lead-generating powerhouse. Expert LinkedIn marketing, personal branding, and content creation for industrial businesses. 4000+ leads generated.',
  keywords: [
    'B2B marketing',
    'LinkedIn lead generation',
    'personal branding',
    'content creation',
    'manufacturing marketing',
    'industrial marketing',
    'B2B LinkedIn strategy',
    'manufacturing social media',
    'industrial lead generation',
    'B2B content marketing',
    'LinkedIn for manufacturers',
    'B2B social media marketing'
  ],
  authors: [{ name: 'BigVision', url: 'https://bigvision.in' }],
  creator: 'BigVision',
  publisher: 'BigVision',
  metadataBase: new URL('https://bigvision.in'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'BigVision - Where B2B Brands Become Industry Authorities',
    description: 'Transform your B2B manufacturing brand into a lead-generating powerhouse. Expert LinkedIn marketing, personal branding, and content creation for industrial businesses.',
    url: 'https://bigvision.in',
    siteName: 'BigVision',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'BigVision - B2B LinkedIn Marketing Agency',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BigVision - Where B2B Brands Become Industry Authorities',
    description: 'Transform your B2B manufacturing brand into a lead-generating powerhouse.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
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
