import { MD3DarkTheme, MD3LightTheme } from 'react-native-paper';

export const COLORS = {
  primary: '#FF9933', // Saffron
  secondary: '#138808', // Green
  accent: '#FFFFFF', // White
  background: '#F5F5F5',
  text: '#333333',
  textLight: '#666666',
  error: '#FF0000',
  success: '#00FF00',
  // Extended palette
  primaryLight: '#FFB366',
  primaryDark: '#CC7A26',
  secondaryLight: '#3D9B2A',
  secondaryDark: '#0D5A06',
  accentLight: '#F0F0F0',
  backgroundDark: '#1C1C1C',
  textDark: '#E0E0E0',
  textLightDark: '#A0A0A0',
  card: '#FFFFFF',
  cardDark: '#2A2A2A',
  border: '#E0E0E0',
  borderDark: '#404040',
};

export const FONTS = {
  regular: 'System',
  bold: 'System-Bold',
  // Custom fonts (to be loaded)
  title: 'Inter-Bold',
  body: 'Inter-Regular',
};

export const SPACING = {
  small: 8,
  medium: 16,
  large: 24,
  xlarge: 32,
  xxlarge: 48,
};

// export const API_BASE_URL = 'http://localhost:5000/api';
export const API_BASE_URL = 'https://bhandarlok.onrender.com/api';

// Themes for React Native Paper
export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: COLORS.primary,
    secondary: COLORS.secondary,
    background: COLORS.background,
    surface: COLORS.card,
    onSurface: COLORS.text,
    onBackground: COLORS.text,
    error: COLORS.error,
  },
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: COLORS.primary,
    secondary: COLORS.secondary,
    background: COLORS.backgroundDark,
    surface: COLORS.cardDark,
    onSurface: COLORS.textDark,
    onBackground: COLORS.textDark,
    error: COLORS.error,
  },
};
