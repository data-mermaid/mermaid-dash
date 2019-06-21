import React from 'react';
import { Button } from 'semantic-ui-react';

const toggleMap = props => (
  <Button inverted onClick={props.toggle}>
    Show Full Map
  </Button>
);

export default toggleMap;
