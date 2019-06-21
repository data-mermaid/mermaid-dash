import React from 'react';

const toggleMap = props => (
  <div>
    <button className="ui inverted button" onClick={props.toggle}>
      Show Full Map
    </button>
  </div>
);

export default toggleMap;
