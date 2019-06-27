import React, { Component } from 'react';
import Select from 'react-select';
import PropTypes from 'prop-types';

class DropDown extends Component {
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

DropDown.propTypes = {
  selectSite: PropTypes.object,
  siteList: PropTypes.array,
  siteSelectHandler: PropTypes.func
};

export default DropDown;
