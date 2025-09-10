// Global color configuration for the recruitment dashboard
// Change colors here to update them across the entire application

export const colors = {
  // Primary brand color (vibrant green/lime)
  primary: {
    50: "#DBF0DCFF",
    100: "#2FE13BA0",
    200: "#48C650FF",
    300: "#10ED1FFF",
    400: "#10ED1FFF", // Main primary color
    500: "#10ED1FFF",
    600: "#10ED1FFF",
    700: "#10ED1FFF",
    800: "#10ED1FFF",
    900: "#10ED1FFF",
  },

  // Background colors
  background: {
    main: "#000000", // Black
    card: "#000000", // Black
    hover: "#1f2937", // Dark gray for hover states
  },

  // Text colors
  text: {
    primary: "#ffffff", // White
    secondary: "#d1d5db", // Light gray
    muted: "#9ca3af", // Medium gray
    accent: "#10ED1FFF", // Primary color for accents
  },

  // Border colors
  border: {
    default: "#4b5563", // Gray-600
    light: "#6b7280", // Gray-500
    accent: "#10ED1FFF", // Primary color for accent borders
  },

  // Status colors for year badges
  year: {
    "1st year": {
      bg: "#10ED1FFF", // lime-900
      text: "#86efac", // lime-300
      border: "#22c55e", // lime-500
    },
    "2nd year": {
      bg: "#10ED1FFF", // lime-800
      text: "#bbf7d0", // lime-200
      border: "#4ade80", // lime-400
    },
    "3rd year": {
      bg: "#10ED1FFF", // lime-700
      text: "#dcfce7", // lime-100
      border: "#86efac", // lime-300
    },
    "4th year": {
      bg: "#10ED1FFF", // lime-600
      text: "#ffffff", // white
      border: "#bbf7d0", // lime-200
    },
  },

  // Chart colors (vibrant palette)
  chart: [
    "#FA6247FF", // Red
    "#4ecdc4", // Teal
    "#45b7d1", // Blue
    "#40EC9CFF", // Green
    "#E2E831FF", // Yellow
    "#E65096FF", // Plum
    "#4BF138FF", // Mint
    "#f7dc6f", // Gold
    "#AA34DDFF", // Lavender
    "#4B54F2FF", // Light Blue
  ],

  // Card colors for stats
  cards: {
    blue: {
      bg: "#245EFFFF", // blue-900
      text: "#dbeafe", // blue-100
      accent: "#60a5fa", // blue-400
    },
    lime: {
      bg: "#4AF93AFF", // lime-900
      text: "#dcfce7", // lime-100
      accent: "#5CEE2FFF", // lime-400
    },
    purple: {
      bg: "#581c87", // purple-900
      text: "#e9d5ff", // purple-100
      accent: "#a855f7", // purple-400
    },
    yellow: {
      bg: "#126F71FF", // yellow-900
      text: "#fef3c7", // yellow-100
      accent: "#fbbf24", // yellow-400
    },
  },
} as const;

// Helper function to get year badge classes
export const getYearBadgeClasses = (year: string): string => {
  const yearColors = colors.year[year as keyof typeof colors.year];
  if (yearColors) {
    return `bg-[${yearColors.bg}] text-[${yearColors.text}] border border-[${yearColors.border}]`;
  }
  return "bg-gray-800 text-gray-300";
};

// Helper function to get chart color by index
export const getChartColor = (index: number): string => {
  return colors.chart[index % colors.chart.length];
};
