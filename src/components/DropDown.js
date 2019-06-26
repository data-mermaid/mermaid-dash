import React, { Component } from 'react';
import Select from 'react-select';

class DropDownMui extends Component {
  render() {
    const siteList =
      this.props.siteList.length > 0 ? (
        <Select
          value={this.props.selectSite}
          placeholder="Select Site"
          onChange={this.props.siteSelectHandler}
          options={this.props.siteList}
        />
      ) : (
        <div>Loading</div>
      );

    return <div>{siteList}</div>;
  }
}

export default DropDownMui;
