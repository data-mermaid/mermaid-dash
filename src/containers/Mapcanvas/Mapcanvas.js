import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import Sites from '../Mapcanvas/Sites/Sites';
import SiteView from '../Mapcanvas/SiteView/SiteView';

class Mapcanvas extends Component {
  render() {
    return (
      <div className="Mapcanvas">
        <p>TOOLBAR</p>
        <Switch>
          <Route path="/:id" exact component={SiteView} />
          <Route path="/" component={Sites} />
        </Switch>
      </div>
    );
  }
}

export default Mapcanvas;
