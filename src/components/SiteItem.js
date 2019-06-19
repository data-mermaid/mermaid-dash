import React from 'react';

const site = props => (
  <div>
    <article onClick={props.clicked}>
      <header>{props.site.properties.site_name}</header>
    </article>
  </div>
);

export default site;
