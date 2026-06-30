/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'green-text': '#1f2a1d',
        'green-medium': '#2d3a2a',
        'green-hover': '#2a3827',
        'green-body': '#4b5b47',
        'green-heading': '#336443',
        'green-accent': '#85AB8B',
        'green-bl': '#3d5638',
        'green-bl-hover': '#2d4228',
        'soil': '#8A6A43',
        'sand': '#F4EFE6',
        'cream': '#FAF7EF',
        'border-green': '#D9E3D5',
      },
    },
  },
  plugins: [],
};
