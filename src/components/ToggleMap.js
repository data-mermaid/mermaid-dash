import React from 'react';
import { ThemeProvider } from 'styled-components/macro';
import { ButtonStyle } from './Button';

const theme = {
  fg: '#1B1C1D',
  bg: 'white'
};

const invertTheme = ({ fg, bg }) => ({
  fg: bg,
  bg: fg
});

const toggleMap = props => (
  <ThemeProvider theme={theme}>
    <ThemeProvider theme={invertTheme}>
      <ButtonStyle onClick={props.toggle} n>
        Show Full Map{' '}
      </ButtonStyle>
    </ThemeProvider>
  </ThemeProvider>
);

export default toggleMap;
