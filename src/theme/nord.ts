import { createTheme } from '@mui/material/styles';

const nordTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#5E81AC', // Nord 10
      light: '#81A1C1', // Nord 9
      dark: '#4C566A', // Nord 3
    },
    secondary: {
      main: '#88C0D0', // Nord 8
      light: '#8FBCBB', // Nord 7
    },
    error: {
      main: '#BF616A', // Nord 11
    },
    warning: {
      main: '#EBCB8B', // Nord 13
    },
    info: {
      main: '#B48EAD', // Nord 15
    },
    success: {
      main: '#A3BE8C', // Nord 14
    },
    background: {
      default: '#ECEFF4', // Nord 6
      paper: '#E5E9F0', // Nord 5
    },
    text: {
      primary: '#2E3440', // Nord 0
      secondary: '#4C566A', // Nord 3
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
});

export default nordTheme;
