import animate from 'tailwindcss-animate';

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: '1.25rem', lg: '2rem' },
      screens: { '2xl': '1240px' },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        // Marka — drenched derin yeşil + hasat altını
        'brand-deep': 'hsl(var(--brand-deep))',
        harvest: {
          DEFAULT: 'hsl(var(--harvest))',
          foreground: 'hsl(var(--harvest-foreground))',
        },
        whatsapp: 'hsl(var(--whatsapp) / <alpha-value>)',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 3px)',
        sm: 'calc(var(--radius) - 6px)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        heading: ['var(--font-display)', 'ui-serif', 'Georgia', 'serif'],
      },
      boxShadow: {
        'soft-sm':
          '0 1px 2px hsl(155 30% 12% / 0.05), 0 1px 3px hsl(155 30% 12% / 0.04)',
        soft: '0 6px 24px -10px hsl(155 30% 12% / 0.14), 0 2px 6px -3px hsl(155 30% 12% / 0.06)',
        'soft-lg':
          '0 24px 60px -18px hsl(155 35% 12% / 0.22), 0 6px 16px -8px hsl(155 30% 12% / 0.10)',
      },
      transitionTimingFunction: {
        'out-quart': 'var(--ease-out-quart)',
        'in-out-quint': 'var(--ease-in-out-quint)',
        'out-expo': 'var(--ease-out-expo)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        marquee: {
          to: { transform: 'translateX(-100%)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-up': 'fade-up 0.6s var(--ease-out-expo) both',
        // Sonsuz nabız yerine: 1sn gecikmeyle 3 kez atar, sonra durur
        'ping-few': 'ping 1.2s cubic-bezier(0, 0, 0.2, 1) 1s 3 both',
        marquee: 'marquee 36s linear infinite',
      },
    },
  },
  plugins: [animate],
};
