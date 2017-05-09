import React, { Component } from 'react';
import Navbar, {Brand} from 'react-bootstrap/lib/Navbar';
import './Header.css';

class Header extends Component {
  render() {
    return (
      <div id="wrapper" className="content">
        <Navbar fluid={true}  style={ {margin: 0} }>
          <Brand>
              <span>&nbsp;Investment Funds Performance Comparison</span>
          </Brand>
        </Navbar>
      </div>
    );
  }
}

export default Header;
