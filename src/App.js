import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import MermaidDash from './components/MermaidDash';

class App extends Component {
  render() {
    return (
      <>
        <Route path="/" component={MermaidDash} />
      </>
    );
  }
}

export default App;
