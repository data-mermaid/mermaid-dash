import React from 'react'

import useMediaQuery from '@material-ui/core/useMediaQuery'
import { makeStyles } from '@material-ui/core/styles'

import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import { ReactComponent as Coral } from '../styles/Icons/coral.svg'
import { siteDetailPropType } from '../lib/mermaidDataPropTypes'

const coralStyleProperties = makeStyles(theme => ({
  reefProperty: {
    padding: '8px 8px 8px 0',
  },
  coralIconProperty: {
    width: '20px',
    height: '20px',
    marginTop: '3px',
  },
  attributeWrapperProperty: {
    display: 'flex',
    justifyContent: 'center',
    width: '33%',
    margin: '0 8px 0 0',
    border: '1px solid',
    padding: '8px',
    borderRadius: '20px',
    [theme.breakpoints.down('sm')]: {
      margin: '8px 0 0 0',
      width: '100%',
    },
  },
}))

const CoralAttributes = ({ currentSelectedSite }) => {
  const classes = coralStyleProperties()
  const { reef_zone, reef_type, reef_exposure } = currentSelectedSite
  const mediaMax959 = useMediaQuery('(max-width:959px)')
  const spaceContent = mediaMax959 && ': '

  return (
    <Box
      display="flex"
      flexDirection={mediaMax959 ? 'column' : 'row'}
      justifyContent="flex-start"
      className={classes.reefProperty}
    >
      <Box className={classes.attributeWrapperProperty}>
        <Coral className={classes.coralIconProperty} />
        <Box display="flex" flexDirection={mediaMax959 ? 'row' : 'column'}>
          <Typography variant="body1">Reef Zone</Typography>
          <Typography variant="body1">
            <strong>
              {spaceContent}
              {reef_zone}
            </strong>
          </Typography>
        </Box>
      </Box>
      <Box className={classes.attributeWrapperProperty}>
        <Coral className={classes.coralIconProperty} />
        <Box display="flex" alignItems="left" flexDirection={mediaMax959 ? 'row' : 'column'}>
          <Typography variant="body1">Reef Type</Typography>
          <Typography variant="body1">
            <strong>
              {spaceContent}
              {reef_type}
            </strong>
          </Typography>
        </Box>
      </Box>
      <Box className={classes.attributeWrapperProperty}>
        <Coral className={classes.coralIconProperty} />
        <Box display="flex" alignItems="left" flexDirection={mediaMax959 ? 'row' : 'column'}>
          <Typography variant="body1">Reef Exposure</Typography>
          <Typography variant="body1">
            <strong>
              {spaceContent}
              {reef_exposure}
            </strong>
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}

CoralAttributes.propTypes = {
  currentSelectedSite: siteDetailPropType.isRequired,
}
export default CoralAttributes
