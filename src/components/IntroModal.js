import PropTypes from 'prop-types'
import React from 'react'

import styled from 'styled-components/macro'

import Button from '@material-ui/core/Button'
import MuiDialogTitle from '@material-ui/core/DialogTitle'
import MuiDialogContent from '@material-ui/core/DialogContent'
import MuiDialogActions from '@material-ui/core/DialogActions'
import ContactIcon from '@material-ui/icons/Email'

import Box from '@material-ui/core/Box'

import { DialogText, DialogTitle } from '../styles/MermaidStyledComponents'
import ModalContent from './ModalContent'
import { color } from '../constants/theme'

const InlineButtonImage = styled('span')`
  color: white;
  display: inline-flex;
  background: ${color.mermaidDarkBlue};
  align-items: center;
  justify-content: center;
  padding: 2px 6px 4px 6px;
`

const InlineButtonIcon = styled(ContactIcon)`
  font-size: 0.8rem !important;
  margin-right: 4px;
`

const InlineButtonText = styled('span')`
  font-size: 12px;
  margin-top: 2px;
`

const MenuBoxItem = styled(Box)`
  padding: 16px;
  font-size: 12px;
  font-weight: 800;
  cursor: pointer;
  @media (max-width: 960px) {
    display: none;
  }
`

const IntroModal = ({ open, modalToggleHandler }) => {
  const clickToViewModal = <MenuBoxItem onClick={modalToggleHandler}>ABOUT</MenuBoxItem>

  const contactButton = (
    <InlineButtonImage>
      <InlineButtonIcon />
      <InlineButtonText>Contact Admins</InlineButtonText>
    </InlineButtonImage>
  )

  return (
    <>
      {clickToViewModal}
      <ModalContent open={open} modalToggleHandler={modalToggleHandler}>
        <MuiDialogTitle>
          <DialogTitle>About</DialogTitle>
        </MuiDialogTitle>
        <MuiDialogContent dividers>
          <DialogText>
            Welcome to the MERMAID dashboard. This information represents the time, resources and
            expertise of hundreds of coral reef scientists around the world.
          </DialogText>
          <DialogText>
            1. If you would like to publish any analyses based on these data, please contact the
            appropriate project administrators using the {contactButton} available for each site
          </DialogText>
          <DialogText>
            2. Do not assume data are representative. Some projects have survey sites in geographies
            to address specific questions (e.g., land-based impacts of reefs, recovery rates from
            cyclone impacts). Summary data may not reflect overall national statistics.
          </DialogText>
          <DialogText>Click anywhere to agree to these terms and continue.</DialogText>
        </MuiDialogContent>
        <MuiDialogActions>
          <Button onClick={modalToggleHandler} color="primary">
            Get Started
          </Button>
        </MuiDialogActions>
      </ModalContent>
    </>
  )
}

IntroModal.propTypes = {
  open: PropTypes.bool.isRequired,
  modalToggleHandler: PropTypes.func.isRequired,
}

export default IntroModal
