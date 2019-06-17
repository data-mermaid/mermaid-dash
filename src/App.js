import React, { Component } from 'react';
import { BrowserRouter } from 'react-router-dom';

import Mapcanvas from './containers/Mapcanvas/Mapcanvas';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <section>
            <Mapcanvas />
          </section>
        </div>
      </BrowserRouter>
    );
  }
}
export default App;
