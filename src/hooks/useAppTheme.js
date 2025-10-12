import { useTheme as useMuiTheme } from '@mui/material/styles';
import { useTheme as useCustomTheme } from '../context/ThemeContext';

/**
 * Utility hook łączący MUI theme z custom theme context
 * Zapewnia dostęp do obu theme systemów w jednym hook
 */
export const useAppTheme = () => {
    const muiTheme = useMuiTheme();
    const customTheme = useCustomTheme();

    return {
        // MUI theme
        palette: muiTheme.palette,
        typography: muiTheme.typography,
        breakpoints: muiTheme.breakpoints,
        spacing: muiTheme.spacing,
        
        // Custom theme context
        isDarkMode: customTheme.isDarkMode,
        toggleTheme: customTheme.toggleTheme,
        
        // Helper functions
        getGlassStyle: () => ({
            backgroundColor: muiTheme.palette.glass?.background || 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            border: `1px solid ${muiTheme.palette.glass?.border || 'rgba(255, 255, 255, 0.2)'}`,
        }),
        
        getCardShadow: () => ({
            boxShadow: customTheme.isDarkMode 
                ? '0 8px 32px rgba(0, 0, 0, 0.3)'
                : '0 8px 32px rgba(0, 0, 0, 0.1)',
        }),
        
        getGradientText: (colors = [muiTheme.palette.primary.main, muiTheme.palette.secondary.main]) => ({
            background: `linear-gradient(45deg, ${colors[0]}, ${colors[1]})`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
        }),
    };
};

export default useAppTheme;