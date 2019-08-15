import React, { Component } from 'react';

import summary from '../apis/summary';

import ContactIcon from '@material-ui/icons/Email';
import AdminIcon from '@material-ui/icons/Person';

import { ThemeProvider } from 'styled-components/macro';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';

import { TextLoader } from './Loader';
import { ButtonStyle } from './Button';
import { theme } from './theme';
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
  },
  iconProperty: {
    paddingRight: '5px'
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

    const contactButton = (
      <ThemeProvider theme={theme.cardButton}>
        <ButtonStyle setHover={true} boxShadow={true}>
          <Box p={1} display="flex" justifyContent="center">
            <ContactIcon fontSize="small" className={classes.iconProperty} />
            <Typography variant="body1" display="inline">
              Contact Admins
            </Typography>
          </Box>
        </ButtonStyle>
      </ThemeProvider>
    );

    const site = this.state.loadedSite ? (
      <Paper className={classes.siteWrapper}>
        <Box display="flex">
          <Box flexGrow={1}>
            <Box>
              <Typography variant="h4">{this.state.loadedSite.properties.site_name}</Typography>
            </Box>
            <Box>
              <Typography variant="body1">
                {this.state.loadedSite.properties.country_name}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body1">
                {this.state.loadedSite.properties.management_regimes
                  ? this.state.loadedSite.properties.management_regimes
                      .map(mr => {
                        return mr.name;
                      })
                      .join(', ')
                  : 'No managements'}
              </Typography>
            </Box>
          </Box>
          <Box>{contactButton}</Box>
        </Box>
        <Box borderTop={1} pt={1} display="flex">
          <AdminIcon />
          <Typography variant="body1">
            Admins:{' '}
            {this.state.loadedSite.properties.project_admins
              .map(admin => {
                return admin.name;
              })
              .join(', ')}
          </Typography>
        </Box>
        <CoralAttributes loadedSiteProperties={this.state.loadedSite.properties} />
        <SiteNote loadedSiteProperties={this.state.loadedSite.properties} />
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
