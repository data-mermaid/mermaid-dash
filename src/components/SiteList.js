import React, { Component } from 'react';
import summary from '../apis/summary';
import { Header, List } from 'semantic-ui-react';

import SiteItem from './SiteItem';

class SiteList extends Component {
  state = {
    sites: []
  };

  async componentDidMount() {
    const {
      data: { features: sites }
    } = await summary.get('/sites');
    this.setState({ sites });
  }

  siteSelectHandler(id) {
    this.props.history.push({ pathname: '/' + id });
  }

  render() {
    const sites = this.state.sites.map(site => {
      return (
        <List.Item key={site.id}>
          <Header as="h3">
            <SiteItem site={site} clickedFn={() => this.siteSelectHandler(site.id)} />
          </Header>
          {site.properties.country_name}
        </List.Item>
      );
    });

    return (
      <div>
        <Header as="h1">List of Sites:</Header>
        <List>{sites}</List>
      </div>
    );
  }
}

export default SiteList;
