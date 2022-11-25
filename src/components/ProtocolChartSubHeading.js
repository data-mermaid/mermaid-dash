import { Typography } from '@material-ui/core';
import React, { useState } from 'react';
import FishFamilyModal from './FishFamilyModal';

const ProtocolChartSubHeading = ({
  protocolName,
  protocolProperties,
  isPrivatePolicy,
  bleachingProtocolSubItems,
  projectFishFamilies
}) => {
  const [fishFamilyModalStageOpen, setFishFamilyModalStageOpen] = useState(false);

  const fishFamilyModalToggleHandler = () => setFishFamilyModalStageOpen(!fishFamilyModalStageOpen);

  if (isPrivatePolicy || !protocolName) {
    return <></>;
  }

  if (protocolName === 'beltfish') {
    return (
      <>
        <Typography m={1}>Sample units: {protocolProperties.sample_unit_count} </Typography>
        <Typography m={1}>
          Reef fish biomass: {protocolProperties.biomass_kgha_avg} kg/ha
        </Typography>
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
    );
  }

  if (
    protocolName === 'benthiclit' ||
    protocolName === 'benthicpit' ||
    protocolName === 'benthicpqt'
  ) {
    return (
      <>
        <Typography m={1}>Sample units: {protocolProperties.sample_unit_count} </Typography>
        <Typography m={1}>
          Hard coral cover: {protocolProperties.percent_cover_by_benthic_category_avg['Hard coral']}
          %
        </Typography>
      </>
    );
  }

  if (protocolName === 'bleachingqc') {
    return (
      <>
        <Typography m={1}>
          Bleached colonies: {bleachingProtocolSubItems.percent_bleached_avg.toFixed(1)}%
        </Typography>
        <Typography m={1}>
          Hard coral genera: {bleachingProtocolSubItems.count_genera_avg}
        </Typography>
        <Typography m={1}>
          Observed coral colonies: {bleachingProtocolSubItems.count_total_avg}
        </Typography>
      </>
    );
  }
};

export default ProtocolChartSubHeading;
