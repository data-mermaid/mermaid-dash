import React from 'react';

import numberWithCommas from '../lib/number-format';

import { makeStyles } from '@material-ui/core/styles';
import styled, { css } from 'styled-components/macro';

import CircularProgress from '@material-ui/core/CircularProgress';
import Paper from '@material-ui/core/Paper';

import PropTypes from 'prop-types';

const TitleBoxStyle = styled.div`
  border-top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 10px;
  ${props =>
    props.bottomPanelOpen &&
    css`
      height: 55px;
      font-weight: bold;
      font-size: 14px;
    `}

  @media (min-width: 960px) {
    border-top: 1px solid;
    height: 55px;
    font-weight: bold;
    font-size: 18px;
  }
`;

const ContentBoxStyle = styled.div`
  color: #004c76;
  padding: ${props => props.bottomPanelOpen && '30px 0px 0px 0'};
  font-size: ${props => (props.bottomPanelOpen ? '35px' : '32px')};
  @media (min-width: 960px) {
    padding: 30px 0px 30px 0;
    font-size: 50px;
  }
`;

const WrapperMetricCard = styled(Paper)`
  text-align: center;
  border-radius: 4px;
`;

const cardStyle = makeStyles(theme => ({
  progress: {
    margin: '34px',
    width: '58px !important',
    height: '58px !important',
    [theme.breakpoints.down('sm')]: {
      margin: '6px',
      width: '28px !important',
      height: '28px !important'
    }
  }
}));

const MetricCard = ({ content: { title, count }, isLoading, bottomPanelOpen }) => {
  const classes = cardStyle();

  const countContent = title === 'Avg Coral Coverage' ? `${count}%` : numberWithCommas(count);

  let contentItem =
    count !== null && count >= 0 && !isLoading ? (
      <ContentBoxStyle bottomPanelOpen={bottomPanelOpen}>{countContent}</ContentBoxStyle>
    ) : (
      <CircularProgress className={classes.progress} />
    );

  const titleItem = title && (
    <TitleBoxStyle bottomPanelOpen={bottomPanelOpen}>{title}</TitleBoxStyle>
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
