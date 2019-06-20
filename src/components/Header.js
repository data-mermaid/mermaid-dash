import React from 'react';

const Header = () => (
  <div className="ui inverted pointing menu">
    <div className="item">MERMAID</div>
    <div className="right menu">
      <div className="item">COLLECT</div>
      <div className="item">ABOUT THESE DATA</div>
      <div className="item">PRIVACY</div>
      <div className="item">CONTACT</div>
      <div className="item">
        <button className="ui inverted button">Show Full Map</button>
      </div>
    </div>
  </div>
);

export default Header;
