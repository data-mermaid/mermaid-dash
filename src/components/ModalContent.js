import React from 'react';

import Dialog from '@material-ui/core/Dialog';

const ModalContent = ({ open, modalToggleHandler, children }) => {
  return (
    <Dialog
      onClose={modalToggleHandler}
      open={open}
      scroll={'paper'}
      PaperProps={{ style: { margin: '8px', minWidth: '300px' } }}
    >
      {children}
    </Dialog>
  );
};

export default ModalContent;
