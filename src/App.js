import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import MermaidDash from './components/MermaidDash';
import { HistogramProvider } from './context/histogramContext';

class App extends Component {
  render() {
    return (
      <HistogramProvider>
        <Route path="/" component={MermaidDash} />
      </HistogramProvider>
    );
  }
}

export default App;
