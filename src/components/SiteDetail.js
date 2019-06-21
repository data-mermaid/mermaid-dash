import React, { Component } from 'react';
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

  loadSiteData() {
    if (this.props.selectSite) {
      if (
        !this.state.loadedSite ||
        (this.state.loadedSite && this.state.loadedSite.id !== this.props.selectSite)
      ) {
        summary.get('/sites/' + this.props.selectSite).then(response => {
          this.setState({ loadedSite: response.data });
        });
      }
    }
  }

  render() {
    const site = this.state.loadedSite ? (
      <div className="ui segment">
        <h2 className="header">{this.state.loadedSite.properties.site_name}</h2>
        <p>Exposure: {this.state.loadedSite.properties.exposure}</p>
        <p>Reef Type: {this.state.loadedSite.properties.reef_type}</p>
        <p>Reef Zone: {this.state.loadedSite.properties.reef_zone}</p>
      </div>
    ) : null;

    return <div>{site}</div>;
  }
}

export default SiteDetail;
