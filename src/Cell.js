import React, { Component } from 'react'

class Cell extends Component {
  render() {
    const {weekArray} = this.props;
    if (weekArray.length === 1) { // regular gameweek
      return (
        <td
          style={Object.assign({}, { background: weekArray[0]["color"] }, styles.tableData)}
        >
          {weekArray[0]["value"]}
        </td>
      )
    } else if (weekArray.length === 0) { // no games
      return (
        <td
          style={Object.assign({}, styles.darkgrey, styles.tableData)}
        ></td>
      )
    } else { // double game week
      return (
        <td style={styles.doubleGame}>
          <div style={Object.assign({}, { background: weekArray[0]["color"] }, styles.doubleGameData)}>
            {weekArray[0]["value"]}
          </div>
          <div style={Object.assign({}, { background: weekArray[1]["color"] }, styles.doubleGameData)}>
            {weekArray[1]["value"]}
          </div>
        </td>
      )
    }
  }
}

export default Cell;

const styles = {
  tableData: {
    height: "4vh",
    width: "2.2vw",
    textAlign: "center",
    border: "1px solid black",
    fontSize: "1vw",
  },
  doubleGame: {
    border: "1px solid black",
    width: "2.2vw",
  },
  doubleGameData: {
    height: "2vh",
    fontSize: ".75vw",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  darkgrey: {
    background: "darkgrey",
    color: "darkgrey",
  },
};
