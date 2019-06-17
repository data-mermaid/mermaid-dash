import React, { Component } from 'react';
import axios from 'axios';

class SiteView extends Component {
  state = {
    loadedSites: null
  };

  componentDidMount() {
    this.loadSiteData();
  }

  componentDidUpdate() {
    this.loadSiteData();
  }

  loadSiteData() {
    if (this.props.match.params.id) {
      if (
        !this.state.loadedSites ||
        (this.state.loadedSites && this.state.loadedSites.id != this.props.match.params.id)
      ) {
        axios
          .get('https://summary-api.datamermaid.org/v1/sites/' + this.props.match.params.id)
          .then(response => {
            this.setState({ loadedSites: response.data });
          });
      }
    }
  }
  render() {
    console.log('SiteView container state: ', this.state.loadedSites);
    return (
      <div className="SiteView">
        <header>Site Detail View Page</header>
      </div>
    );
  }
}

export default SiteView;
