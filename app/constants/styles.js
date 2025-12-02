// Centralized style constants to reduce duplication

export const GRADIENTS = {
  text: 'linear-gradient(90deg, #FFFFFF 0%, #EBEBEB 32.21%, #7A7A7A 75%, #525252 99.52%)',
  button: 'linear-gradient(90deg, #31A2F3 0%, #2213C4 100%)',
  icon: {
    id: 'iconGradient',
    x1: '16',
    y1: '0',
    x2: '16',
    y2: '32',
    stops: [
      { offset: '0%', color: '#31A2F3' },
      { offset: '100%', color: '#2213C4' }
    ]
  }
};

export const FONTS = {
  heading: "'Integral CF', sans-serif",
  body: "'Roboto Mono', monospace",
  subheading: "'Montserrat', sans-serif"
};

export const COLORS = {
  background: {
    primary: '#151515',
    secondary: '#191919',
    tertiary: '#242424'
  },
  text: {
    primary: '#FFFFFF',
    secondary: '#ADADAD',
    tertiary: '#7A7A7A'
  },
  accent: {
    blue: '#2C76E5',
    lightBlue: '#31A2F3',
    darkBlue: '#2213C4'
  },
  border: '#424242'
};

export const SPACING = {
  section: 'py-16 px-4 sm:px-8 lg:px-20',
  card: 'p-8',
  gap: {
    small: 'gap-4',
    medium: 'gap-8',
    large: 'gap-12'
  }
};

export const EFFECTS = {
  cardHover: 'transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-[0_0_35px_rgba(59,130,246,0.4)]',
  buttonHover: 'transition-all duration-300 ease-in-out hover:scale-110'
};
