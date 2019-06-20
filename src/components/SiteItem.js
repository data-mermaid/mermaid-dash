import React from 'react';

const site = props => (
  <div onClick={props.clickedFn}>{props.site.properties.site_name} ( click me! )</div>
);

export default site;
