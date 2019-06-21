import React, { Component } from 'react';
import summary from '../apis/summary';
class SiteDetail extends Component {
  state = {
    loadedSites: null
  };

  componentDidMount() {
    this.loadSiteData();
  }

  componentDidUpdate() {
    this.loadSiteData();
  }

  async loadSiteData() {
    const { id: matchId } = this.props.match.params;
    const { loadedSites } = this.state;

    if (matchId) {
      if (!loadedSites || (loadedSites && loadedSites.id !== matchId)) {
        const { data: loadedSites } = await summary.get('/sites/' + matchId);
        this.setState({ loadedSites });
      }
    }
  }

  render() {
    return (
      <div>
        <section>Site Detail View Page</section>
      </div>
    );
  }
}

export default SiteDetail;
