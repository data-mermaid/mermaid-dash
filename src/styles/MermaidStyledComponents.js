import styled, { css } from 'styled-components/macro';

export const ButtonStyle = styled('button')`
  color: ${props => props.theme.color};
  ${props =>
    props.buttonBorder
      ? css`
          border: 2px solid ${props => props.theme.borderColor};
          border-radius: 4px;
        `
      : css`
          border: none;
        `}
  display: flex;
  flex-direction: ${props => props.theme.flexDirection};
  justify-content: center;
  align-items: center;
  background: ${props => (props.notAllowed ? props.theme.notAllowedBgColor : props.theme.bgColor)};
  font-size: 1em;
  position: ${props => props.theme.position};
  padding: ${props => props.theme.padding};
  width: ${props => props.theme.width};
  height: ${props => props.theme.height};
  box-shadow: ${props =>
    props.boxShadow &&
    '0px 1px 3px 0px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 2px 1px -1px rgba(0,0,0,0.12)'};
  transform: ${props => props.theme.initialTranslate};
  transition: 0.2s ease-out;
  cursor: ${props => (props.notAllowed ? 'not-allowed' : 'pointer')};
  &:hover {
    transform: ${props => props.theme.hoverTranslate};
  }
  &:hover {
    transform: ${props => props.growScaleHover && 'scale(1.1)'};
  }
  &:hover {
    transform: ${props => props.setWiggle && 'scale(0.95)'};
  }
  &:focus {
    outline: none;
  }
`;

export const LinkStyle = styled('a')`
  text-decoration: none;
  color: ${props => (props.menuButton ? 'black' : 'white')};
`;
