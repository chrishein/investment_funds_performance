import React, {Component} from 'react';
import {
  FormControl
} from 'react-bootstrap';
import FundsListItem from './FundsListItem.js';
import './FundsList.css';

class FundsList extends Component {
    constructor(props) {
      super(props);
      this.handleFundSelection = this.handleFundSelection.bind(this);
      this.filterFundList = this.filterFundList.bind(this);
      this.state = {
        searchKeyWord: '',
        data: [],
        filteredData: []
      };
    }

    componentWillReceiveProps (nextProps) {
      if (typeof nextProps.data !== 'undefined' && nextProps.data !== this.props.data) {
        this.setState({
          data: nextProps.data,
          filteredData: nextProps.data
        });
      }
    }

    handleFundSelection(fundId) {
      this.props.handleFundSelection(fundId);
    }

    filterFundList(e) {
      var keyWord = e.target.value;

      var filteredData = this.state.data.filter((item) => {
        return item.name.toLowerCase().search(keyWord.toLowerCase()) !== -1;
      });

      this.setState({
        searchKeyWord: keyWord,
        filteredData: filteredData
      });
    }

    render() {
      var searchKeyWord = this.state.searchKeyWord;

      const fundsList = this.state.filteredData.map((fund) => {
          return <FundsListItem key={fund.id} fund={fund} handleFundSelection={this.handleFundSelection}/>
      });

      return <div className="fund-list">
              <FormControl type="text" value={searchKeyWord} placeholder="Search for Fund Name"
                onChange={this.filterFundList} className="fund-list-search"/>
              <div className="list-group">
                {fundsList}
              </div>
             </div>;
    }
}

export default FundsList;
