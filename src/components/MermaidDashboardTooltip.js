import PropTypes from 'prop-types'
import React from 'react'
import Tooltip from '@material-ui/core/Tooltip'
import Fade from '@material-ui/core/Fade'

const MermaidDashboardTooltip = ({ title, placement, children }) => {
  return (
    <Tooltip
      title={title}
      placement={placement}
      TransitionComponent={Fade}
      TransitionProps={{ timeout: 200 }}
    >
      {children}
    </Tooltip>
  )
}

MermaidDashboardTooltip.propTypes = {
  title: PropTypes.string.isRequired,
  placement: PropTypes.string,
  children: PropTypes.node.isRequired,
}

MermaidDashboardTooltip.defaultProps = {
  placement: 'right',
}

export default MermaidDashboardTooltip
