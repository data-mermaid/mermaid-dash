import React, { Component } from 'react';

import summary from '../apis/summary';

import AdminIcon from '@material-ui/icons/Person';

import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';

import { TextLoader } from './Loader';

import SiteDetailSubItems from './SiteDetailSubItems';
import CoralAttributes from './CoralAttributes';
import SiteNote from './SiteNote';

import PropTypes from 'prop-types';

const containerStyle = theme => ({
  root: {
    paddingBottom: theme.spacing(2)
  },
  siteWrapper: {
    padding: theme.spacing(2, 2),
    borderRadius: 0
  },
  reefProperty: {
    padding: '8px 8px 8px 0'
  }
});

class SiteDetail extends Component {
  state = {
    loadedSite: null
  };

  componentDidMount() {
    this.loadSiteData();
  }

  componentDidUpdate() {
    this.loadSiteData();
  }

  async loadSiteData() {
    const { selectSite } = this.props;
    const { loadedSite } = this.state;

    if (selectSite) {
      if (!loadedSite || (loadedSite && loadedSite.id !== selectSite.id)) {
        const { data: loadedSite } = await summary.get('/sites/' + selectSite.id);
        this.setState({ loadedSite });
      }
    }
  }

  render() {
    const { classes } = this.props;
    const { loadedSite } = this.state;

    const siteAdmins = loadedSite && (
      <Box borderTop={1} pt={1} display="flex">
        <AdminIcon />
        <Typography variant="body1">
          Admins:{' '}
          {loadedSite.properties.project_admins
            .map(admin => {
              return admin.name;
            })
            .join(', ')}
        </Typography>
      </Box>
    );

    const site = loadedSite ? (
      <Paper className={classes.siteWrapper}>
        <SiteDetailSubItems loadedSiteProperties={loadedSite.properties} />
        {siteAdmins}
        <CoralAttributes loadedSiteProperties={loadedSite.properties} />
        <SiteNote loadedSiteProperties={loadedSite.properties} />
      </Paper>
    ) : (
      <Paper className={classes.siteWrapper}>
        <TextLoader />
      </Paper>
    );

    return <div className={classes.root}>{site}</div>;
  }
}

SiteDetail.propTypes = {
  selectSite: PropTypes.shape({
    id: PropTypes.string.isRequired
  }),
  classes: PropTypes.object
};

export default withStyles(containerStyle)(SiteDetail);
