import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import styled, { css } from 'styled-components/macro';

import CircularProgress from '@material-ui/core/CircularProgress';
import Paper from '@material-ui/core/Paper';

import PropTypes from 'prop-types';

const TitleBoxStyle = styled.div`
  border-top: ${props => (props.mediaMax960 ? '1px solid' : '0')};
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 11px;
  ${props =>
    (props.mediaMax960 || props.bottomPanelOpen) &&
    css`
      height: 58px;
      font-weight: bold;
      font-size: 18px;
    `}
`;

const ContentBoxStyle = styled.div`
  color: #5080ad;
  padding: ${props =>
    props.mediaMax960 ? '30px 0px 30px 0' : props.bottomPanelOpen && '30px 0px 0px 0'};
  font-size: ${props => (props.mediaMax960 || props.bottomPanelOpen ? '55px' : '32px')};
`;

const WrapperMetricCard = styled(Paper)`
  text-align: center;
  border-radius: 4px;
`;

const cardStyle = makeStyles(theme => ({
  mobileProgress: {
    margin: '7px'
  },
  progress: {
    margin: '39px'
  }
}));

const MetricCard = ({ content: { title, count }, isLoading, bottomPanelOpen }) => {
  const classes = cardStyle();
  const mediaMax960 = useMediaQuery('(min-width:960px');

  const countContent = title === 'Avg Coral Coverage' ? `${count}%` : count;

  const contentItem =
    count !== null && count >= 0 && !isLoading ? (
      <ContentBoxStyle mediaMax960={mediaMax960} bottomPanelOpen={bottomPanelOpen}>
        {countContent}
      </ContentBoxStyle>
    ) : (
      <CircularProgress
        size={mediaMax960 ? 60 : 31}
        className={mediaMax960 ? classes.progress : classes.mobileProgress}
      />
    );

  const titleItem = title && (
    <TitleBoxStyle mediaMax960={mediaMax960} bottomPanelOpen={bottomPanelOpen}>
      {title}
    </TitleBoxStyle>
  );

  return (
    <WrapperMetricCard>
      {contentItem}
      {titleItem}
    </WrapperMetricCard>
  );
};

MetricCard.propTypes = {
  title: PropTypes.string,
  count: PropTypes.number,
  isLoading: PropTypes.bool,
  bottomPanelOpen: PropTypes.bool
};

export default MetricCard;
