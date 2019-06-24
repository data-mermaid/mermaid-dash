import React, { Component } from 'react';
import { Menu, Segment, Button } from 'semantic-ui-react';

class Header extends Component {
  state = { activeItem: 'COLLECT' };

  handleItemClick = (e, { name }) => this.setState({ activeItem: name });

  render() {
    const { activeItem } = this.state;

    return (
      <Segment inverted>
        <Menu inverted pointing secondary>
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
            <Button inverted>Show Full Map</Button>
          </Menu.Item>
        </Menu>
      </Segment>
    );
  }
}

export default Header;
