import { createMuiTheme, Theme } from '@material-ui/core/styles';

export const theme: Theme = createMuiTheme({
  palette: {
    primary: {
      main: '#1076ad',
      contrastText: '#fff',
    },
    secondary: {
      main: '#fff',
    },
  },

  overrides: {
    MuiDrawer: {
      paper: {
        backgroundColor: '#1076ad',
      },
    },
  },
});
