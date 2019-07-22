import styled, { css } from 'styled-components/macro';

export const ButtonStyle = styled('button')`
  transform: translate(0%);
  transition: ${props => props.theme.transition};
  color: ${props => props.theme.fg};
  ${props =>
    props.buttonBorder &&
    css`
      border: 1px solid ${props => props.theme.fg};
    `}
  background: ${props => props.theme.bg};
  font-size: 1em;
  border-radius: 5px;
  position: ${props => props.theme.position};
  padding: ${props => props.theme.padding};
  width: ${props => props.theme.width};
  box-shadow: ${props => props.theme.shadow};
  cursor: pointer;
  &:hover {
    box-shadow: ${props =>
      props.setHover ? '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)' : null};
    transform: ${props => props.theme.transform};
    transition: ${props => props.theme.transition};
  }
`;
