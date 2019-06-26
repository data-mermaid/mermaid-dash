import React, { Component } from 'react';
import summary from '../apis/summary';

import { Segment } from 'semantic-ui-react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';

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
      if (!loadedSite || (loadedSite && loadedSite.id !== selectSite.key)) {
        const { data: loadedSite } = await summary.get('/sites/' + selectSite.key);
        this.setState({ loadedSite });
      }
    }
  }

  render() {
    const site = this.state.loadedSite ? (
      // Have tried wraper from material ui, it doesn't play well with the map component I created. Stay with <Segment> for now, would love some advice as I refactor it again
      <Segment>
        <Grid container>
          <Grid item xs={6}>
            <Typography variant="h4">
              <Box>{this.state.loadedSite.properties.site_name}</Box>
            </Typography>
            <Typography component="div" variant="body1">
              <Box>{this.state.loadedSite.properties.country_name}</Box>
            </Typography>
            <Typography component="div" variant="body1">
              <Box>
                {this.state.loadedSite.properties.management_regimes
                  ? this.state.loadedSite.properties.management_regimes
                      .map(mr => {
                        return mr.name;
                      })
                      .join(', ')
                  : 'No managements'}
              </Box>
            </Typography>
          </Grid>
          <Grid item xs={6} align="right">
            <Button variant="contained" color="primary">
              Contact Admins
            </Button>
          </Grid>
        </Grid>
        <Typography component="div" variant="body2">
          <Box borderTop={1}>
            Admins:{' '}
            {this.state.loadedSite.properties.project_admins
              .map(admin => {
                return admin.name;
              })
              .join(', ')}
          </Box>
        </Typography>
        <Typography component="div" variant="body2">
          <Box display="flex" flexDirection="row" justifyContent="center">
            <Box p={1} m={1} border={1} borderRadius={13}>
              Exposure: {this.state.loadedSite.properties.exposure}
            </Box>
            <Box p={1} m={1} border={1} borderRadius={13}>
              Reef Type: {this.state.loadedSite.properties.reef_type}
            </Box>
            <Box p={1} m={1} border={1} borderRadius={13}>
              Reef Zone: {this.state.loadedSite.properties.reef_zone}
            </Box>
          </Box>
        </Typography>
        <Typography variant="h6">Notes</Typography>
        <Typography variant="body2">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis tenetur unde
          suscipit, quam beatae rerum inventore consectetur, neque doloribus, cupiditate numquam
          dignissimos laborum fugiat deleniti? Eum quasi quidem quibusdam.
        </Typography>
      </Segment>
    ) : null;

    return <div>{site}</div>;
  }
}

export default SiteDetail;
