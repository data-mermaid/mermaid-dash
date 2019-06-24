import styled from 'styled-components/macro';

export const ButtonStyle = styled.button`
  color: ${props => props.theme.fg};
  border: 2px solid ${props => props.theme.fg};
  background: ${props => props.theme.bg};
  font-size: 1em;
  border-radius: 3px;
`;
