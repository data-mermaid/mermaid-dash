import React from 'react';

import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { makeStyles } from '@material-ui/core';

import HeaderMenuItems from './HeaderMenuItems';

const menuStyleProperties = makeStyles(theme => ({
  root: {
    [theme.breakpoints.up('md')]: {
      display: 'none'
    }
  }
}));

const HeaderMenu = () => {
  const classes = menuStyleProperties();

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

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
      <HeaderMenuItems anchorEl={anchorEl} handleClose={handleClose} />
    </div>
  );
};

export default HeaderMenu;
