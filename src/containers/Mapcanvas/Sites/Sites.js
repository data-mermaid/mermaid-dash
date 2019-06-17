import React, { Component } from 'react';
import axios from 'axios';
import { Route } from 'react-router-dom';

import Site from '../../../components/Site/Site';
// import SiteView from '../SiteView/SiteView';

class Sites extends Component {
  state = {
    sites: []
  };

  componentDidMount() {
    console.log('Sites component did mount => ', this.props);
    axios.get('https://summary-api.datamermaid.org/v1/sites/').then(response => {
      this.setState({ sites: response.data.features });
    });
  }

  siteSelectHandler(id) {
    this.props.history.push({ pathname: '/' + id });
  }

  render() {
    let sites = this.state.sites.map(site => {
      return <Site key={site.id} site={site} clicked={() => this.siteSelectHandler(site.id)} />;
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
