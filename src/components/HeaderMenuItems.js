/* eslint-disable react/jsx-props-no-spreading */
import PropTypes from 'prop-types'
import React from 'react'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import { makeStyles, withStyles } from '@material-ui/core'
import EditIcon from '@material-ui/icons/Edit'
import HelpIcon from '@material-ui/icons/Help'
import LockIcon from '@material-ui/icons/Lock'
import MailIcon from '@material-ui/icons/Mail'
import { MenuLink } from '../styles/MermaidStyledComponents'

import headerContent from '../constants/header-content'

const headerMenuItemsProperties = makeStyles(() => ({
  menuIconProperty: {
    width: '20px',
    height: '20px',
    margin: '0 8px 2px 0',
  },
}))

const StyledMenu = withStyles({
  paper: {
    border: '1px solid #d3d4d5',
    marginLeft: '9px',
  },
})(props => (
  <Menu
    elevation={4}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'center',
    }}
    {...props}
  />
))

const StyledMenuItem = withStyles(() => ({
  root: {
    display: 'flex',
    alignItems: 'center',
  },
}))(MenuItem)

const MenuIcon = ({ name }) => {
  const { menuIconProperty } = headerMenuItemsProperties()

  let Icon

  switch (name) {
    case 'ABOUT':
      Icon = HelpIcon
      break
    case 'PRIVACY':
      Icon = LockIcon
      break
    case 'CONTACT':
      Icon = MailIcon
      break
    default:
      Icon = EditIcon
      break
  }

  return <Icon className={menuIconProperty} />
}

const HeaderMenuItems = ({ anchorEl, handleClose, modalToggleHandler }) => {
  const MenuItems = headerContent.map(({ name, link }) => {
    return (
      <MenuLink target="_blank" href={link} rel="noopener noreferrer" menuButton key={name}>
        <StyledMenuItem onClick={handleClose}>
          <MenuIcon name={name} />
          {name}
        </StyledMenuItem>
      </MenuLink>
    )
  })

  return (
    <StyledMenu
      id="simple-menu"
      anchorEl={anchorEl}
      keepMounted
      open={Boolean(anchorEl)}
      onClose={handleClose}
    >
      <StyledMenuItem onClick={modalToggleHandler}>
        <MenuIcon name="ABOUT" />
        ABOUT
      </StyledMenuItem>
      {MenuItems}
    </StyledMenu>
  )
}

MenuIcon.propTypes = {
  name: PropTypes.string.isRequired,
}

HeaderMenuItems.propTypes = {
  anchorEl: PropTypes.instanceOf(Element),
  handleClose: PropTypes.func.isRequired,
  modalToggleHandler: PropTypes.func.isRequired,
}

HeaderMenuItems.defaultProps = {
  anchorEl: null,
}

export default HeaderMenuItems
