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
      return (
        <div className="item" key={site.id}>
          <div className="header">
            <SiteItem site={site} clicked={() => this.siteSelectHandler(site.id)} />
          </div>
          {site.properties.country_name}
        </div>
      );
    });

    return (
      <div>
        <section>
          <h2 className="header">List of Sites:</h2>
          <div className="ui list">{sites}</div>
        </section>
      </div>
    );
  }
}

export default SiteList;
