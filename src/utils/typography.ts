import { FONT_FAMILIES, FONT_WEIGHTS } from '../constants/theme';

export interface FontStyle {
    fontFamily: string;
    fontWeight?: string;
}

/**
 * Get font style object for use in React Native Text components
 * @param weight - Font weight variant (regular, medium, semiBold, bold, extraBold, black)
 * @returns Object with fontFamily and fontWeight properties
 */
export const getFont = (weight: keyof typeof FONT_FAMILIES = 'regular'): FontStyle => {
    return {
        fontFamily: FONT_FAMILIES[weight],
        fontWeight: FONT_WEIGHTS[weight],
    };
};

/**
 * Typography helper for creating consistent text styles
 */
export const typography = {
    heading1: {
        ...getFont('bold'),
        fontSize: 32,
        lineHeight: 40,
    },
    heading2: {
        ...getFont('semiBold'),
        fontSize: 28,
        lineHeight: 36,
    },
    heading3: {
        ...getFont('semiBold'),
        fontSize: 24,
        lineHeight: 32,
    },
    heading4: {
        ...getFont('medium'),
        fontSize: 20,
        lineHeight: 28,
    },
    body: {
        ...getFont('regular'),
        fontSize: 16,
        lineHeight: 24,
    },
    bodySmall: {
        ...getFont('regular'),
        fontSize: 14,
        lineHeight: 20,
    },
    caption: {
        ...getFont('regular'),
        fontSize: 12,
        lineHeight: 16,
    },
    button: {
        ...getFont('medium'),
        fontSize: 16,
        lineHeight: 24,
    },
} as const;
