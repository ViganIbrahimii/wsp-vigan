/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
        md: "768px",
      },
    },
    extend: {
      content: {
        "left-angle": 'url("/leftAngle.svg")',
        "right-angle": 'url("/rightAngle.svg")',
        "sign-in": 'url("/signin.png")',
      },
      backgroundImage: {
        "body-gradient": "var(--body-gradient)",
        "sign-in": 'url("/signin.png")',
        "left-angle": 'url("/leftAngle.svg")',
        "right-angle": 'url("/rightAngle.svg")',
      },
      fontFamily: {
        "dm-sans": ['"DM Sans"', "sans-serif"],
      },
      fontSize: {
        "title-1": [
          "32px",
          {
            lineHeight: "40px",
            letterSpacing: "-0.03em",
          },
        ],
        "title-2": [
          "24px",
          {
            lineHeight: "32px",
            letterSpacing: "-0.02em",
          },
        ],
        "title-3": [
          "22px",
          {
            lineHeight: "24px",
            letterSpacing: "-0.01em",
          },
        ],
        headline: [
          "20px",
          {
            lineHeight: "24px",
            letterSpacing: "-0.01em",
          },
        ],
        "body-bold": [
          "16px",
          {
            lineHeight: "24px",
            letterSpacing: "-0.01em",
            fontWeight: "500",
          },
        ],
        "body-normal": [
          "16px",
          {
            lineHeight: "24px",
            letterSpacing: "-0.01em",
            fontWeight: "400",
          },
        ],
        "body-link-normal": [
          "16px",
          {
            lineHeight: "24px",
            letterSpacing: "-0.01em",
            fontWeight: "400",
          },
        ],
        "button-large": [
          "16px",
          {
            lineHeight: "24px",
            letterSpacing: "-0.01em",
            fontWeight: "700",
          },
        ],
        "button-small": [
          "14px",
          {
            lineHeight: "16px",
            fontWeight: "700",
          },
        ],
        "caption-bold": [
          "13px",
          {
            lineHeight: "16px",
            fontWeight: "700",
          },
        ],
        "caption-normal": [
          "13px",
          {
            lineHeight: "16px",
            fontWeight: "400",
          },
        ],
        "caption-link-bold": [
          "13px",
          {
            lineHeight: "16px",
            fontWeight: "700",
          },
        ],
        "caption-link-normal": [
          "13px",
          {
            lineHeight: "16px",
            fontWeight: "500",
          },
        ],
      },
      fontWeight: {
        bold: 700,
        medium: 500,
        normal: 400,
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        "icon-black-100": "var(--icon-black-100)",
        "icon-black-40": "var(--icon-black-40)",
        "icon-white-100": "var(--icon-white-100)",
        signIn: {
          DEFAULT: "var(--signIn-background)",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      backgroundColor: {
        brand: "var(--brand-background)",
        "status-ordered": "var(--status-ordered-background)",
        "status-accepted": "var(--status-accepted-background)",
        "status-ready": "var(--status-ready-background)",
        "status-served": "var(--status-served-background)",
        "status-canceled": "var(--status-canceled-background)",
        "black-100": "var(--black-background-100)",
        "black-60": "var(--black-background-60)",
        "black-40": "var(--black-background-40)",
        "black-10": "var(--black-background-10)",
        "black-5": "var(--black-background-5)",
        "white-100": "var(--white-background-100)",
        "white-70": "var(--white-background-70)",
        "white-60": "var(--white-background-60)",
        "white-20": "var(--white-background-20)",
        "semantic-green-100": "var(--semantic-green-background)",
        "checked-green": "var(--checked-green-background)",
        "unchecked-grey": "var(--unchecked-grey-background)",
        "semantic-green-20": "var(--semantic-light-green-background)",
        "semantic-yellow-100": "var(--semantic-yellow-background)",
        "semantic-yellow-20": "var(--semantic-light-yellow-background)",
        "semantic-red-100": "var(--semantic-red-background)",
        "semantic-red-20": "var(--semantic-light-red-background)",
        "semantic-blue-100": "var(--semantic-blue-background)",
        "semantic-blue-20": "var(--semantic-light-blue-background)",
        "body-white": "var(--body-background-white)",
      },
      textColor: {
        "black-100": "var(--text-black-100)",
        "black-60": "var(--text-black-60)",
        "black-40": "var(--text-black-40)",
        "white-100": "var(--text-white-100)",
        brand: "var(--brand-background)",
        "status-ordered": "var(--text-status-ordered)",
        "status-accepted": "var(--text-status-accepted)",
        "status-ready": "var(--text-status-ready)",
        "status-served": "var(--text-status-served)",
        "status-canceled": "var(--text-status-canceled)",
        "semantic-green": "var(--text-semantic-green)",
        "semantic-red": "var(--text-semantic-red)",
        "semantic-blue": "var(--text-semantic-blue)",
        "semantic-yellow": "var(--text-semantic-yellow)",
      },
      borderColor: {
        "black-100": "var(--border-black-100)",
        "black-20": "var(--border-black-20)",
        "black-10": "var(--border-black-10)",
        "status-ordered": "var(--border-status-ordered)",
        "status-accepted": "var(--border-status-accepted)",
        "status-ready": "var(--border-status-ready)",
        "status-served": "var(--border-status-served)",
        "status-canceled": "var(--border-status-canceled)",
        "status-livecounter-ordered":
          "var(--border-status-livecounter-ordered)",
        "status-livecounter-free": "var(--border-status-livecounter-free)",
        "semantic-green": "var(--text-semantic-green)",
        brand: "var(--border-brand)",
      },
      outlineColor: {
        "black-100": "var(--border-black-100)",
        "black-20": "var(--border-black-20)",
        "black-10": "var(--border-black-10)",
        "status-ordered": "var(--border-status-ordered)",
        "status-accepted": "var(--border-status-accepted)",
        "status-ready": "var(--border-status-ready)",
        "status-served": "var(--border-status-served)",
      },
      boxShadow: {
        "float-black-button": "var(--shadow-float-black-button)",
        modal: "var(--shadow-modal)",
        notification: "var(--shadow-notification)",
        "button-short": "var(--shadow-button-short)",
        "sticky-header": "var(--shadow-sticky-header)",
        "inset-top": "inset 0 30px 30px -10px rgba(0, 0, 0, 0.1)",
        "inset-right": "inset -80px 0 50px -80px rgba(0, 0, 0, 0.4)",
      },
      borderRadius: {
        0: "var(--round-0)",
        3: "var(--round-3)",
        5: "var(--round-5)",
        6: "var(--round-6)",
      },
      spacing: {
        0: "var(--spacing-0)",
        1: "var(--spacing-1)",
        2: "var(--spacing-2)",
        3: "var(--spacing-3)",
        4: "var(--spacing-4)",
        5: "var(--spacing-5)",
        6: "var(--spacing-6)",
        7: "var(--spacing-7)",
        8: "var(--spacing-8)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        slideOutRight: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(100%)" },
        },
        slideInRight: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
        slideOutLeft: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-100%)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "slide-out-right": "slideOutRight 1s forwards",
        "slide-in-right": "slideInRight 1s forwards",
        "slide-out-left": "slideOutLeft 1s forwards",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
