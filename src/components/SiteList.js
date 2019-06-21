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

  siteSelectHandler(id) {
    this.setState({ selectSite: id });
  }

  onSelectChange = (e, data) => {
    const getSite = data.options.find(site => (site.value === data.value ? site.key : null));
    this.setState({ selectSite: getSite.key });
  };

  render() {
    const newSiteList = this.state.sites.map(site => {
      return {
        key: site.id,
        text: site.properties.site_name,
        value: site.properties.site_name
      };
    });

    return (
      <div>
        <DropDown siteList={newSiteList} onSelectChange={this.onSelectChange} />
        <SiteDetail selectSite={this.state.selectSite} />
      </div>
    );
  }
}

export default SiteList;
