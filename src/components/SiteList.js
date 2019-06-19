import React, { Component } from 'react';
import summary from '../apis/summary';

import SiteItem from './SiteItem';

class SiteList extends Component {
  state = {
    sites: []
  };

  componentDidMount() {
    summary.get('/sites').then(response => {
      this.setState({ sites: response.data.features });
    });
  }

  siteSelectHandler(id) {
    this.props.history.push({ pathname: '/' + id });
  }

  render() {
    let sites = this.state.sites.map(site => {
      return <SiteItem key={site.id} site={site} clicked={() => this.siteSelectHandler(site.id)} />;
    });

    return (
      <div>
        <section>
          <p>LIST OF SITES: </p>
          {sites}
        </section>
      </div>
    );
  }
}

export default SiteList;
