import React, { Component } from 'react';
import { Dropdown } from 'semantic-ui-react';
import styled from 'styled-components/macro';

const DropDownWrapper = styled.div`
  margin: 10px 0 10px 0;
`;

class DropDown extends Component {
  render() {
    const siteList =
      this.props.siteList.length > 0 ? (
        <Dropdown
          placeholder="Select site"
          fluid
          selection
          onChange={this.props.onSelectChange}
          options={this.props.siteList}
        />
      ) : (
        <div>Loading</div>
      );

    return <DropDownWrapper>{siteList}</DropDownWrapper>;
  }
}

export default DropDown;
