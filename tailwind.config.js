const colors = require("tailwindcss/colors");
const defaultTheme = require("tailwindcss/defaultTheme");

const brandColor = colors.indigo;

module.exports = {
  // Add support for dark mode, toggled via a class:
  // https://tailwindcss.com/docs/dark-mode
  darkMode: "class",
  // Inform Tailwind of where our classes will be defined:
  // https://tailwindcss.com/docs/optimizing-for-production
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        xs: "400px",
      },
      container: (theme) => {
        return {
          center: true,
          padding: {
            DEFAULT: theme("spacing.6"),
            sm: theme("spacing.7"),
            lg: theme("spacing.8"),
            xl: theme("spacing.9"),
          },
        };
      },
      fontFamily: {
        sans: ["Nunito", ...defaultTheme.fontFamily.sans],
        madelyn: ["Madelyn Regular"],
        "tucker-tub": ["Tucker Tub"],
        "haboro-soft": ["haboro-soft"],
      },
      fontSize: {
        sm: ["14px", "20px"],
        smallCheckout: ["15px", "20px"],
        base: ["17px", "20px"],
        md: ["18px", "26px"],
        mdlg: ["19px", "27px"],
        lg: ["20px", "28px"],
        xl: ["24px", "32px"],
        unset: "unset",
        list: ["26px", "36px"],
        title: ["38px", "48px"],
        header: ["60px", "80px"],
        blockHeader: ["64px", "60px"],
        bigHeader: ["80px", "80px"],
        sliderTitle: ["44px", "56px"],
      },
      boxShadow: {
        sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        "ecPrimary-1": "0 0 2px 2px rgba(0, 0, 0, 0.05)",
        "ecPrimary-2": "0 0 2px 2px rgba(0, 0, 0, 0.10)",
        "ecPrimary-3": "0 0 2px 2px rgba(0, 0, 0, 0.15)",
        "ecPrimary-4": "2px 3px 8px 1px rgba(0, 0, 0, 0.2)",
        "ecSecondary-1": "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
        "ecSecondary-2": "0 4px 6px -1px rgba(0, 0, 0, 0.10)",
        "ecSecondary-3": "0 4px 6px -1px rgba(0, 0, 0, 0.15)",
        "ecSecondary-4": "0 4px 6px -1px rgba(0, 0, 0, 0.20)",
        "consultation": "0 0 15px -3px rgb(0 0 0 / 0.1), 0 0 6px -4px rgb(0 0 0 / 0.1)",
        inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)",
        none: "none",
      },
      backgroundImage: {
        "gradient-brown":
          "linear-gradient(to right, #C49B78, #C49B78 50%, transparent 80%)",
        "gradient-brown-vertical":
          "linear-gradient(to top, #C49B78, #C49B78 50%, transparent 80%)",
        "shadow-1": "url(/assets/shadows/1.svg)",
        "shadow-2": "url(/assets/shadows/2.svg)",
        "shadow-3": "url(/assets/shadows/3.svg)",
        "shadow-4": "url(/assets/shadows/4.svg)",
        "bannercurve": "url(/assets/banner/banner.svg)",
        "meat": "url(/assets/images/meat1.jpeg)",
        "slide-1": "url(/assets/images/slider/slide-1.jpg)",
        "slide-2": "url(/assets/images/slider/slide-2.jpg)",
        "slide-3": "url(/assets/images/slider/slide-3.jpg)",
        'split-bg': "linear-gradient(to bottom, #FFF7F0 60% , #CB9972 40%);",
        "consultation": "url(/assets/images/consultation.jpeg)",
        "thriving-dog": "url(/assets/images/thriving-dog.jpeg)"
      },
      backgroundSize: {
        'auto': 'auto',
        'cover': 'cover',
        'contain': 'contain',
        '50%': '50%',
        '16': '4rem',
      },
      brightness: {
        10: 0.1,
        20: 0.2,
        30: 0.3,
        40: 0.4,
      },
      height: {
        inherit: "inherit",
        footerHeight: "10vh",
        navbarHeight: "10vh",
        layoutHeight:
          "calc(100vh - var(--navbar-height) - var(--announcement-bar-height))",
        unset: "unset",
      },
      minHeight: {
        layoutHeight:
          "calc(100vh - var(--navbar-height) - var(--announcement-bar-height))",
        inherit: "inherit",
        navbarHeight: "10vh",
        unset: "unset",
      },
      maxHeight: {
        inherit: "inherit",
        layoutHeight:
        "calc(100vh - var(--navbar-height) - var(--announcement-bar-height))",
        unset: "unset",
      },
      width: {
        inherit: "inherit",
        unset: "unset",
      },
      padding: {
        navbarHeight: "var(--navbar-height)"
      },
      gridTemplateColumns: {
        twoColumns: "repeat(2, 1fr)",
        threeColumns: "repeat(3, 1fr)",
        sixColumns: "repeat(6, 1fr)",
        eightColumns: "repeat(8, 1fr)",
        autoFitLarge: "repeat(auto-fit, minmax(6rem, 6rem))",
        specialTwoColumns: "1fr 0.1fr",
        specialThreeColumns: "0.5fr 1fr 0.5fr",
      },
      colors: {
        inherit: "inherit",
        colorOne: "rgba(10, 10, 10, 1)",
        colorTwo: "rgba(44, 102, 110, 1)",
        colorThree: "rgba(82, 82, 82, 1)",
        colorFour: "rgba(163, 163, 163, 1)",
        colorFive: "rgba(178, 169, 174, 1)",
        colorSix: "rgba(214, 214, 214, 1)",
        colorSeven: "rgba(99, 88, 94, 1)",
        colorEight: "rgba(65, 34, 52, 1)",
        colorNine: "rgba(235, 235, 235, 1)",
        colorTen: "rgba(134, 203, 146, 1)",
        colorEleven: "rgba(245, 245, 245, 1)",
        colorTwelve: "rgba(212, 237, 216, 1)",
        colorThirteen: "rgba(153, 57, 85, 1)",
        colorFourteen: "rgba(1, 64, 50, 1)",
        colorFifteen: "rgba(255, 247, 240, 1)",
        colorSixteen: "rgba(203, 153, 114, 1)",
        colorSeventeen: "rgba(208, 255, 206, 1)",
        colorEighteen: "rgba(161, 217, 247, 1)",
        
        // NOTE: We modify the gray color, as the default Tailwind gray color is heavily saturated
        // with blue, which makes it look strange in dark mode. This gray color is more balanced,
        // and works better for sites supporting dark mode.
        gray: colors.gray,
        // Add a new "brand" color to all Tailwind utilities, so that we can easily change it.
        brand: brandColor,
      },
      // Modify the default ring color so that it matches the brand color:
      ringColor: {
        DEFAULT: brandColor["500"],
      },
    },
  },
  variants: {
    extend: {
      translate: ["active"],
    },
  },
  // Add some basic Tailwind plugins to add additional features:
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/aspect-ratio"),
    require("@tailwindcss/forms"),
    require("@tailwindcss/line-clamp"),
  ],
};
