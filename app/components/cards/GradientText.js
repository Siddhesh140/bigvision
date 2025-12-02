import { GRADIENTS, FONTS } from '@/app/constants/styles';

/**
 * Reusable gradient text component
 * @param {string} children - Text content
 * @param {string} className - Additional Tailwind classes
 * @param {string} as - HTML element type (default: 'p')
 * @param {string} gradient - Gradient type from GRADIENTS (default: 'text')
 */
export default function GradientText({
    children,
    className = '',
    as: Component = 'p',
    gradient = 'text'
}) {
    return (
        <Component
            className={`text-transparent bg-clip-text ${className}`}
            style={{
                fontFamily: FONTS.heading,
                backgroundImage: GRADIENTS[gradient] || GRADIENTS.text
            }}
        >
            {children}
        </Component>
    );
}
