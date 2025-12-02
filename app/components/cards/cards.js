// File: app/components/cards/cards.js
// Reusable card components for the landing page

import Image from 'next/image';
import { FONTS, COLORS, EFFECTS } from '@/app/constants/styles';

/**
 * Service Card - Used in the services section
 */
export const ServiceCard = ({ image, title, subtitle, description, alt }) => {
    return (
        <article
            className={`flex-1 flex flex-col p-7 gap-9 rounded-lg ${EFFECTS.cardHover}`}
            style={{ backgroundColor: COLORS.background.secondary }}
        >
            <div className="w-full h-64 sm:h-[22rem] relative">
                <Image
                    src={image}
                    alt={alt}
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="(max-width: 768px) 100vw, 33vw"
                />
            </div>
            <div className="flex flex-col gap-4">
                <h3 className="text-2xl lg:text-[1.875rem] font-bold text-white" style={{ fontFamily: FONTS.subheading }}>
                    {title}
                </h3>
                <p className="text-base lg:text-[1rem] text-gray-400" style={{ fontFamily: FONTS.body }}>
                    {subtitle}
                </p>
            </div>
            <p className="text-base lg:text-[1rem] text-white" style={{ fontFamily: FONTS.body }}>
                {description}
            </p>
        </article>
    );
};

/**
 * Stat Card - Used in the Why BigVision section
 */
export const StatCard = ({ icon, number, label }) => {
    return (
        <div
            className={`flex-1 flex flex-col p-8 md:p-12 gap-8 rounded-lg ${EFFECTS.cardHover}`}
            style={{ backgroundColor: COLORS.background.secondary }}
        >
            <div className="relative w-12 h-12">
                <Image
                    src={icon}
                    alt={`${label} icon`}
                    fill
                    style={{ objectFit: 'contain' }}
                    sizes="48px"
                />
            </div>
            <div className="flex flex-col gap-4">
                <p className="text-4xl md:text-6xl font-medium text-white" style={{ fontFamily: FONTS.heading }}>
                    {number}
                </p>
                <p className="text-xl md:text-3xl text-white" style={{ fontFamily: FONTS.body }}>
                    {label}
                </p>
            </div>
        </div>
    );
};

/**
 * Feature Card - Used in Who We Work With / What Makes Us Different sections
 */
export const FeatureCard = ({ title, subtitle, features, isDark = false, icon: Icon }) => {
    const bgColor = isDark ? 'bg-gray-100' : COLORS.background.secondary;
    const textColor = isDark ? 'text-black' : 'text-white';

    return (
        <div
            className={`flex-1 p-8 md:p-10 flex flex-col gap-10 rounded-lg ${EFFECTS.cardHover} ${isDark ? 'bg-gray-100' : ''}`}
            style={!isDark ? { backgroundColor: COLORS.background.secondary } : {}}
        >
            <div className="flex flex-col gap-4">
                <h3 className={`text-3xl md:text-4xl font-bold ${textColor}`} style={{ fontFamily: FONTS.heading }}>
                    {title}
                </h3>
                <p className={`text-xl md:text-2xl ${textColor}`} style={{ fontFamily: FONTS.subheading }}>
                    {subtitle}
                </p>
            </div>
            <div className="flex flex-col gap-8">
                {features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-4">
                        {Icon && <Icon />}
                        <p className={`text-base md:text-xl flex-1 ${textColor}`} style={{ fontFamily: FONTS.body }}>
                            {feature}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

/**
 * Testimonial Card - Used in testimonials section
 */
export const TestimonialCard = ({ quote, author }) => {
    return (
        <div
            className={`flex-1 flex flex-col justify-between p-8 rounded-lg ${EFFECTS.cardHover}`}
            style={{ backgroundColor: COLORS.background.secondary }}
        >
            <div className="flex flex-col gap-10">
                <div className="flex flex-row items-center gap-3">
                    <div className="relative w-14 h-14 flex-shrink-0">
                        <Image
                            src="/frame.png"
                            alt="Quote icon"
                            fill
                            style={{ objectFit: 'contain' }}
                            sizes="56px"
                        />
                    </div>
                    <div className="relative w-full h-px">
                        <Image
                            src="/Line 1.png"
                            alt=""
                            fill
                            style={{ objectFit: 'cover' }}
                            aria-hidden="true"
                        />
                    </div>
                </div>
                <p className="text-lg md:text-xl text-white min-h-[12rem]" style={{ fontFamily: FONTS.body }}>
                    {quote}
                </p>
            </div>
            <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-full relative border-2 border-gray-700 flex-shrink-0">
                    <Image
                        src={author.image}
                        alt={`${author.name}, ${author.title}`}
                        fill
                        style={{ objectFit: 'cover' }}
                        className="rounded-full"
                        sizes="56px"
                    />
                </div>
                <div>
                    <p className="text-base md:text-lg font-bold text-white" style={{ fontFamily: FONTS.subheading }}>
                        {author.name}
                    </p>
                    <p className="text-sm md:text-base text-gray-400" style={{ fontFamily: FONTS.body }}>
                        {author.title}
                    </p>
                </div>
            </div>
        </div>
    );
};

/**
 * Info Card - Used in Contact section (What Happens Next)
 */
export const InfoCard = ({ icon: Icon, title, description }) => {
    return (
        <div className="flex items-start gap-6">
            <Icon />
            <div className="flex flex-col gap-4">
                <h4 className="text-lg md:text-xl font-bold text-white" style={{ fontFamily: FONTS.subheading }}>
                    {title}
                </h4>
                <p className="text-base md:text-xl text-gray-400" style={{ fontFamily: FONTS.body }}>
                    {description}
                </p>
            </div>
        </div>
    );
};

/**
 * CTA Card - Call to action card with client images
 */
export const CTACard = ({ title, description, clientImages, stats }) => {
    return (
        <div className={`p-8 flex-1 flex flex-col gap-10 bg-white text-black rounded-lg ${EFFECTS.cardHover}`}>
            <div className="flex flex-col gap-4">
                <h3 className="text-2xl font-bold" style={{ fontFamily: FONTS.subheading }}>
                    {title}
                </h3>
                <p className="text-lg md:text-xl" style={{ fontFamily: FONTS.body }}>
                    {description}
                </p>
            </div>
            <div className="flex items-center gap-6">
                <div className="flex -space-x-2">
                    {clientImages.map((image, index) => (
                        <div key={index} className="w-9 h-9 rounded-full relative border-2 border-white">
                            <Image
                                src={image}
                                fill
                                style={{ objectFit: 'cover' }}
                                className="rounded-full"
                                alt="Client testimonial"
                                sizes="36px"
                            />
                        </div>
                    ))}
                </div>
                <p className="text-base md:text-xl text-gray-600" style={{ fontFamily: FONTS.body }}>
                    {stats}
                </p>
            </div>
        </div>
    );
};
