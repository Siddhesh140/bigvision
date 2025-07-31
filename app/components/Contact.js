// File: app/components/Contact.js
'use client'; // Required for using state and event handlers

import Image from 'next/image';
import { useState } from 'react'; // Import the useState hook

// Reusable Icon components for this section
const UserIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 21V19C20 16.7909 18.2091 15 16 15H8C5.79086 15 4 16.7909 4 19V21" stroke="#ADADAD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="#ADADAD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const MailIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="#ADADAD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M22 6L12 13L2 6" stroke="#ADADAD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);
const PhoneIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15.05 5A5 5 0 0 1 19 8.95M15.05 1A9 9 0 0 1 23 8.94M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke="#ADADAD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);
const CompanyIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" stroke="#ADADAD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
        <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
        <line x1="12" y1="22.08" x2="12" y2="12"></line>
    </svg>
);

const ChatIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="infoIconGradient" x1="12" y1="2" x2="12" y2="22" gradientUnits="userSpaceOnUse">
        <stop stopColor="#31A2F3"/>
        <stop offset="1" stopColor="#2213C4"/>
      </linearGradient>
    </defs>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" fill="url(#infoIconGradient)"/>
  </svg>
);
const CalendarIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="infoIconGradient" x1="12" y1="2" x2="12" y2="22" gradientUnits="userSpaceOnUse">
        <stop stopColor="#31A2F3"/>
        <stop offset="1" stopColor="#2213C4"/>
      </linearGradient>
    </defs>
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" fill="url(#infoIconGradient)"></rect>
    <line x1="16" y1="2" x2="16" y2="6" stroke="white" strokeWidth="2" strokeLinecap="round"></line>
    <line x1="8" y1="2" x2="8" y2="6" stroke="white" strokeWidth="2" strokeLinecap="round"></line>
    <line x1="3" y1="10" x2="21" y2="10" stroke="white" strokeWidth="2" strokeLinecap="round"></line>
  </svg>
);


const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const message = `New Lead from Website:\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nCompany: ${company}`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/919579662005?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <section className="w-full flex flex-col items-center py-20 px-20 gap-16" style={{ backgroundColor: '#151515' }}>
      <div className="text-center flex flex-col items-center gap-8">
        <h2 className="text-4xl font-bold text-white" style={{ fontFamily: "'Integral CF', sans-serif" }}>
          Ready to Transform Your LinkedIn Presence?
        </h2>
        <p className="text-xl text-white max-w-3xl" style={{ fontFamily: "'Roboto Mono', monospace" }}>
          Fill out the form below and we'll reach out to discuss how we can help grow your business
        </p>
      </div>

      <div className="flex flex-row justify-center gap-8 w-full max-w-7xl">
        {/* Form */}
        <div className="flex-1 p-6 flex flex-col gap-10 max-w-2xl rounded-lg transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-[0_0_35px_rgba(59,130,246,0.4)]" style={{ backgroundColor: '#191919' }}>
          {/* Name Field */}
          <div className="flex flex-col gap-4">
            <label className="text-2xl text-white" style={{ fontFamily: "'Roboto Mono', monospace" }}>Name</label>
            <div className="flex items-center p-5 gap-4 bg-[#242424] border border-[#424242] rounded">
              <UserIcon />
              <input 
                type="text" 
                placeholder="Enter Your Name" 
                className="bg-transparent text-white placeholder-gray-500 outline-none w-full"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>
          {/* Email Field */}
          <div className="flex flex-col gap-4">
            <label className="text-2xl text-white" style={{ fontFamily: "'Roboto Mono', monospace" }}>Email</label>
            <div className="flex items-center p-5 gap-4 bg-[#242424] rounded">
              <MailIcon />
              <input 
                type="email" 
                placeholder="Enter your email address" 
                className="bg-transparent text-white placeholder-gray-500 outline-none w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          {/* Phone Field */}
          <div className="flex flex-col gap-4">
            <label className="text-2xl text-white" style={{ fontFamily: "'Roboto Mono', monospace" }}>Phone Number</label>
            <div className="flex items-center p-5 gap-4 bg-[#242424] rounded">
              <PhoneIcon />
              <input 
                type="tel" 
                placeholder="Enter your phone number" 
                className="bg-transparent text-white placeholder-gray-500 outline-none w-full"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>
          {/* Company Field */}
          <div className="flex flex-col gap-4">
            <label className="text-2xl text-white" style={{ fontFamily: "'Roboto Mono', monospace" }}>Company Name</label>
            <div className="flex items-center p-5 gap-4 bg-[#242424] rounded">
              <CompanyIcon />
              <input 
                type="text" 
                placeholder="Enter your company name" 
                className="bg-transparent text-white placeholder-gray-500 outline-none w-full"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
            </div>
          </div>
          <button 
            onClick={handleSubmit} 
            className="py-4 px-8 bg-[#2C76E5] text-white text-2xl" 
            style={{ fontFamily: "'Roboto Mono', monospace" }}
          >
            Submit
          </button>
        </div>

        {/* Info Boxes */}
        <div className="flex-1 flex flex-col gap-6 max-w-xl">
          <div className="p-8 flex-1 flex flex-col gap-8 rounded-lg transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-[0_0_35px_rgba(59,130,246,0.4)]" style={{ backgroundColor: '#191919' }}>
            <h3 className="text-2xl font-bold text-white" style={{ fontFamily: "'Montserrat', sans-serif" }}>What Happens Next?</h3>
            <div className="flex flex-col gap-6">
              <div className="flex items-start gap-6">
                <ChatIcon />
                <div className="flex flex-col gap-4">
                  <h4 className="text-xl font-bold text-white" style={{ fontFamily: "'Montserrat', sans-serif" }}>Quick Response</h4>
                  <p className="text-xl text-gray-400" style={{ fontFamily: "'Roboto Mono', monospace" }}>We'll respond within 24 hours to schedule your call</p>
                </div>
              </div>
              <div className="flex items-start gap-6">
                <CalendarIcon />
                <div className="flex flex-col gap-4">
                  <h4 className="text-xl font-bold text-white" style={{ fontFamily: "'Montserrat', sans-serif" }}>Strategy Session</h4>
                  <p className="text-xl text-gray-400" style={{ fontFamily: "'Roboto Mono', monospace" }}>Free consultation to discuss your LinkedIn goals</p>
                </div>
              </div>
            </div>
          </div>
          <div className="p-8 flex-1 flex flex-col gap-10 bg-white text-black rounded-lg transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-[0_0_35px_rgba(59,130,246,0.4)]">
            <div className="flex flex-col gap-4">
              <h3 className="text-2xl font-bold" style={{ fontFamily: "'Montserrat', sans-serif" }}>Ready to Scale Your Business?</h3>
              <p className="text-xl" style={{ fontFamily: "'Roboto Mono', monospace" }}>Join 12+ manufacturing brands who've already transformed their LinkedIn presence with Big Vision.</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex -space-x-2">
                <div className="w-9 h-9 rounded-full relative border-2 border-white"><Image src="/karthikeyan jawahar.jpeg" layout="fill" className="rounded-full" alt="client 1"/></div>
                <div className="w-9 h-9 rounded-full relative border-2 border-white"><Image src="/anand mulay.jpeg" layout="fill" className="rounded-full" alt="client 2"/></div>
                <div className="w-9 h-9 rounded-full relative border-2 border-white"><Image src="/dinesh alone.jpeg" layout="fill" className="rounded-full" alt="client 3"/></div>
              </div>
              <p className="text-xl text-gray-600" style={{ fontFamily: "'Roboto Mono', monospace" }}>4,000+ leads generated and counting...</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;