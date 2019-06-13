import React, { Component } from 'react';

import Site from '../../../components/Site/Site';

class Sites extends Component {
  render() {
    return (
      <div>
        <section className="Sites">
          <Site />
          <p>site 1</p>
          <p>site 2</p>
          <p>site 3</p>
        </section>
      </div>
    );
  }
}

export default Sites;
