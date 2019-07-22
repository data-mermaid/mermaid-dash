import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import PropTypes from 'prop-types';

const GreenCheckbox = withStyles({
  root: {
    color: 'white',
    '&$checked': {
      color: 'white'
    }
  },
  checked: {}
})(props => <Checkbox color="default" {...props} />);

const checkBoxProperty = makeStyles(theme => ({
  formProperty: {
    border: '1px solid white',
    borderRadius: '5px',
    paddingRight: '10px',
    marginLeft: '10px'
  }
}));

const CheckBoxFullMap = ({ toggle, showFullMap }) => {
  const classes = checkBoxProperty();

  return (
    <FormControlLabel
      className={classes.formProperty}
      control={<GreenCheckbox checked={showFullMap} onChange={toggle} value="showFullMap" />}
      label="Show Full Map"
    />
  );
};

CheckBoxFullMap.propTypes = {
  toggle: PropTypes.func,
  showFullMap: PropTypes.bool
};

export default CheckBoxFullMap;
