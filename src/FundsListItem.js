import React, { Component } from 'react';
import './FundsListItem.css';

class FundsListItem extends Component {
  constructor(props) {
    super(props);
    this.handleFundSelection = this.handleFundSelection.bind(this);
  }

  handleFundSelection(e) {
    e.target.blur();
    this.props.handleFundSelection(parseInt(e.target.id, 10));
  }

  render() {
    const fund = this.props.fund;
    let buttonClass = "list-group-item " + (fund.selected ? "selected-fund" : "");
    let iconClass = fund.selected ? "glyphicon glyphicon-ok" : "glyphicon glyphicon-remove";

    return <button type="button" id={fund.id} onClick={this.handleFundSelection} className={buttonClass}>
            <span className={iconClass} aria-hidden="true"></span>
            &nbsp;
            {fund.name}
          </button>;
  }
}

export default FundsListItem;
