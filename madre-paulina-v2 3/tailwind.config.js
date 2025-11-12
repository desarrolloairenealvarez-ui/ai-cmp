/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ['class'],
	content: [
		'./pages/**/*.{ts,tsx}',
		'./components/**/*.{ts,tsx}',
		'./app/**/*.{ts,tsx}',
		'./src/**/*.{ts,tsx}',
	],
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px',
			},
		},
		extend: {
			colors: {
				// Colores institucionales Colegio Madre Paulina
				'cmp-azul-oscuro': '#2b5774',
				'cmp-azul-medio': '#4a95bf',
				'cmp-azul-sombra': '#2c6b8c',
				'cmp-naranja': '#f4aa3e',
				'cmp-verde-oscuro': '#4b722d',
				'cmp-verde-claro': '#78aa47',
				'cmp-amarillo': '#ffeb90',
				'cmp-gris-azulado': '#d9e2e6',
				'cmp-blanco': '#ffffff',
				'cmp-gris-oscuro': '#3b3b3b',
				
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: '#2b5774', // Azul oscuro institucional
					foreground: '#ffffff',
				},
				secondary: {
					DEFAULT: '#4a95bf', // Azul medio institucional
					foreground: '#ffffff',
				},
				accent: {
					DEFAULT: '#f4aa3e', // Naranja institucional
					foreground: '#3b3b3b',
				},
				success: {
					DEFAULT: '#78aa47', // Verde claro institucional
					foreground: '#ffffff',
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))',
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))',
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))',
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))',
				},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
			},
			keyframes: {
				'accordion-down': {
					from: { height: 0 },
					to: { height: 'var(--radix-accordion-content-height)' },
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: 0 },
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
			},
		},
	},
	plugins: [require('tailwindcss-animate')],
}
