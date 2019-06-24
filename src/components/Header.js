import React, { Component } from 'react';
import { Menu } from 'semantic-ui-react';

import ToggleMap from './ToggleMap';

class Header extends Component {
  state = { activeItem: 'COLLECT' };

  handleItemClick = (e, { name }) => this.setState({ activeItem: name });

  render() {
    const { activeItem } = this.state;

    return (
      <div>
        <Menu inverted>
          <Menu.Item name="MERMAID" />
          <Menu.Menu position="right">
            <Menu.Item
              name="COLLECT"
              active={activeItem === 'COLLECT'}
              onClick={this.handleItemClick}
            />
            <Menu.Item
              name="ABOUT THESE DATA"
              active={activeItem === 'ABOUT THESE DATA'}
              onClick={this.handleItemClick}
            />
            <Menu.Item
              name="PRIVACY"
              active={activeItem === 'PRIVACY'}
              onClick={this.handleItemClick}
            />
            <Menu.Item
              name="CONTACT"
              active={activeItem === 'CONTACT'}
              onClick={this.handleItemClick}
            />
          </Menu.Menu>
          <Menu.Item>
            <ToggleMap toggle={this.props.toggle} />
          </Menu.Item>
        </Menu>
      </div>
    );
  }
}

export default Header;
