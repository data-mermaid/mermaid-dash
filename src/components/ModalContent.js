import PropTypes from 'prop-types'
import React from 'react'

import Dialog from '@material-ui/core/Dialog'

const ModalContent = ({ open, modalToggleHandler, children }) => {
  return (
    <Dialog
      onClose={modalToggleHandler}
      open={open}
      scroll="paper"
      PaperProps={{ style: { margin: '8px', minWidth: '300px' } }}
    >
      {children}
    </Dialog>
  )
}

ModalContent.propTypes = {
  open: PropTypes.bool.isRequired,
  modalToggleHandler: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
}

export default ModalContent
