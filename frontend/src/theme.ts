import { createTheme } from '@mui/material/styles';
import { grey, blue } from '@mui/material/colors';

const theme = createTheme({
    palette: {
        mode: 'light',
        background: {
            default: grey[100],
            paper: grey[50],
        },
        text: {
            primary: 'rgba(0, 0, 0, 0.87)',
            secondary: grey[600],
        },
        primary: {
            main: blue[500],
        },
        secondary: {
            main: blue[600],
        },
    },
    typography: {
        fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
        h1: {
            fontSize: '3.2em',
            lineHeight: 1.1,
        },
        button: {
            borderRadius: '8px',
            fontSize: '1em',
            fontWeight: 500,
            backgroundColor: grey[200],
            '&:hover': {
                borderColor: blue[500],
            },
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '8px',
                    border: '1px solid transparent',
                    padding: '0.6em 1.2em',
                    fontSize: '1em',
                    fontWeight: 500,
                    backgroundColor: grey[200],
                    cursor: 'pointer',
                    transition: 'border-color 0.25s',
                    '&:hover': {
                        borderColor: blue[500],
                    },
                    '&:focus': {
                        outline: '4px auto -webkit-focus-ring-color',
                    },
                },
            },
        },
    },
});

export default theme;
