import React, { Component } from 'react';

import ToggleMap from './ToggleMap';
class Header extends Component {
  render() {
    return (
      <div className="ui inverted pointing menu">
        <div className="item">MERMAID</div>
        <div className="right menu">
          <div className="item">COLLECT</div>
          <div className="item">ABOUT THESE DATA</div>
          <div className="item">PRIVACY</div>
          <div className="item">CONTACT</div>
          <div className="item">
            <ToggleMap toggle={this.props.toggle} />
          </div>
        </div>
      </div>
    );
  }
}

export default Header;
