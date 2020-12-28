import React, { Component } from "react";

class Table extends Component {
  createTable = (display) => {
    // let high = 95;
    // let item = JSON.stringify({"background": `hsl(0, 65%, ${high}%)`});
    return Object.keys(display).map((team) => {
      team = display[team];
      return (
        <tr key={team["short_name"]}>
          <td style={Object.assign({}, { background: team["goals"]["color"] }, styles.tableData)} >
            {team["goals"]["value"]}
          </td>
          <th>{team["short_name"]}</th>
          {team["upcoming_fixtures"].map((weekArray, index) => {
            if (weekArray.length === 1) {
              return (
                <td
                  key={index}
                  style={Object.assign({}, { background: weekArray[0]["color"] }, styles.tableData)}
                >
                  {weekArray[0]["value"]}
                </td>
              )
            } if (weekArray.length === 0) {
              return (
                <td
                  key={index}
                  style={Object.assign({}, styles.darkgrey, styles.tableData)}
                ></td>
              )
            } else { // double game week
              return (
                <td key={index} style={styles.doubleGame}>
                  <div style={Object.assign({}, { background: weekArray[0]["color"] }, styles.doubleGameData)}>
                    {weekArray[0]["value"]}
                  </div>
                  <div style={Object.assign({}, { background: weekArray[1]["color"] }, styles.doubleGameData)}>
                    {weekArray[1]["value"]}
                  </div>
                </td>
              )
            }
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
