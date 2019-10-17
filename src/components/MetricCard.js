import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import CircularProgress from '@material-ui/core/CircularProgress';
import Paper from '@material-ui/core/Paper';

import PropTypes from 'prop-types';
import styled, { css } from 'styled-components/macro';

const TitleBoxStyle = styled.div`
  border-top: ${props => (props.mediaMax960 ? '1px solid' : '0')};
  display: flex;
  justify-content: center;
  align-items: center;
  ${props =>
    props.mediaMax960 &&
    css`
      height: 58px;
    `}
  ${props =>
    !props.mediaMax960 &&
    css`
      font-weight: bold;
    `};
  font-size: ${props => (props.mediaMax960 ? '20px' : '11px')};
`;

const ContentBoxStyle = styled.div`
  color: #5080ad;
  padding: ${props => (props.mediaMax960 ? '30px 0px 30px 0' : '0')};
  font-size: ${props => (props.mediaMax960 ? '55px' : '32px')};
`;

const cardStyle = makeStyles(theme => ({
  root: {
    textAlign: 'center',
    borderRadius: 4
  },
  mobileProgress: {
    margin: '7px'
  },
  progress: {
    margin: '39px'
  }
}));

const MetricCard = ({ content: { title, count }, isLoading }) => {
  const classes = cardStyle();
  const mediaMax960 = useMediaQuery('(min-width:960px');
  const mediaMin1842 = useMediaQuery('(min-width:1840px)');

  const countContent = title === 'Avg Coral Coverage' ? `${count}%` : count;

  const contentItem =
    count !== null && count >= 0 && !isLoading ? (
      <ContentBoxStyle mediaMax960={mediaMax960}>{countContent}</ContentBoxStyle>
    ) : (
      <CircularProgress
        size={mediaMax960 ? 60 : 31}
        className={mediaMax960 ? classes.progress : classes.mobileProgress}
      />
    );

  const titleItem = title && (
    <TitleBoxStyle mediaMin1842={mediaMin1842} mediaMax960={mediaMax960}>
      {title}
    </TitleBoxStyle>
  );

  return (
    <Paper className={classes.root}>
      {contentItem}
      {titleItem}
    </Paper>
  );
};

MetricCard.propTypes = {
  title: PropTypes.string,
  count: PropTypes.number
};

export default MetricCard;
