import React, { Component } from "react";
import Cell from './Cell';

class Table extends Component {
  createTable = (display) => {
    return Object.keys(display).map((team) => {
      team = display[team];
      return (
        <tr key={team["short_name"]}>
          <td style={Object.assign({}, { background: team["goals"]["color"] }, styles.tableData)} >
            {team["goals"]["value"]}
          </td>
          <th>{team["short_name"]}</th>
          {team["upcoming_fixtures"].map((weekArray, index) => {
            return (
              <Cell
                weekArray={weekArray}
                key={`${team["short_name"]}-${index}-${this.props.type}`}
              />
            )
          })}
        </tr>
      );
    });
  };

  createHeaders = (type, upcomingGameweek) => {
    let headers = [];
    (type === "DEFENDERS") ? headers.push("GA") : headers.push("GF");
    
    headers.push("Team");
    for (let i = upcomingGameweek; i < 39; ++i) {
      i < 10 ? headers.push("0" + i) : headers.push(i);
    }
    let mappedHeaders = headers.map((header) => {
      return (
        <th key={header} style={styles.column}>
          {header}
        </th>
      );
    });
    return <tr>{mappedHeaders}</tr>;
  };

  render() {
    return (
      <div style={styles.background}>
        <table>
          <tbody>
            {this.createHeaders(this.props.type, this.props.upcomingGameweek)}
            {this.createTable(this.props.display)}
          </tbody>
        </table>
      </div>
    );
  }
}

export default Table;

const styles = {
  background: {
    padding: "2vh 2vw",
    display: "flex",
    flexFlow: "column no-wrap",
    alignItems: "stretch",
    background: "lightgrey",
    overflowX: "auto",
  },
  column: {
    textAlign: "center",
  },
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
  // darkred: {
  //   background: "#ec2727",
  // },
  // red: {
  //   background: "#f26666",
  // },
  // lightred: {
  //   background: "#f9b5b5",
  // },
  // grey: {
  //   background: "#EBEBE4",
  // },
  // lightgreen: {
  //   background: "#6cea70",
  // },
  // green: {
  //   background: "#1bc020",
  // },
  // darkgreen: {
  //   background: "#169a1a",
  // },
};
