import React, { Component } from 'react';

import summary from '../apis/summary';

import ContactIcon from '@material-ui/icons/Email';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';

import { TextLoader } from './Loader';
import { ButtonStyle } from './Button';

import PropTypes from 'prop-types';

const containerStyle = theme => ({
  root: {
    paddingBottom: theme.spacing(2)
  },
  siteWrapper: {
    padding: theme.spacing(2, 2)
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
      <ButtonStyle setHover={true}>
        <Box p={1} display="flex" justifyContent="center">
          <ContactIcon fontSize="small" className={classes.iconProperty} />
          <Typography variant="body1" display="inline">
            Contact Admins
          </Typography>
        </Box>
      </ButtonStyle>
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

        <Box borderTop={1} pt={1}>
          <Typography variant="body2">
            Admins:{' '}
            {this.state.loadedSite.properties.project_admins
              .map(admin => {
                return admin.name;
              })
              .join(', ')}
          </Typography>
        </Box>
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="flex-start"
          className={classes.reefProperty}
        >
          <Box p={1} mr={1} border={1} borderRadius={13}>
            Exposure: {this.state.loadedSite.properties.exposure}
          </Box>
          <Box p={1} mr={1} border={1} borderRadius={13}>
            Reef Type: {this.state.loadedSite.properties.reef_type}
          </Box>
          <Box p={1} mr={1} border={1} borderRadius={13}>
            Reef Zone: {this.state.loadedSite.properties.reef_zone}
          </Box>
        </Box>
        <Typography variant="h6">Notes</Typography>
        <Typography variant="body2">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis tenetur unde
          suscipit, quam beatae rerum inventore consectetur, neque doloribus, cupiditate numquam
          dignissimos laborum fugiat deleniti? Eum quasi quidem quibusdam.
        </Typography>
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
