/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          dark: "hsl(var(--primary-dark))",
        },
        primaryDark: {
          DEFAULT: "hsl(var(--primary-dark))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        content1: {
          DEFAULT: "hsl(var(--content1))",
        },
        content2: {
          DEFAULT: "hsl(var(--content2))",
        },
        content3: {
          DEFAULT: "hsl(var(--content3))",
        },
        border: "hsl(var(--border))",
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        primaryGradient: "#4E55F1",
        secondaryGradient: "#9D3CFF",
        galaxyPrimary: "#7761FF",
        galaxyPrimaryDark: "#573FEC",
        galaxyBg: "#081521",
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
        "color-1": "hsl(var(--color-1))",
        "color-2": "hsl(var(--color-2))",
        "color-3": "hsl(var(--color-3))",
        "color-4": "hsl(var(--color-4))",
        "color-5": "hsl(var(--color-5))",
      },
      keyframes: {
        slideRightAnimate: {
          "0%": {
            opacity: 1,
            transform: "translateX(0px)",
          },
          "50%": {
            opacity: 0,
            transform: "translateX(100%)",
          },
          "51%": {
            opacity: 0,
            transform: "translateX(-90%)",
          },
          "100%": {
            opacity: 1,
            transform: "translateX(0px)",
          },
        },
        fadeUp: {
          "0%": {
            opacity: 0,
            transform: "translateY(12px)",
          },
          "100%": {
            opacity: 1,
            transform: "translateY(0px)",
          },
        },
        slideDownAndFade: {
          from: {
            opacity: 0,
            transform: "translateY(-2px)",
          },
          to: {
            opacity: 1,
            transform: "translateY(0)",
          },
        },
        slideLeftAndFade: {
          from: {
            opacity: 0,
            transform: "translateX(2px)",
          },
          to: {
            opacity: 1,
            transform: "translateX(0)",
          },
        },
        slideUpAndFade: {
          from: {
            opacity: 0,
            transform: "translateY(2px)",
          },
          to: {
            opacity: 1,
            transform: "translateY(0)",
          },
        },
        slideRightAndFade: {
          from: {
            opacity: 0,
            transform: "translateX(-2px)",
          },
          to: {
            opacity: 1,
            transform: "translateX(0)",
          },
        },
        "border-beam": {
          "100%": {
            "offset-distance": "100%",
          },
        },
        "aurora-border": {
          "0%, 100%": {
            borderRadius: "37% 29% 27% 27% / 28% 25% 41% 37%",
          },
          "25%": {
            borderRadius: "47% 29% 39% 49% / 61% 19% 66% 26%",
          },
          "50%": {
            borderRadius: "57% 23% 47% 72% / 63% 17% 66% 33%",
          },
          "75%": {
            borderRadius: "28% 49% 29% 100% / 93% 20% 64% 25%",
          },
        },
        "aurora-1": {
          "0%, 100%": {
            top: "0",
            right: "0",
          },
          "50%": {
            top: "50%",
            right: "25%",
          },
          "75%": {
            top: "25%",
            right: "50%",
          },
        },
        "aurora-2": {
          "0%, 100%": {
            top: "0",
            left: "0",
          },
          "60%": {
            top: "75%",
            left: "25%",
          },
          "85%": {
            top: "50%",
            left: "50%",
          },
        },
        "aurora-3": {
          "0%, 100%": {
            bottom: "0",
            left: "0",
          },
          "40%": {
            bottom: "50%",
            left: "25%",
          },
          "65%": {
            bottom: "25%",
            left: "50%",
          },
        },
        "aurora-4": {
          "0%, 100%": {
            bottom: "0",
            right: "0",
          },
          "50%": {
            bottom: "25%",
            right: "40%",
          },
          "90%": {
            bottom: "50%",
            right: "25%",
          },
        },
        orbit: {
          "0%": {
            transform: "rotate(calc(var(--angle) * 1deg)) translateY(calc(var(--radius) * 1px)) rotate(calc(var(--angle) * -1deg))",
          },
          "100%": {
            transform: "rotate(calc(var(--angle) * 1deg + 360deg)) translateY(calc(var(--radius) * 1px)) rotate(calc((var(--angle) * -1deg) - 360deg))",
          },
        },
        marquee: {
          from: {
            transform: "translateX(0)",
          },
          to: {
            transform: "translateX(calc(-100% - var(--gap)))",
          },
        },
        "marquee-vertical": {
          from: {
            transform: "translateY(0)",
          },
          to: {
            transform: "translateY(calc(-100% - var(--gap)))",
          },
        },
        "shimmer-slide": {
          to: {
            transform: "translate(calc(100cqw - 100%), 0)",
          },
        },
        "spin-around": {
          "0%": {
            transform: "translateZ(0) rotate(0)",
          },
          "15%, 35%": {
            transform: "translateZ(0) rotate(90deg)",
          },
          "65%, 85%": {
            transform: "translateZ(0) rotate(270deg)",
          },
          "100%": {
            transform: "translateZ(0) rotate(360deg)",
          },
        },
        rainbow: {
          "0%": {
            "background-position": "0%",
          },
          "100%": {
            "background-position": "200%",
          },
        },
        shine: {
          "0%": {
            "background-position": "0% 0%",
          },
          "50%": {
            "background-position": "100% 100%",
          },
          to: {
            "background-position": "0% 0%",
          },
        },
        ripple: {
          "0%, 100%": {
            transform: "translate(-50%, -50%) scale(1)",
          },
          "50%": {
            transform: "translate(-50%, -50%) scale(0.9)",
          },
        },
      },
      animation: {
        slideRight: "slideRightAnimate 0.4s ease-in-out",
        fadeUp: "fadeUp 0.4s ease-in-out",
        slideDownAndFade: "slideDownAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)",
        slideLeftAndFade: "slideLeftAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)",
        slideUpAndFade: "slideUpAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)",
        slideRightAndFade: "slideRightAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)",
        "border-beam": "border-beam calc(var(--duration)*1s) infinite linear",
        orbit: "orbit calc(var(--duration)*1s) linear infinite",
        marquee: "marquee var(--duration) infinite linear",
        "marquee-vertical": "marquee-vertical var(--duration) linear infinite",
        "shimmer-slide": "shimmer-slide var(--speed) ease-in-out infinite alternate",
        "spin-around": "spin-around calc(var(--speed) * 2) infinite linear",
        rainbow: "rainbow var(--speed, 2s) infinite linear",
        shine: "shine var(--duration) infinite linear",
        ripple: "ripple var(--duration,2s) ease calc(var(--i, 0)*.2s) infinite",
      },
      fontSize: {
        ms: "15px",
        "2xs": "12px",
        sm1: "15px",
      },
      borderRadius: {
        medium: "0.625rem",
        large: "1.25rem",
        "4xl": "2rem",
        "5xl": "2.5rem",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        inter: ["var(--font-inter)"],
        manrope: ["var(--font-inter)"],
        gabarito: ["var(--font-inter)"],
        body: ["var(--font-inter)"],
      },
      screens: {
        xsm: "360px",
        "2lg": "1140px",
        lgm: "900px",
      },
      spacing: {
        navbar: "var(--navbarHeight)",
      },
    },
  },
  darkMode: ["class"],
  plugins: [require("tailwindcss-animate")],
};
