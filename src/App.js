import React, { Component } from 'react';
import {
  Panel, Row, Col, Button
} from 'react-bootstrap';

import {
  LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend,
  ResponsiveContainer
  } from 'recharts';

import htmlColors from 'html-colors';
import tinycolor from 'tinycolor2';
import moment from 'moment';
import { DateRangePicker } from 'react-dates';


import 'react-dates/lib/css/_datepicker.css';
import Header from './Header.js';
import FundsList from './FundsList.js';

import './App.css';


class App extends Component {
   constructor() {
     super();
     this.handleFundSelection = this.handleFundSelection.bind(this);
     this.handleDateRangeChange = this.handleDateRangeChange.bind(this);
     this.handleCheckAll = this.handleCheckAll.bind(this);
     this.handleUncheckAll = this.handleUncheckAll.bind(this);
     let startDate = moment('2017-01-10');
     let endDate = moment('2017-05-09');

     this.state = {
        chartData: [],
        filteredChartData: [],
        funds: [],
        minDate: startDate,
        maxDate: endDate,
        startDate: startDate,
        endDate: endDate
    };
  }

  componentDidMount() {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    fetch('data.json', {headers: myHeaders}).then(response => {
      return response.json()
    }).then((json) => {
      let lastDateData = json.slice(-1)[0];
      let endDate = moment(lastDateData.date);
      let startDate = endDate.clone().subtract(90, 'days');
      let minDate = moment(json[0].date);

      this.setState({
        chartData: json,
        filteredChartData: json,
        minDate: minDate,
        maxDate: endDate,
        startDate: startDate,
        endDate: endDate
      });
    });

    fetch('funds.json', {
               headers: myHeaders,
               }
             ).then(response => {
               return response.json() })
                   .then((json) => {
                        var decoratedFunds = json.map((fund, index) => {
                          fund.selected = false;
                          fund.color = this.randomDarkColor();
                          return fund;
                        });
                        decoratedFunds = decoratedFunds.sort((a, b) => a.name.localeCompare(b.name));
                        this.setState({funds: decoratedFunds});
                   });
    }

  randomDarkColor() {
    do {
      var randColor = htmlColors.random();
    } while (tinycolor(randColor).isLight());
    return randColor;
  }

  handleFundSelection(fundId) {
    let funds = this.state.funds;

    funds.some((fund) => {
      if (fund.id === fundId) {
        fund.selected = !fund.selected;
        return true;
      }
      return false;
    });
    this.setState({ funds: funds });
    this.updateChartData();
  }

  handleDateRangeChange({startDate, endDate}) {
    this.setState({startDate, endDate});
    this.updateChartData();
  }

  updateChartData() {
    let filteredChartData = this.filterData(this.state.chartData, this.state.startDate, this.state.endDate, this.state.funds);
    this.setState({ filteredChartData: filteredChartData });
  }

  filterData(chartData, startDate, endDate, funds) {
    let startDateString = startDate.format("YYYY-MM-DD");
    let endDateString = endDate.format("YYYY-MM-DD");
    let filteredChartData = chartData.filter((dayData => {
      return startDateString <= dayData.date && endDateString >= dayData.date;
    }));

    let selectedFunds = funds.filter((item) => item.selected);
    let initialDate = chartData[0];

    return filteredChartData.map((dayData) => {
      let newdayData = {
        date: dayData.date
      };

      selectedFunds.forEach((fund) => {
        newdayData[fund.id] = Math.round((dayData[fund.id] * 100.0 / initialDate[fund.id]) * 1e2 ) / 1e2;
      })

      return newdayData;
    });
  }

  handleCheckAll() {
    this.setSelectionToAllFunds(true);
  }

  handleUncheckAll() {
    this.setSelectionToAllFunds(false);
  }

  setSelectionToAllFunds(seleted) {
    let funds = this.state.funds;
    funds.forEach((fund) => {
        fund.selected = seleted;
    });
    this.setState({ funds: funds });
  }

  render() {
    let selectedFunds = this.state.funds.filter((item) => item.selected).map((fund) => {
      return (<Line key={fund.id} name={fund.name} dataKey={fund.id} dot={false}
                type="linear" stroke={fund.color} isAnimationActive={false} />)
    });

    return (
      <div className="App">
        <Row>
          <Col md={12}>
            <Header/>
          </Col>
        </Row>

        <Row className="content no-gutter">
          <Col md={3} className="left-col">
            <Panel>
                <DateRangePicker
                  isOutsideRange={(day) => !day.isBetween(this.state.minDate, this.state.maxDate)}
                  startDate={this.state.startDate}
                  endDate={this.state.endDate}
                  onDatesChange={this.handleDateRangeChange}
                  focusedInput={this.state.focusedInput}
                  onFocusChange={focusedInput => this.setState({ focusedInput })}
                  displayFormat={() => moment.localeData('en-gb').longDateFormat('L')}
                />
              <Button className="fund-list-actions" aria-label="Check All"
                title="Check All" onClick={this.handleCheckAll}>
                <span className="glyphicon glyphicon-ok" aria-hidden="true"></span>
              </Button>
              <Button className="fund-list-actions" aria-label="Uncheck All"
                title="Uncheck All" onClick={this.handleUncheckAll}>
                <span className="glyphicon glyphicon-remove" aria-hidden="true"></span>
              </Button>
              <FundsList data={this.state.funds} handleFundSelection={this.handleFundSelection} />
            </Panel>
          </Col>
          <Col md={9} className="right-col">
            <Panel>
              <ResponsiveContainer>
                <LineChart data={this.state.filteredChartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }} >
                  <XAxis dataKey="date" />
                  <YAxis type="number" />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip/>
                  <Legend />
                  {selectedFunds}
                </LineChart>
              </ResponsiveContainer>
            </Panel>
          </Col>
        </Row>
      </div>
    );
  }
}

export default App;
