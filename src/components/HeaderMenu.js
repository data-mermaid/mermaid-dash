import PropTypes from 'prop-types'
import React from 'react'

import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import { makeStyles } from '@material-ui/core'

import HeaderMenuItems from './HeaderMenuItems'

const menuStyleProperties = makeStyles(theme => ({
  root: {
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
}))

const HeaderMenu = ({ anchorEl, handleClick, handleClose, modalToggleHandler }) => {
  const classes = menuStyleProperties()

  return (
    <div>
      <IconButton
        color="inherit"
        aria-label="open menu"
        className={classes.root}
        onClick={handleClick}
      >
        <MenuIcon />
      </IconButton>
      <HeaderMenuItems
        anchorEl={anchorEl}
        handleClose={handleClose}
        modalToggleHandler={modalToggleHandler}
      />
    </div>
  )
}

HeaderMenu.propTypes = {
  anchorEl: PropTypes.instanceOf(Element),
  handleClick: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
  modalToggleHandler: PropTypes.func.isRequired,
}

HeaderMenu.defaultProps = {
  anchorEl: null,
}

export default HeaderMenu
