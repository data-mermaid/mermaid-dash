import React, { Component } from 'react';

import SiteList from './SiteList';

class DashBoard extends Component {
  render() {
    const dashboard = this.props.showFullMap ? (
      <div className="ui grid">
        <div className="row">
          <div className="eight wide column" />
          <div className="seven wide column">
            <SiteList />
          </div>
        </div>
      </div>
    ) : null;

    return <div>{dashboard}</div>;
  }
}

export default DashBoard;
