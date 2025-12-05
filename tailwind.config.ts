import type { Config } from "tailwindcss";

const config: Config = {
	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			colors: {
				// Lego Color Palette - Enhanced
				"lego-red": {
					DEFAULT: "#DA291C",
					50: "#FEF2F1",
					100: "#FCE4E2",
					200: "#F9C9C5",
					300: "#F4A199",
					400: "#ED6B5F",
					500: "#DA291C",
					600: "#C41E14",
					700: "#A31912",
					800: "#871614",
					900: "#711817",
				},
				"lego-yellow": {
					DEFAULT: "#FFD500",
					50: "#FFFCE5",
					100: "#FFF9C2",
					200: "#FFF08A",
					300: "#FFE246",
					400: "#FFD500",
					500: "#E6B800",
					600: "#CC9A00",
					700: "#A37400",
					800: "#865C0A",
					900: "#724B10",
				},
				"lego-blue": {
					DEFAULT: "#0055BF",
					50: "#EFF6FF",
					100: "#DBEAFE",
					200: "#BFDBFE",
					300: "#93C5FD",
					400: "#60A5FA",
					500: "#0055BF",
					600: "#0046A0",
					700: "#003A85",
					800: "#00306D",
					900: "#00285B",
				},
				"lego-dark": "#1F1F1F",
				"lego-bg": "#F8F9FA",
			},
			fontFamily: {
				heading: ["var(--font-nunito)", "system-ui", "sans-serif"],
				body: ["var(--font-inter)", "system-ui", "sans-serif"],
			},
			borderRadius: {
				button: "12px",
				card: "16px",
				xl: "20px",
			},
			boxShadow: {
				card: "0 1px 3px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.05)",
				"card-hover":
					"0 8px 30px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.06)",
				button: "0 2px 8px rgba(218, 41, 28, 0.25)",
				"button-hover": "0 4px 16px rgba(218, 41, 28, 0.35)",
				soft: "0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)",
			},
			animation: {
				float: "float 3s ease-in-out infinite",
				"pulse-soft": "pulse-soft 2s ease-in-out infinite",
				"slide-up": "slide-up 0.5s ease-out",
				"fade-in": "fade-in 0.4s ease-out",
			},
			keyframes: {
				float: {
					"0%, 100%": { transform: "translateY(0)" },
					"50%": { transform: "translateY(-10px)" },
				},
				"pulse-soft": {
					"0%, 100%": { opacity: "1" },
					"50%": { opacity: "0.7" },
				},
				"slide-up": {
					"0%": { transform: "translateY(20px)", opacity: "0" },
					"100%": { transform: "translateY(0)", opacity: "1" },
				},
				"fade-in": {
					"0%": { opacity: "0" },
					"100%": { opacity: "1" },
				},
			},
			backgroundImage: {
				"gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
			},
		},
	},
	plugins: [],
};

export default config;
