import React, { Component } from 'react';
import { Dropdown } from 'semantic-ui-react';
import './DropDown.css';

class DropDown extends Component {
  render() {
    let siteList = <div>loading</div>;
    if (this.props.siteList.length > 0) {
      siteList = (
        <Dropdown
          className="dropdown-style"
          placeholder="Select site"
          fluid
          selection
          onChange={this.props.onSelectChange}
          options={this.props.siteList}
        />
      );
    }
    return siteList;
  }
}

export default DropDown;
