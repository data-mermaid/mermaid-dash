import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import Fade from '@material-ui/core/Fade';

const TooltipLayout = ({ title, placement, children }) => {
  return (
    <Tooltip
      title={title}
      placement={placement || 'right'}
      TransitionComponent={Fade}
      TransitionProps={{ timeout: 200 }}
    >
      {children}
    </Tooltip>
  );
};

export default TooltipLayout;
