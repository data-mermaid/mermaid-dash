import React, { Component } from 'react';

import Mapcanvas from './containers/Mapcanvas/Mapcanvas';

class App extends Component {
  render() {
    return (
      <div className="App">
        <section>
          <Mapcanvas />
        </section>
      </div>
    );
  }
}
export default App;
