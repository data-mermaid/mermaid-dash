import PropTypes from 'prop-types'
import React from 'react'

import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'

const capitalizeMermaidText = text => text.replace(/mermaid/i, 'MERMAID')

const CardTextContent = ({ textContent }) => {
  const { header, body } = textContent
  const formattedBodyText = capitalizeMermaidText(body)

  return (
    <Box pt={1}>
      <Typography variant="h6">{header}</Typography>
      <Typography variant="body1">{formattedBodyText}</Typography>
    </Box>
  )
}

CardTextContent.propTypes = {
  textContent: PropTypes.shape({
    header: PropTypes.string,
    body: PropTypes.string,
  }).isRequired,
}

export default CardTextContent
