import { createContext, PropsWithChildren, useContext } from "react";
import { useColorScheme } from "react-native";
import { colors, fonts, radii, spacing, type ThemeColor, type ThemeFont, type ThemeRadii, type ThemeSpacing } from "@/theme/tokens";

type Theme = {
    colors: ThemeColor,
    fonts: ThemeFont,
    spacing: ThemeSpacing,
    radii: ThemeRadii
}

const ThemeContext = createContext<Theme | null>(null);

export const ThemeProvider = ({ children }: PropsWithChildren) => {
    const colorsScheme = useColorScheme();

    const theme: Theme = {
        colors: colorsScheme === 'dark' ? colors.dark : colors.light,
        fonts,
        spacing,
        radii
    };

    return (
        <ThemeContext.Provider value={theme}>
            {children}
        </ThemeContext.Provider>
    )
}

export const useTheme = (): Theme => {
    const theme = useContext(ThemeContext);
    if (!theme) {
        throw new Error('Should be used within ThemeProvider')
    }

    return theme
}