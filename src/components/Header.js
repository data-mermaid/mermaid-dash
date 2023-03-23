import PropTypes from 'prop-types'
import React, { useState } from 'react'

import makeStyles from '@material-ui/core/styles/makeStyles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Box from '@material-ui/core/Box'

import { ReactComponent as MermaidLogo } from '../styles/Icons/mermaid-dashboard-logo.svg'
import { MenuLink } from '../styles/MermaidStyledComponents'
import HeaderMenu from './HeaderMenu'
import IntroModal from './IntroModal'
import headerContent from '../constants/header-content'
import { color } from '../constants/theme'

const headerStyles = makeStyles(theme => ({
  appBarProperty: {
    position: 'fixed',
    background: color.mermaidDark,
    height: 49,
    justifyContent: 'center',
  },
  toolBarProperty: {
    padding: 0,
  },
  menuIconProperty: {
    margin: 0,
  },
  hide: {
    display: 'none',
  },
  headerItemStyle: {
    padding: theme.spacing(2),
    fontSize: '12px',
    fontWeight: '800',
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
}))

const HeaderItem = ({ children, link }) => {
  const classes = headerStyles()

  return (
    <Box className={classes.headerItemStyle}>
      <MenuLink target="_blank" href={link} rel="nomodalStageOpener noreferrer">
        {children}
      </MenuLink>
    </Box>
  )
}

const HeaderItems = headerContent.map(({ name, link }) => {
  return (
    <HeaderItem key={name} link={link}>
      {name}
    </HeaderItem>
  )
})

const Header = () => {
  const classes = headerStyles()
  const introModalStage = JSON.parse(window.sessionStorage.getItem('intro')) !== false
  const [modalStageOpen, setModalStage] = useState(introModalStage)
  const [anchorEl, setAnchorEl] = useState(null)

  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const modalToggleHandler = () => {
    setModalStage(!modalStageOpen)
    window.sessionStorage.setItem('intro', !modalStageOpen)
    if (!modalStageOpen) {
      setAnchorEl(null)
    }
  }

  return (
    <AppBar className={classes.appBarProperty}>
      <Toolbar className={classes.toolBarProperty}>
        <Box p={1} flexGrow={1} marginTop="5px" marginLeft="5px">
          <MermaidLogo width="150px" />
        </Box>
        <IntroModal open={modalStageOpen} modalToggleHandler={modalToggleHandler} />
        {HeaderItems}
        <HeaderMenu
          anchorEl={anchorEl}
          handleClick={handleClick}
          handleClose={handleClose}
          modalToggleHandler={modalToggleHandler}
        />
      </Toolbar>
    </AppBar>
  )
}

HeaderItem.propTypes = {
  children: PropTypes.node.isRequired,
  link: PropTypes.string.isRequired,
}

export default Header
