import React, { Component } from 'react';
import { Grid } from 'semantic-ui-react';

import SiteList from './SiteList';

class DashBoard extends Component {
  render() {
    const dashboard = this.props.showFullMap ? (
      <Grid>
        <Grid.Row>
          <Grid.Column width={8} />
          <Grid.Column width={7}>
            <SiteList />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    ) : null;

    return <div>{dashboard}</div>;
  }
}

export default DashBoard;
