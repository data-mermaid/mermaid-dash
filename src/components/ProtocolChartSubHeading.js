import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { Typography } from '@material-ui/core'
import FishFamilyModal from './FishFamilyModal'
import {
  benthicPitPropType,
  bleachingPropType,
  fishbeltPropType,
} from '../lib/mermaidDataPropTypes'
import {
  BENTHIC_LIT_SAMPLE_UNIT,
  BENTHIC_PHOTO_QUADRAT_SAMPLE_UNIT,
  BENTHIC_PIT_SAMPLE_UNIT,
  BLEACHING_SAMPLE_UNIT,
  FISHBELT_SAMPLE_UNIT,
} from '../constants/transect-protocols'

const SubHeadingText = ({ propertyName, propertyInfo, unit }) => {
  return propertyInfo ? (
    <Typography m={1}>
      {propertyName}: {propertyInfo}
      {unit}
    </Typography>
  ) : null
}

const ProtocolChartSubHeading = ({
  sampleUnit,
  protocolProperties,
  isPrivatePolicy,
  bleachingProtocolSubItems,
  projectFishFamilies,
}) => {
  const [fishFamilyModalStageOpen, setFishFamilyModalStageOpen] = useState(false)

  const fishFamilyModalToggleHandler = () => setFishFamilyModalStageOpen(!fishFamilyModalStageOpen)

  if (isPrivatePolicy || !sampleUnit) {
    return <></>
  }

  if (sampleUnit === FISHBELT_SAMPLE_UNIT) {
    const { sample_unit_count, biomass_kgha_avg } = protocolProperties

    return (
      <>
        <SubHeadingText propertyName="Sample units" propertyInfo={sample_unit_count} />
        <SubHeadingText
          propertyName="Reef fish biomass"
          propertyInfo={biomass_kgha_avg}
          unit="kg/ha"
        />
        {projectFishFamilies.length > 0 && (
          <>
            <Typography m={1} display="inline">
              Restricted set of fish families surveyed{' '}
            </Typography>
            <FishFamilyModal
              open={fishFamilyModalStageOpen}
              modalToggleHandler={fishFamilyModalToggleHandler}
              projectFishFamilies={projectFishFamilies}
            />
          </>
        )}
      </>
    )
  }

  if (
    sampleUnit === BENTHIC_LIT_SAMPLE_UNIT ||
    sampleUnit === BENTHIC_PIT_SAMPLE_UNIT ||
    sampleUnit === BENTHIC_PHOTO_QUADRAT_SAMPLE_UNIT
  ) {
    const { sample_unit_count, percent_cover_by_benthic_category_avg } = protocolProperties

    return (
      <>
        <SubHeadingText propertyName="Sample units" propertyInfo={sample_unit_count} />
        <SubHeadingText
          propertyName="Hard coral cover"
          propertyInfo={percent_cover_by_benthic_category_avg['Hard coral']}
          unit="%"
        />
      </>
    )
  }

  if (sampleUnit === BLEACHING_SAMPLE_UNIT) {
    const { count_total_avg, count_genera_avg } = bleachingProtocolSubItems
    const { percent_hard_avg_avg, percent_soft_avg_avg, percent_algae_avg_avg } = protocolProperties

    return (
      <>
        <SubHeadingText propertyName="Observed coral colonies" propertyInfo={count_total_avg} />
        <SubHeadingText propertyName="Hard coral genera" propertyInfo={count_genera_avg} />
        <SubHeadingText
          propertyName="Avg hard coral cover"
          propertyInfo={percent_hard_avg_avg}
          unit="%"
        />
        <SubHeadingText
          propertyName="Avg soft coral cover"
          propertyInfo={percent_soft_avg_avg}
          unit="%"
        />
        <SubHeadingText
          propertyName="Avg macroalgae cover"
          propertyInfo={percent_algae_avg_avg}
          unit="%"
        />
      </>
    )
  }

  return <></>
}

SubHeadingText.propTypes = {
  propertyName: PropTypes.string.isRequired,
  propertyInfo: PropTypes.string.isRequired,
  unit: PropTypes.string,
}

SubHeadingText.defaultProps = {
  unit: '',
}

ProtocolChartSubHeading.propTypes = {
  sampleUnit: PropTypes.string.isRequired,
  protocolProperties: PropTypes.oneOfType([
    fishbeltPropType,
    benthicPitPropType,
    bleachingPropType,
  ]),
  isPrivatePolicy: PropTypes.bool,
  bleachingProtocolSubItems: bleachingPropType,
  projectFishFamilies: PropTypes.arrayOf(PropTypes.string),
}

ProtocolChartSubHeading.defaultProps = {
  bleachingProtocolSubItems: {},
  protocolProperties: {},
  isPrivatePolicy: false,
  projectFishFamilies: [],
}

export default ProtocolChartSubHeading
