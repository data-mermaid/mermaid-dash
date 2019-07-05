import React, { Component } from 'react';
import summary from '../apis/summary';

import SiteDetail from './SiteDetail';
import DropDown from './DropDown';

class SiteList extends Component {
  state = {
    sites: [],
    selectSite: null
  };

  async componentDidMount() {
    const {
      data: { features: sites }
    } = await summary.get('/sites');
    this.setState({ sites });
  }

  siteSelectHandler = selectedOption => {
    this.setState({ selectSite: selectedOption });
  };

  render() {
    const newSiteList = this.state.sites.map(site => {
      return {
        key: site.id,
        label: site.properties.site_name,
        value: site.properties.site_name
      };
    });

    return (
      <div>
        <DropDown
          selectSite={this.state.selectSite}
          siteList={newSiteList}
          siteSelectHandler={this.siteSelectHandler}
        />
        <SiteDetail selectSite={this.state.selectSite} />
      </div>
    );
  }
}

export default SiteList;
