import React, { Component } from 'react';
import { Header, Segment } from 'semantic-ui-react';

import summary from '../apis/summary';

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
      if (!loadedSite || (loadedSite && loadedSite.id !== selectSite)) {
        const { data: loadedSite } = await summary.get('/sites/' + selectSite);
        this.setState({ loadedSite });
      }
    }
  }

  render() {
    const site = this.state.loadedSite ? (
      <Segment>
        <Header as="h2">{this.state.loadedSite.properties.site_name}</Header>
        <p>Exposure: {this.state.loadedSite.properties.exposure}</p>
        <p>Reef Type: {this.state.loadedSite.properties.reef_type}</p>
        <p>Reef Zone: {this.state.loadedSite.properties.reef_zone}</p>
      </Segment>
    ) : null;

    return <div>{site}</div>;
  }
}

export default SiteDetail;
