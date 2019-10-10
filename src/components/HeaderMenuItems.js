import React from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles, withStyles } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import HelpIcon from '@material-ui/icons/Help';
import LockIcon from '@material-ui/icons/Lock';
import MailIcon from '@material-ui/icons/Mail';
import { LinkStyle } from '../styles/MermaidStyledComponents';

import { mermaidHeader } from '../constants/header';

const HeaderMenuItemsProperties = makeStyles(theme => ({
  menuIconProperty: {
    width: '20px',
    height: '20px',
    margin: '0 8px 2px 0'
  }
}));

const StyledMenu = withStyles({
  paper: {
    border: '1px solid #d3d4d5'
  }
})(props => (
  <Menu
    elevation={5}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'center'
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'center'
    }}
    {...props}
  />
));

const StyledMenuItem = withStyles(theme => ({
  root: {
    display: 'flex',
    alignItems: 'center'
  }
}))(MenuItem);

const HeaderMenuItems = ({ anchorEl, handleClose }) => {
  const classes = HeaderMenuItemsProperties();
  const iconFilter = name => {
    if (name === 'ABOUT THIS DATA') {
      return <HelpIcon className={classes.menuIconProperty} />;
    } else if (name === 'PRIVACY') {
      return <LockIcon className={classes.menuIconProperty} />;
    } else if (name === 'CONTACT') {
      return <MailIcon className={classes.menuIconProperty} />;
    }
    return <EditIcon className={classes.menuIconProperty} />;
  };

  const MenuItems = mermaidHeader.map(({ name, link }) => {
    const icon = iconFilter(name);
    return (
      <LinkStyle target="_blank" href={link} rel="noopener noreferrer" menuButton={true} key={name}>
        <StyledMenuItem onClick={handleClose}>
          {icon}
          {name}
        </StyledMenuItem>
      </LinkStyle>
    );
  });

  return (
    <StyledMenu
      id="simple-menu"
      anchorEl={anchorEl}
      keepMounted
      open={Boolean(anchorEl)}
      onClose={handleClose}
    >
      {MenuItems}
    </StyledMenu>
  );
};

export default HeaderMenuItems;
