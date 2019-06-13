import React, { Component } from 'react';

import Sites from '../Mapcanvas/Sites/Sites';

class Mapcanvas extends Component {
  render() {
    return (
      <div className="Mapcanvas">
        <p>TOOLBAR</p>
        <Sites />
      </div>
    );
  }
}

export default Mapcanvas;
