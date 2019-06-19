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

  loadSiteData() {
    if (this.props.match.params.id) {
      if (
        !this.state.loadedSites ||
        (this.state.loadedSites && this.state.loadedSites.id !== this.props.match.params.id)
      ) {
        summary.get('/sites/' + this.props.match.params.id).then(response => {
          this.setState({ loadedSites: response.data });
        });
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
