import PropTypes from 'prop-types'
import React from 'react'

import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import HelpIcon from '@material-ui/icons/Help'
import MuiDialogTitle from '@material-ui/core/DialogTitle'
import MuiDialogContent from '@material-ui/core/DialogContent'
import MuiDialogActions from '@material-ui/core/DialogActions'

import { DialogHeader, DialogText, DialogTitle } from '../styles/MermaidStyledComponents'
import ModalContent from './ModalContent'
import { color } from '../constants/theme'
import MermaidDashboardTooltip from './MermaidDashboardTooltip'

const LiveCoralCoverModal = ({ open, modalToggleHandler }) => {
  const clickToViewModal = (
    <MermaidDashboardTooltip title="More Information & References" placement="right">
      <IconButton onClick={modalToggleHandler}>
        <HelpIcon style={{ color: color.mermaidDarkBlue, fontSize: '30px' }} />
      </IconButton>
    </MermaidDashboardTooltip>
  )

  return (
    <>
      {clickToViewModal}
      <ModalContent open={open} modalToggleHandler={modalToggleHandler}>
        <MuiDialogTitle>
          <DialogTitle>Live Coral Cover</DialogTitle>
        </MuiDialogTitle>
        <MuiDialogContent dividers>
          <DialogText>
            Live coral cover maintains coral reef growth through carbonate production. Studies have
            shown that a minimum of &gt;10% hard coral cover is required for net-positive carbonate
            production. A precautionary threshold to maintain biodiversity, structural complexity
            and fisheries production is ~30% live coral cover. Analyses are currently underway to
            test and validate these thresholds. The coral cover indicator (and other indicators
            supported by MERMAID) support a Recommendation from the International Coral Reef
            Initiative for the inclusion of coral reefs and measurable indicators within the CBD
            Post-2020 Global Biodiversity Framework (
            <a target="_blank" href="https://www.icriforum.org/post2020/" rel="noopener noreferrer">
              https://www.icriforum.org/post2020/
            </a>
            ) . Measuring the national status and trends of live coral cover and other key
            indicators will support conservation and management interventions to mitigate threats
            and maintain reefs above critical functioning thresholds.
          </DialogText>
          <DialogHeader>References:</DialogHeader>
          <DialogText>
            {'- '}
            <a
              target="_blank"
              href="https://c532f75abb9c1c021b8c-e46e473f8aadb72cf2a8ea564b4e6a76.ssl.cf5.rackcdn.com/2019/10/28/932fl66562_Post_2020_Coral_Target_2p_v7.pdf"
              rel="noopener noreferrer"
            >
              WCS Policy Brief on Coral Reef Indicators
            </a>
          </DialogText>
          <DialogText>
            {'- '}
            Darling et al. &quot;Social–environmental drivers inform strategic management of coral
            reefs in the Anthropocene.&quot; Nature Ecology & Evolution, 2019.
          </DialogText>
          <DialogText>
            {'- '}
            McClanahan et al. &quot;Critical thresholds and tangible targets for ecosystem-based
            management of coral reef fisheries.&quot; PNAS, 2011.
          </DialogText>
          <DialogText>
            {'- '}
            McClanahan et al. &quot;Global baselines and benchmarks for fish biomass: comparing
            remote reefs and fisheries closures.&quot; MEPS, 2019
          </DialogText>
          <DialogText>
            {'- '}
            Perry et al. &quot;Caribbean-wide decline in carbonate production threatens coral reef
            growth&quot;. Nature Communications, 2013.
          </DialogText>
          <DialogText>
            {'- '}
            Perry et al. &quot;Loss of coral reef growth capacity to track future increases in sea
            level&quot;. Nature, 2018.
          </DialogText>
        </MuiDialogContent>
        <MuiDialogActions>
          <Button onClick={modalToggleHandler} color="primary">
            Close
          </Button>
        </MuiDialogActions>
      </ModalContent>
    </>
  )
}

LiveCoralCoverModal.propTypes = {
  open: PropTypes.bool.isRequired,
  modalToggleHandler: PropTypes.func.isRequired,
}

export default LiveCoralCoverModal
