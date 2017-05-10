import React, { Component } from 'react';
import {
  Panel, Row, Col
} from 'react-bootstrap';

import {
  LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend,
  ResponsiveContainer
  } from 'recharts';

import Header from './Header.js';
import FundsList from './FundsList.js';

import './App.css';

// import htmlColors from './html-colors';

import htmlColors from 'html-colors';
import tinycolor from 'tinycolor2';

class App extends Component {
   constructor() {
     super();
     this.handleFundSelection = this.handleFundSelection.bind(this);
     this.state = {
        chartData: [],
        filteredChartData: [],
        funds: []
    };
  }

  componentDidMount() {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    // const colorKeys = Object.keys(htmlColors);

    fetch('data.json', {
               headers: myHeaders,
               }
             ).then(response => {
               return response.json() })
                   .then((json) => {
                       this.setState({
                         chartData: json,
                         filteredChartData: json
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
    console.log('here');
    let funds = this.state.funds;

    funds.some((fund) => {
      if (fund.id === fundId) {
        fund.selected = !fund.selected;
        return true;
      }
      return false;
    });
    this.setState({ funds: funds });

    let fundsHash = {};
    funds.forEach((fund) => {
      fundsHash[fund.id] = { selected: fund.selected };
    });

    let chartData = this.state.chartData;
    let filteredChartData = null;

    filteredChartData = chartData.map((dayData) => {
      let newdayData = {};

      for (var key in dayData) {
        if (dayData.hasOwnProperty(key)) {
          if (fundsHash[key] == null) {
            newdayData[key] = dayData[key];
          } else if (fundsHash[key].selected) {
            newdayData[key] = dayData[key];
          }
        }
      }

      return newdayData;
    });
    this.setState({ filteredChartData: filteredChartData });
  }

  render() {
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

                  {
                    this.state.funds.map((fund) => {
                      if (fund.selected) {
                        return (<Line key={fund.id} name={fund.name} dataKey={fund.id} dot={false}
                                  type="linear" stroke={fund.color} isAnimationActive={false} />)
                      }
                      return null;
                    })
                  }

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
