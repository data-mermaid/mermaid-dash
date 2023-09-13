import PropTypes from 'prop-types'
import React, { useState } from 'react'

import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import styled from 'styled-components/macro'

import { TextLoader, ChartLoader } from './Loader'
import CardChartContent from './CardChartContent'
import CartTextContent from './CardTextContent'
import LiveCoralCoverModal from './LiveCoralCoverModal'

import ProtocolChartSubHeading from './ProtocolChartSubHeading'
import {
  benthicPitPropType,
  bleachingPropType,
  fishbeltPropType,
  histogramContentPropType,
  pieChartContentPropType,
  textContentPropType,
} from '../lib/mermaidDataPropTypes'

const CardDiv = styled('div')`
  padding: ${props => (props.setPaddingOff ? '0 0 16px 0' : '16px 8px 16px 8px')};
  width: 100%;
`

const cardStyle = makeStyles(theme => ({
  root: {
    padding: theme.spacing(2, 1),
  },
  cardWrapper: {
    padding: theme.spacing(2, 1),
    borderRadius: 0,
  },
  iconProperty: {
    paddingRight: '5px',
  },
  cardTitleProperty: {
    display: 'flex',
    alignItems: 'center',
  },
}))

const InformationCard = ({
  bleachingProtocolSubItems,
  dataPolicy,
  histogramContent,
  isFiltering,
  isPrivatePolicy,
  protocolProperties,
  sampleUnit,
  title,
  type,
  pieChartContent,
  textContent,
  projectFishFamilies,
}) => {
  const classes = cardStyle()
  const loaderType = type === 'text' ? <TextLoader /> : <ChartLoader />

  const [modalStageOpen, setModalStage] = useState(false)

  const modalToggleHandler = () => setModalStage(!modalStageOpen)

  const pieChartProtocolSubHeadingItem = type === 'pieChart' && (
    <Box>
      <Typography m={1}>Data sharing: {dataPolicy}</Typography>
      <ProtocolChartSubHeading
        sampleUnit={sampleUnit}
        protocolProperties={protocolProperties}
        isPrivatePolicy={isPrivatePolicy}
        bleachingProtocolSubItems={bleachingProtocolSubItems}
        projectFishFamilies={projectFishFamilies}
      />
    </Box>
  )

  const contentItem =
    type === 'text' ? (
      <CartTextContent textContent={textContent} />
    ) : (
      <CardChartContent
        chartType={type}
        sampleUnit={sampleUnit}
        pieChartContent={pieChartContent}
        isPrivatePolicy={isPrivatePolicy}
        title={title}
        histogramContent={histogramContent}
      />
    )

  const cardContent =
    (histogramContent || pieChartContent || textContent) && !isFiltering ? (
      <Paper className={classes.cardWrapper}>
        <Box display="flex" borderBottom={1}>
          <Box flexGrow={1}>
            <Box className={classes.cardTitleProperty}>
              <Typography variant="h4">{title}</Typography>
              {type === 'histogramChart' && (
                <LiveCoralCoverModal
                  open={modalStageOpen}
                  modalToggleHandler={modalToggleHandler}
                />
              )}
            </Box>
            {pieChartProtocolSubHeadingItem}
          </Box>
        </Box>
        {contentItem}
      </Paper>
    ) : (
      <Paper className={classes.cardWrapper}>{loaderType}</Paper>
    )

  return <CardDiv setPaddingOff={type === 'pieChart'}>{cardContent}</CardDiv>
}

InformationCard.propTypes = {
  bleachingProtocolSubItems: bleachingPropType,
  dataPolicy: PropTypes.string,
  histogramContent: histogramContentPropType,
  isFiltering: PropTypes.bool,
  isPrivatePolicy: PropTypes.bool,
  pieChartContent: pieChartContentPropType,
  projectFishFamilies: PropTypes.arrayOf(PropTypes.string),
  protocolProperties: PropTypes.oneOfType([
    fishbeltPropType,
    benthicPitPropType,
    bleachingPropType,
  ]),
  sampleUnit: PropTypes.string,
  textContent: textContentPropType,
  title: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
}

InformationCard.defaultProps = {
  bleachingProtocolSubItems: {},
  histogramContent: [],
  pieChartContent: [],
  projectFishFamilies: [],
  textContent: {},
  protocolProperties: {},
  sampleUnit: '',
  dataPolicy: '',
  isFiltering: false,
  isPrivatePolicy: false,
}

export default InformationCard
