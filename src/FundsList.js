import React, {Component} from 'react';
import FundsListItem from './FundsListItem.js';
import './FundsList.css';

class FundsList extends Component {
    constructor(props) {
      super(props);
      this.handleFundSelection = this.handleFundSelection.bind(this);
    }

    handleFundSelection(fundId) {
      this.props.handleFundSelection(fundId);
    }

    render() {
      const fundsList = this.props.data.map((fund) => {
          return <FundsListItem key={fund.id} fund={fund} handleFundSelection={this.handleFundSelection}/>
      });
      return <div className="list-group">
          {fundsList}
      </div>;
    }
}

export default FundsList;
