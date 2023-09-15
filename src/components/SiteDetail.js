import PropTypes from 'prop-types'
import React, { useState, useEffect, useMemo } from 'react'
import styled from 'styled-components/macro'
import useMediaQuery from '@material-ui/core/useMediaQuery'

import AdminIcon from '@material-ui/icons/Person'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import SiteDetailSubItems from './SiteDetailSubItems'
import CoralAttributes from './CoralAttributes'
import SiteNote from './SiteNote'
import InformationCard from './InformationCard'
import { TextLoader } from './Loader'
import { defaultPieChartContent } from '../constants/sample-data'
import {
  BENTHIC_LIT_SAMPLE_UNIT,
  BENTHIC_PHOTO_QUADRAT_SAMPLE_UNIT,
  BENTHIC_PIT_SAMPLE_UNIT,
  BLEACHING_PROPERTY_COLONIES_BLEACHED,
  BLEACHING_PROPERTY_QUADRAT_BENTHIC_PERCENT,
  BLEACHING_SAMPLE_UNIT,
  FISHBELT_SAMPLE_UNIT,
  HABITAT_COMPLEXITY_SAMPLE_UNIT,
  chartContentProperties,
  chartTitles,
} from '../constants/sample-unit-information'
import getChartContent from '../lib/chart-helpers'
import { ReactComponent as OrganizationIcon } from '../styles/Icons/earth.svg'
import { sitesPropType } from '../lib/mermaidDataPropTypes'

const SiteSummaryWrapper = styled('div')`
  padding: ${props => (props.mediaMax960 ? '0 8px 0px 8px' : '16px 8px 50px 8px')};
  width: 100%;
`

const SiteInfoWrapper = styled(Paper)`
  padding: 16px 16px;
  margin-bottom: 16px;
  border-radius: 0;
`

const SiteDetail = ({ selectSite, projectFishFamilies, sites }) => {
  const mediaMax960 = useMediaQuery('(max-width:960px')
  const [currentSelectedSite, setCurrentSelectedSite] = useState(selectSite[0])

  useEffect(
    function updateCurrentSelectedSiteInGroup() {
      setCurrentSelectedSite(selectSite[0])
    },
    [selectSite],
  )

  const filteredSampleUnitsForSiteChartCards = useMemo(() => {
    const sortBy = [
      BENTHIC_PIT_SAMPLE_UNIT,
      BENTHIC_LIT_SAMPLE_UNIT,
      BENTHIC_PHOTO_QUADRAT_SAMPLE_UNIT,
      BLEACHING_PROPERTY_QUADRAT_BENTHIC_PERCENT,
      FISHBELT_SAMPLE_UNIT,
    ]
    const ignoredSampleUnitTypes = [
      BLEACHING_PROPERTY_COLONIES_BLEACHED,
      HABITAT_COMPLEXITY_SAMPLE_UNIT,
    ]

    const sortedSampleUnits = Object.entries(currentSelectedSite?.protocols).sort(
      (a, b) => sortBy.indexOf(a[0]) - sortBy.indexOf(b[0]),
    )

    return sortedSampleUnits.filter(sampleUnit => !ignoredSampleUnitTypes.includes(sampleUnit[0]))
  }, [currentSelectedSite.protocols])

  const bleachingSampleUnitSubItems = useMemo(
    () => currentSelectedSite.protocols[BLEACHING_PROPERTY_COLONIES_BLEACHED],
    [currentSelectedSite],
  )

  const handleCurrentSelectedSiteChange = event => {
    const filterSampleEventSite = selectSite.filter(
      site => site.sample_event_id === event.target.value,
    )[0]

    setCurrentSelectedSite(filterSampleEventSite)
  }

  const siteAdmins = currentSelectedSite?.project_admins && (
    <Box borderTop={1} pt={1} display="flex">
      <AdminIcon width="20px" height="20px" />
      <Typography variant="body1">
        Admins:{' '}
        {currentSelectedSite.project_admins
          .map(admin => {
            return admin.name
          })
          .join(', ')}
      </Typography>
    </Box>
  )

  const siteOrganizations = currentSelectedSite?.tags && (
    <Box pt={1} display="flex">
      <OrganizationIcon width="23px" />
      <Typography variant="body1">
        Organizations:{' '}
        {currentSelectedSite.tags
          .map(organization => {
            return organization.name
          })
          .join(', ')}
      </Typography>
    </Box>
  )

  const siteChartCards = filteredSampleUnitsForSiteChartCards.map(
    ([sampleUnitType, sampleUnitProperties]) => {
      const isBleachingSampleUnit = sampleUnitType === BLEACHING_PROPERTY_QUADRAT_BENTHIC_PERCENT
      const sampleUnit = isBleachingSampleUnit ? BLEACHING_SAMPLE_UNIT : sampleUnitType
      const dataPolicy = currentSelectedSite[`data_policy_${sampleUnit}`]
      const isPrivatePolicy = dataPolicy === 'private'
      const chartTitle = chartTitles[sampleUnitType]
      const chartInfoProperty = chartContentProperties[sampleUnitType]
      const chartInfo = isBleachingSampleUnit
        ? bleachingSampleUnitSubItems
        : sampleUnitProperties[chartInfoProperty]

      const sourceContent = isPrivatePolicy
        ? defaultPieChartContent
        : getChartContent(chartInfo, isBleachingSampleUnit)

      return (
        <div key={sampleUnitType}>
          <InformationCard
            bleachingSampleUnitSubItems={bleachingSampleUnitSubItems}
            dataPolicy={dataPolicy}
            isPrivatePolicy={isPrivatePolicy}
            pieChartContent={sourceContent}
            projectFishFamilies={projectFishFamilies}
            sampleUnitProperties={sampleUnitProperties}
            sampleUnit={sampleUnit}
            title={chartTitle}
            type="pieChart"
          />
        </div>
      )
    },
  )

  const siteInfoCard = currentSelectedSite ? (
    <SiteInfoWrapper>
      <SiteDetailSubItems
        currentSelectedSite={currentSelectedSite}
        markerSelectSites={selectSite}
        handleCurrentSelectedSiteChange={handleCurrentSelectedSiteChange}
        sites={sites}
      />
      {siteAdmins}
      {siteOrganizations}
      <CoralAttributes currentSelectedSite={currentSelectedSite} />
      <SiteNote loadedSiteProperties={selectSite} currentSelectedSite={currentSelectedSite} />
    </SiteInfoWrapper>
  ) : (
    <SiteInfoWrapper>
      <TextLoader />
    </SiteInfoWrapper>
  )

  return (
    <SiteSummaryWrapper mediaMax960={mediaMax960}>
      {siteInfoCard}
      {siteChartCards}
    </SiteSummaryWrapper>
  )
}

SiteDetail.propTypes = {
  projectFishFamilies: PropTypes.arrayOf(PropTypes.string),
  selectSite: PropTypes.arrayOf(
    PropTypes.shape({
      site_id: PropTypes.string.isRequired,
    }),
  ).isRequired,
  sites: sitesPropType.isRequired,
}

SiteDetail.defaultProps = {
  projectFishFamilies: [],
}

export default SiteDetail
