import styled, { createGlobalStyle, css } from 'styled-components/macro';

export const theme1 = {
  primary: '#ff0198',
  secondary: '#01c1d6',
  danger: '#eb238e',
  light: '#f4f4f4',
  dark: '#222'
};

export const theme2 = {
  primary: '#6e27c5',
  secondary: '#ffb617',
  danger: '#f16623',
  light: '#f4f4f4',
  dark: '#222'
};

export const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css?family=Montserrat:400,900|Roboto:400,900');

  body {
    margin: 0;
    font-family: Roboto, sans-serif;

    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    padding: 0;
  }

  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, "Courier New",
      monospace;
  }

  h1 {
    font-family: Montserrat;
  }
`;

export const Button = styled('button')`
  font-size: 1rem;
  border-radius: 5px;
  padding: 0.25rem 1rem;
  margin: 0 1rem;
  background: transparent;
  color: ${props => props.theme.primary};
  border: 2px solid ${props => props.theme.primary};
  cursor: pointer;
  ${props =>
    props.primary &&
    css`
      background: ${props => props.theme.primary};
      color: white;
    `};
  &:hover {
    transform: translateY(1px);
    box-shadow: 0 2px 3px rgba(0, 0, 0, 0.15);
  }
`;
