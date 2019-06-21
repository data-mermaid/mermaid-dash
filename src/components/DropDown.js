import React, { Component } from 'react';
import { Dropdown } from 'semantic-ui-react';
import './DropDown.css';

class DropDown extends Component {
  render() {
    const siteList =
      this.props.siteList.length > 0 ? (
        <Dropdown
          className="dropdown-style"
          placeholder="Select site"
          fluid
          selection
          onChange={this.props.onSelectChange}
          options={this.props.siteList}
        />
      ) : (
        <div>loading</div>
      );

    return <div>{siteList}</div>;
  }
}

export default DropDown;
