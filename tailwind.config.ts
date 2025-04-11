import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		backgroundImage: {
  			'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
  			'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))'
  		},
  		backgroundSize: {
  			'size-1000': '1000% 1000%',
  			'size-200': '200% 200%'
  		},
  		backgroundPosition: {
  			'pos-0': '0% 0%',
  			'pos-100': '100% 100%',
  			'pos-300': '300% 300%'
  		},
  		colors: {
  			terracotta: {
  				'50': '#FFE8DE',
  				'100': '#FFCCB3',
  				'200': '#FFB38D',
  				'300': '#FF9966',
  				'400': '#D97A4F',
  				'500': '#3D3029',
  				'600': '#2E241F',
  				'650': '#302A27',
  				'700': '#2A2522',
  				'750': '#2e2924',
  				'800': '#201D1A',
  				'900': '#1C1917',
  				'950': '#171514'
  			},
  			coffee: {
  				'600': '#4A3D37',
  				'700': '#3A2E29'
  			},
  			'yellow-pastel': '#E0C097',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  safelist: [
    { pattern: /^bg-\w+-\d+$/, variants: ["hover"] },
    { pattern: /^p-\d+$/ },
    { pattern: /^from-\w+-\d+/, variants: ["hover"] },
    { pattern: /^text-\w+-\d+/, variants: ["hover"] },
  ],
  plugins: [require("tailwindcss-animate")],
};
export default config;
