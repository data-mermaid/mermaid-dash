import React, { Component } from 'react';
import axios from 'axios';

import Site from '../../../components/Site/Site';

class Sites extends Component {
  state = {
    sites: []
  };

  componentDidMount() {
    axios.get('https://summary-api.datamermaid.org/v1/sites/?format=json').then(response => {
      this.setState({ sites: response.data.features });
    });
  }

  render() {
    let sites = this.state.sites.map(site => {
      return <Site key={site.id} siteName={site.properties.site_name} />;
    });

    return (
      <div>
        <section className="Sites">
          <p>LIST OF SITES: </p>
          {sites}
        </section>
      </div>
    );
  }
}

export default Sites;
