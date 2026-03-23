/**
 * Electric Dusk — Royal blue / violet-purple / amber-orange
 *
 * Color role mapping:
 *   Primary (surfaces/neutrals) → white/light grays  →  zinc/slate scale
 *   Secondary (interactive)     → royal blue + violet →  indigo→violet scale
 *   Accent (highlights/CTAs)    → amber-orange        →  orange scale
 *
 * Uses Aura's built-in primitive palettes (blue, indigo, violet, orange, zinc)
 * so all token references are valid and resolvable.
 */
export const electricDuskTheme = {
  semantic: {
    // Maps PrimeNG's "primary" action scale to blue→indigo→violet
    // 500 anchors to brand blue (#1D6FE8 ≈ blue.600 in Tailwind scale)
    primary: {
      50:  '{blue.50}',
      100: '{blue.100}',
      200: '{blue.200}',
      300: '{blue.300}',
      400: '{blue.400}',
      500: '{blue.600}',   // ≈ #1D6FE8 — brand blue
      600: '{indigo.600}',
      700: '{violet.700}',
      800: '{violet.800}',
      900: '{violet.900}',
      950: '{violet.950}',
    },
    colorScheme: {
      light: {
        // Interactive primary: royal blue → shifts to violet on hover
        primary: {
          color: '#1D6FE8',
          contrastColor: '#FFFFFF',
          hoverColor: '#7C3AED',
          activeColor: '#6B3BE6',
        },
        // Accent: amber-orange for selected/highlighted states
        highlight: {
          background: '#FFEDD5',
          focusBackground: '#FED7AA',
          color: '#9A3412',
          focusColor: '#7C2D12',
        },
        // Surfaces: aligned to brand --bg-white / --bg-light / --bg-light-2
        surface: {
          0: '#FFFFFF',   // --bg-white
          50: '#F8F9FC',  // --bg-light
          100: '#EEF2FF', // --bg-light-2
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1F2937',
          900: '#0B1220',
          950: '#05090F',
        },
      },
      dark: {
        // Interactive primary: lighter indigo for dark backgrounds
        primary: {
          color: '#818CF8',
          contrastColor: '#0A1628',
          hoverColor: '#A5B4FC',
          activeColor: '#C7D2FE',
        },
        // Accent: orange with transparency for dark mode
        highlight: {
          background: 'color-mix(in srgb, #F97316, transparent 84%)',
          focusBackground: 'color-mix(in srgb, #F97316, transparent 76%)',
          color: 'rgba(255,255,255,0.87)',
          focusColor: 'rgba(255,255,255,0.87)',
        },
        // Surfaces: dark navy matched to --bg-white / --bg-light / --bg-light-2
        surface: {
          0: '#0d1829',   // --bg-white (dark)
          50: '#111f35',  // --bg-light (dark)
          100: '#1A2235',
          200: '#16202E',
          300: '#121A28',
          400: '#0E1520',
          500: '#0B1220',
          600: '#080E18',
          700: '#060B12',
          800: '#04080C',
          900: '#020406',
          950: '#000000',
        },
      },
    },
  },
};

export default electricDuskTheme;
