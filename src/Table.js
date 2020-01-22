import React, { Component } from 'react';

class Table extends Component {
  constructor(props) {
    super(props)
    this.state = {
      fixtures: null,
      gf: [],
      ga: [],
      playersDict: null,
      defendersDisplay: [],
      attackersDisplay: [],
      gfColors: [],
      gaColors: [],
    }
  }

  getColor = (goals, colors) => {
    switch(true) {
      case(colors[0][0] <= goals && goals <= colors[0][1]):
        return styles.darkred
      case(colors[1][0] <= goals && goals <= colors[1][1]):
        return styles.red
      case(colors[2][0] <= goals && goals <= colors[2][1]):
        return styles.grey
      case(colors[3][0] <= goals && goals <= colors[3][1]):
        return styles.green
      case(colors[4][0] <= goals && goals <= colors[4][1]):
        return styles.darkgreen
      default: // used if the number is -1
        return styles.darkgrey
    }
  }
 
  createTable = (colors, display) => {
    return Object.keys(display).map(team => {
      return (
        <tr key={team}>
          <th>{team}</th>
          {display[team].map((goals,index) => {
            return (typeof goals === "number") ?
              (<td key={index} style={Object.assign({}, this.getColor(goals, colors),styles.tableData)}>
                {goals}
              </td>) :
              (<td key={index} style={Object.assign({}, styles.tableData, styles.doubleGame)}>
                <div style={this.getColor(parseInt(goals.substring(0,2)), colors)}>
                  {goals.substring(0,2)}
                </div>
                <div style={this.getColor(parseInt(goals.substring(3,5)), colors)}>
                  {goals.substring(3,5)}
                </div>
              </td>);
          })}
        </tr>
      )
    })
  }

  createHeaders = () => {
    let headers = []
    headers.push("")
    for (let i = 1; i < 39; ++i) {
      i < 10 ? headers.push("0" + i) : headers.push(i)
    }
    let mappedHeaders = headers.map(header => {
      return <th key={header} style={styles.column}>{header}</th>
    })
    return (<tr>{mappedHeaders}</tr>)
  }

  render() {
    return (
      <div style={styles.background}>
        <table>
          <tbody>
            {this.createHeaders()}
            {this.createTable(this.props.colors, this.props.display)}
          </tbody>
        </table>
      </div>
    )
  }
}

export default Table;

const styles = {
  background: {
    background: "lightgrey",
    display: "flex",
    height: "100vh",
    paddingLeft: "50px",
    paddingTop: "75px",
  },
  column: {
    justifyContent: "center"
  },
  tableData: {
    height: "40px",
    width: "40px",
    textAlign: "center",
    border: "1px solid black",
    fontSize: ".9em",
  },
  doubleGame: {
    background: "yellow",
  },
  darkgrey: {
    background: "darkgrey",
    color: "darkgrey"
  },
  darkred: {
    background: "#861D46",
    color: "white",
  },
  red: {
    background: "#FF005A",
    color: "white",
  },
  grey: {
    background: "#EBEBE4",
  },
  green: {
    background: "#00ff86",
  },
  darkgreen: {
    background: "#02894E",
    color: "white",
  },
}