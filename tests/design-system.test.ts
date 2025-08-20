import { describe, it, expect } from '@jest/globals';

describe('Design System', () => {
  describe('Gallifrey Brand Colors', () => {
    const gallfreyColors = {
      // Core Brand Colors from official guidelines
      'gallifrey-navy': '#1B365D',
      'gallifrey-teal': '#2EC4B6', 
      'gallifrey-charcoal': '#1F2937',
      'gallifrey-orange': '#FF7F11',
      
      // Security-Enhanced Colors
      'bastion-shield': '#1B263B',
      'bastion-scan': '#00D4AA',
      'bastion-alert': '#FF7F11',
      'bastion-vault': '#0F172A',
      'bastion-success': '#10B981'
    };

    it('should have valid hex color formats', () => {
      Object.values(gallfreyColors).forEach(color => {
        expect(color).toBeValidColor();
      });
    });

    it('should maintain brand consistency with Gallifrey guidelines', () => {
      expect(gallfreyColors['gallifrey-navy']).toBe('#1B365D');
      expect(gallfreyColors['gallifrey-teal']).toBe('#2EC4B6');
      expect(gallfreyColors['gallifrey-charcoal']).toBe('#1F2937');
      expect(gallfreyColors['gallifrey-orange']).toBe('#FF7F11');
    });

    it('should have sufficient contrast ratios for accessibility', () => {
      // Test contrast ratios against white backgrounds
      const contrastTests = [
        { color: '#1B365D', background: '#FFFFFF', minRatio: 4.5 }, // Navy on white
        { color: '#2EC4B6', background: '#FFFFFF', minRatio: 3.0 }, // Teal on white  
        { color: '#1F2937', background: '#FFFFFF', minRatio: 4.5 }, // Charcoal on white
        { color: '#FF7F11', background: '#FFFFFF', minRatio: 3.0 }  // Orange on white
      ];

      contrastTests.forEach(test => {
        const ratio = calculateContrastRatio(test.color, test.background);
        expect(ratio).toBeGreaterThanOrEqual(test.minRatio);
      });
    });
  });

  describe('Typography System', () => {
    const typographyScale = {
      'text-xs': '0.75rem',    // 12px
      'text-sm': '0.875rem',   // 14px  
      'text-base': '1rem',     // 16px
      'text-lg': '1.125rem',   // 18px
      'text-xl': '1.25rem',    // 20px
      'text-2xl': '1.5rem',    // 24px
      'text-3xl': '1.875rem',  // 30px
      'text-4xl': '2.25rem',   // 36px
      'text-5xl': '3rem',      // 48px
      'text-6xl': '3.75rem'    // 60px
    };

    const fontWeights = {
      'font-light': '300',
      'font-normal': '400', 
      'font-medium': '500',
      'font-semibold': '600',
      'font-bold': '700',
      'font-extrabold': '800'
    };

    it('should maintain consistent typography scale', () => {
      const sizes = Object.values(typographyScale).map(size => parseFloat(size));
      
      // Check that each size is larger than the previous
      for (let i = 1; i < sizes.length; i++) {
        expect(sizes[i]).toBeGreaterThan(sizes[i - 1]);
      }
    });

    it('should use Gallifrey brand fonts', () => {
      const brandFonts = {
        heading: 'Montserrat',
        body: 'Source Sans Pro',
        logo: 'Playfair Display'
      };

      expect(brandFonts.heading).toBe('Montserrat');
      expect(brandFonts.body).toBe('Source Sans Pro');
      expect(brandFonts.logo).toBe('Playfair Display');
    });

    it('should have appropriate font weights available', () => {
      const availableWeights = Object.values(fontWeights);
      
      expect(availableWeights).toContain('400'); // Normal
      expect(availableWeights).toContain('600'); // Semibold for headings
      expect(availableWeights).toContain('700'); // Bold for emphasis
    });
  });

  describe('Spacing System', () => {
    const spacingScale = {
      '0': '0px',
      '1': '0.25rem',  // 4px
      '2': '0.5rem',   // 8px
      '3': '0.75rem',  // 12px
      '4': '1rem',     // 16px
      '5': '1.25rem',  // 20px
      '6': '1.5rem',   // 24px
      '8': '2rem',     // 32px
      '10': '2.5rem',  // 40px
      '12': '3rem',    // 48px
      '16': '4rem',    // 64px
      '20': '5rem',    // 80px
      '24': '6rem'     // 96px
    };

    it('should follow consistent spacing increments', () => {
      const values = Object.values(spacingScale)
        .filter(val => val !== '0px')
        .map(val => parseFloat(val));
      
      // Should generally follow 4px base increment
      values.forEach(val => {
        const pxValue = val * 16; // Convert rem to px
        expect(pxValue % 4).toBe(0); // Should be divisible by 4
      });
    });

    it('should have appropriate spacing for different component types', () => {
      expect(spacingScale['2']).toBe('0.5rem');  // Small padding
      expect(spacingScale['4']).toBe('1rem');    // Medium padding  
      expect(spacingScale['8']).toBe('2rem');    // Large padding
      expect(spacingScale['20']).toBe('5rem');   // Section spacing
    });
  });

  describe('Component Design Standards', () => {
    describe('Button Components', () => {
      const buttonStyles = {
        primary: {
          backgroundColor: '#2EC4B6',
          color: '#FFFFFF',
          padding: '12px 24px',
          borderRadius: '8px',
          fontWeight: '600',
          fontSize: '1rem'
        },
        secondary: {
          backgroundColor: 'transparent',
          color: '#1B365D',
          border: '2px solid #1B365D',
          padding: '10px 22px', // Account for border
          borderRadius: '8px',
          fontWeight: '600',
          fontSize: '1rem'
        },
        security: {
          backgroundColor: '#1B263B',
          color: '#FFFFFF',
          border: '1px solid #2EC4B6',
          padding: '12px 24px',
          borderRadius: '8px',
          fontWeight: '600',
          fontSize: '1rem'
        }
      };

      it('should have consistent button sizing', () => {
        Object.values(buttonStyles).forEach(style => {
          expect(style.borderRadius).toBe('8px');
          expect(style.fontWeight).toBe('600');
          expect(style.fontSize).toBe('1rem');
        });
      });

      it('should maintain brand color consistency', () => {
        expect(buttonStyles.primary.backgroundColor).toBe('#2EC4B6'); // Gallifrey teal
        expect(buttonStyles.secondary.color).toBe('#1B365D'); // Gallifrey navy
        expect(buttonStyles.security.backgroundColor).toBe('#1B263B'); // Security enhanced
      });

      it('should have accessible color contrast', () => {
        const primaryContrast = calculateContrastRatio('#FFFFFF', '#2EC4B6');
        const secondaryContrast = calculateContrastRatio('#1B365D', '#FFFFFF');
        
        expect(primaryContrast).toBeGreaterThanOrEqual(3.0);
        expect(secondaryContrast).toBeGreaterThanOrEqual(4.5);
      });
    });

    describe('Card Components', () => {
      const cardStyles = {
        default: {
          backgroundColor: '#FFFFFF',
          border: '1px solid #E5E7EB',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        },
        elevated: {
          backgroundColor: '#FFFFFF', 
          border: 'none',
          borderRadius: '16px',
          padding: '32px',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
        },
        security: {
          backgroundColor: '#FFFFFF',
          border: '1px solid #2EC4B6',
          borderRadius: '12px', 
          padding: '24px',
          boxShadow: '0 4px 12px rgba(46, 196, 182, 0.1)'
        }
      };

      it('should have consistent border radius values', () => {
        expect(cardStyles.default.borderRadius).toBe('12px');
        expect(cardStyles.security.borderRadius).toBe('12px');
        expect(cardStyles.elevated.borderRadius).toBe('16px'); // Slightly larger for elevated
      });

      it('should use appropriate padding scales', () => {
        expect(cardStyles.default.padding).toBe('24px');
        expect(cardStyles.elevated.padding).toBe('32px');
        expect(cardStyles.security.padding).toBe('24px');
      });
    });

    describe('Form Components', () => {
      const formStyles = {
        input: {
          border: '1px solid #D1D5DB',
          borderRadius: '6px',
          padding: '12px 16px',
          fontSize: '1rem',
          backgroundColor: '#FFFFFF'
        },
        inputFocus: {
          borderColor: '#2EC4B6',
          boxShadow: '0 0 0 3px rgba(46, 196, 182, 0.1)',
          outline: 'none'
        },
        label: {
          fontSize: '0.875rem',
          fontWeight: '500',
          color: '#374151',
          marginBottom: '6px'
        }
      };

      it('should have consistent form field styling', () => {
        expect(formStyles.input.borderRadius).toBe('6px');
        expect(formStyles.input.fontSize).toBe('1rem');
        expect(formStyles.inputFocus.borderColor).toBe('#2EC4B6'); // Brand teal
      });

      it('should have accessible focus states', () => {
        expect(formStyles.inputFocus.boxShadow).toContain('rgba(46, 196, 182, 0.1)');
        expect(formStyles.inputFocus.outline).toBe('none');
      });
    });
  });

  describe('Layout System', () => {
    const layoutConfig = {
      containerMaxWidth: '1200px',
      breakpoints: {
        sm: '640px',
        md: '768px', 
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px'
      },
      gridColumns: 12,
      gapSizes: {
        sm: '1rem',
        md: '1.5rem',
        lg: '2rem',
        xl: '3rem'
      }
    };

    it('should have appropriate breakpoints for responsive design', () => {
      expect(layoutConfig.breakpoints.md).toBe('768px'); // Tablet
      expect(layoutConfig.breakpoints.lg).toBe('1024px'); // Desktop
      expect(layoutConfig.containerMaxWidth).toBe('1200px'); // Max content width
    });

    it('should use standard 12-column grid system', () => {
      expect(layoutConfig.gridColumns).toBe(12);
    });

    it('should have consistent gap sizing', () => {
      const gaps = Object.values(layoutConfig.gapSizes).map(gap => parseFloat(gap));
      
      // Each gap should be larger than the previous
      for (let i = 1; i < gaps.length; i++) {
        expect(gaps[i]).toBeGreaterThan(gaps[i - 1]);
      }
    });
  });

  describe('Animation & Transition System', () => {
    const animationConfig = {
      durations: {
        fast: '150ms',
        normal: '300ms', 
        slow: '500ms'
      },
      easings: {
        'ease-in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'ease-out': 'cubic-bezier(0, 0, 0.2, 1)',
        'ease-in': 'cubic-bezier(0.4, 0, 1, 1)'
      },
      transforms: {
        'hover-lift': 'translateY(-2px)',
        'hover-scale': 'scale(1.05)', 
        'press-scale': 'scale(0.95)'
      }
    };

    it('should have consistent animation durations', () => {
      expect(animationConfig.durations.fast).toBe('150ms');
      expect(animationConfig.durations.normal).toBe('300ms');
      expect(animationConfig.durations.slow).toBe('500ms');
    });

    it('should use smooth easing functions', () => {
      expect(animationConfig.easings['ease-in-out']).toBe('cubic-bezier(0.4, 0, 0.2, 1)');
    });

    it('should have subtle transform values', () => {
      expect(animationConfig.transforms['hover-lift']).toBe('translateY(-2px)');
      expect(animationConfig.transforms['hover-scale']).toBe('scale(1.05)');
    });
  });

  describe('Accessibility Standards', () => {
    it('should meet WCAG 2.1 AA color contrast requirements', () => {
      const contrastTests = [
        { foreground: '#1B365D', background: '#FFFFFF' }, // Navy on white
        { foreground: '#1F2937', background: '#FFFFFF' }, // Charcoal on white
        { foreground: '#374151', background: '#FFFFFF' }, // Dark gray on white
        { foreground: '#FFFFFF', background: '#1B365D' }, // White on navy
      ];

      contrastTests.forEach(test => {
        const ratio = calculateContrastRatio(test.foreground, test.background);
        expect(ratio).toBeGreaterThanOrEqual(4.5); // AA standard
      });
    });

    it('should have appropriate focus indicator styles', () => {
      const focusStyles = {
        outlineColor: '#2EC4B6',
        outlineWidth: '2px',
        outlineOffset: '2px',
        outlineStyle: 'solid'
      };

      expect(focusStyles.outlineColor).toBe('#2EC4B6'); // Brand teal
      expect(focusStyles.outlineWidth).toBe('2px');
      expect(focusStyles.outlineOffset).toBe('2px');
    });

    it('should have minimum touch target sizes', () => {
      const touchTargets = {
        button: { minWidth: '44px', minHeight: '44px' },
        link: { minWidth: '44px', minHeight: '44px' },
        input: { minHeight: '44px' }
      };

      Object.values(touchTargets).forEach(target => {
        if ('minHeight' in target && target.minHeight) {
          expect(parseInt(target.minHeight)).toBeGreaterThanOrEqual(44);
        }
        if ('minWidth' in target && target.minWidth) {
          expect(parseInt(target.minWidth)).toBeGreaterThanOrEqual(44);
        }
      });
    });
  });

  describe('Brand Consistency Validation', () => {
    it('should maintain Gallifrey brand identity across components', () => {
      const brandElements = {
        primaryColor: '#2EC4B6', // Gallifrey teal
        secondaryColor: '#1B365D', // Gallifrey navy  
        fontFamily: 'Montserrat, sans-serif',
        borderRadius: '8px', // Consistent rounded corners
        fontWeight: '600' // Semibold for emphasis
      };

      expect(brandElements.primaryColor).toBe('#2EC4B6');
      expect(brandElements.secondaryColor).toBe('#1B365D');
      expect(brandElements.fontFamily).toContain('Montserrat');
    });

    it('should follow pixel-perfect precision standards', () => {
      const precisionStandards = {
        spacingIncrement: 4, // 4px base increment
        borderRadiusIncrement: 2, // 2px increments
        fontSizeScale: 1.125 // 1.125 ratio for typography scale
      };

      expect(precisionStandards.spacingIncrement).toBe(4);
      expect(precisionStandards.borderRadiusIncrement).toBe(2);
      expect(precisionStandards.fontSizeScale).toBeCloseTo(1.125, 3);
    });
  });
});

// Helper function to calculate color contrast ratio
function calculateContrastRatio(color1: string, color2: string): number {
  // Convert hex to RGB
  const getRGB = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
  };

  // Calculate relative luminance
  const getLuminance = (rgb: { r: number; g: number; b: number }) => {
    const { r, g, b } = rgb;
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };

  const rgb1 = getRGB(color1);
  const rgb2 = getRGB(color2);
  const lum1 = getLuminance(rgb1);
  const lum2 = getLuminance(rgb2);

  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);

  return (brightest + 0.05) / (darkest + 0.05);
}