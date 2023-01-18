import styled from 'styled-components/macro'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import { theme } from '../constants/theme'

export const ButtonStyle = styled('button')`
  color: ${props => (props.disabled ? props.theme.disabledColor : props.theme.color)};
  border: 0;
  display: flex;
  flex-direction: ${props => props.theme.flexDirection};
  justify-content: center;
  align-items: center;
  background: ${props => (props.disabled ? props.theme.disabledBgColor : props.theme.bgColor)};
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
  cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
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
`

export const MenuLink = styled('a')`
  text-decoration: none;
  color: ${props => (props.menuButton ? 'black' : 'white')};
`

export const DialogTitle = styled('p')`
  font-size: 1.5rem;
  font-weight: 800;
  margin: 0;
`

export const DialogHeader = styled('p')`
  font-size: 1.1rem;
  text-decoration: underline;
  font-weight: 800;
  margin: 0;
`

export const DialogText = styled('p')`
  font-size: 0.85rem;
`

export const MermaidButton = withStyles({
  root: {
    margin: '4px',
    color: theme.cardButton.color.mermaidWhite,
    backgroundColor: theme.cardButton.bgColor,
    '&:hover': {
      backgroundColor: theme.cardButton.bgColor,
    },
  },
})(Button)
