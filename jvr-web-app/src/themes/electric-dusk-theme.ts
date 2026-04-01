/**
 * Electric Dusk Theme — Synced with styles.css tokens
 *
 * Brand Palette (Split-Complementary):
 *   Primary:   Royal Blue #1D6FE8 (--brand-blue)
 *   Secondary: Violet-Purple #7C3AED (--brand-purple)
 *   Accent:    Amber-Orange #F97316 (--brand-orange)
 *
 * Color Roles:
 *   Primary (interactive) → Blue + Purple (buttons, links, active states)
 *   Accent (CTAs)         → Orange (highlights, call-to-actions)
 *   Surface (backgrounds) → Blue-tinted neutrals (not pure gray)
 *
 * NOTE: PrimeNG preset files don't support CSS variable references.
 * Keep these values synced with styles.css primitives manually.
 */
export const electricDuskTheme = {
  semantic: {
    // Maps PrimeNG's "primary" scale to our brand blue→purple gradient
    // 500 = brand blue, darker values shift toward purple
    primary: {
      50:  '{blue.50}',
      100: '{blue.100}',
      200: '{blue.200}',
      300: '{blue.300}',
      400: '{blue.400}',
      500: '{blue.600}',   // #1D6FE8 (--brand-blue)
      600: '{indigo.600}',
      700: '{violet.700}',
      800: '{violet.800}',
      900: '{violet.900}',
      950: '{violet.950}',
    },
    colorScheme: {
      light: {
        // Interactive primary: matches --color-interactive tokens
        primary: {
          color: '#1D6FE8',           // --brand-blue
          contrastColor: '#FFFFFF',   // --color-cta-text
          hoverColor: '#7C3AED',      // --brand-purple
          activeColor: '#6B3BE6',     // --brand-purple-hover
        },
        // Accent/highlight: orange tints for selection states
        highlight: {
          background: '#FFEDD5',      // light orange tint
          focusBackground: '#FED7AA', // darker orange tint
          color: '#9A3412',           // dark orange text
          focusColor: '#7C2D12',      // darker focus text
        },
        // Surfaces: matches --neutral-* scale
        surface: {
          0: '#FFFFFF',    // --neutral-white
          50: '#F8F9FC',   // --neutral-50
          100: '#EEF2FF',  // --neutral-100
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
        // Interactive primary: brighter blues for dark mode
        primary: {
          color: '#5B9BF5',           // --brand-blue (dark mode)
          contrastColor: '#0A1628',   // --brand-blue-deep
          hoverColor: '#60A5FA',      // --brand-blue-light
          activeColor: '#A5B4FC',     // lighter active state
        },
        // Accent: semi-transparent orange for dark mode
        highlight: {
          background: 'color-mix(in srgb, #F97316, transparent 84%)',
          focusBackground: 'color-mix(in srgb, #F97316, transparent 76%)',
          color: 'rgba(255,255,255,0.87)',
          focusColor: 'rgba(255,255,255,0.87)',
        },
        // Surfaces: matches dark mode --neutral-* overrides
        surface: {
          0: '#0d1829',    // --neutral-white (dark)
          50: '#111f35',   // --neutral-50 (dark)
          100: '#152239',  // --neutral-100 (dark)
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
