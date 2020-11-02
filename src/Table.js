import React, { Component } from "react";

class Table extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fixtures: null,
      gf: [],
      ga: [],
      playersDict: null,
      defendersDisplay: [],
      attackersDisplay: [],
      gfColors: [],
      gaColors: [],
    };
  }

  getColor = (goals, colors) => {
    if (colors.length === 1) {
      switch (true) {
        case colors[0][0] <= goals && goals <= colors[0][1]:
          return styles.grey;
        default:
          // used if the number is -1
          return styles.darkgrey;
      }
    } else if (colors.length === 2) {
      switch (true) {
        case colors[0][0] <= goals && goals <= colors[0][1]:
          return styles.lightred;
        case colors[1][0] <= goals && goals <= colors[1][1]:
          return styles.lightgreen;
        default:
          // used if the number is -1
          return styles.darkgrey;
      }
    } else if (colors.length === 3) {
      switch (true) {
        case colors[0][0] <= goals && goals <= colors[0][1]:
          return styles.lightred;
        case colors[1][0] <= goals && goals <= colors[1][1]:
          return styles.grey;
        case colors[2][0] <= goals && goals <= colors[2][1]:
          return styles.lightgreen;
        default:
          // used if the number is -1
          return styles.darkgrey;
      }
    } else if (colors.length === 4) {
      switch (true) {
        case colors[0][0] <= goals && goals <= colors[0][1]:
          return styles.red;
        case colors[1][0] <= goals && goals <= colors[1][1]:
          return styles.lightred;
        case colors[2][0] <= goals && goals <= colors[2][1]:
          return styles.lightgreen;
        case colors[3][0] <= goals && goals <= colors[3][1]:
          return styles.green;
        default:
          // used if the number is -1
          return styles.darkgrey;
      }
    } else if (colors.length === 5) {
      switch (true) {
        case colors[0][0] <= goals && goals <= colors[0][1]:
          return styles.red;
        case colors[1][0] <= goals && goals <= colors[1][1]:
          return styles.lightred;
        case colors[2][0] <= goals && goals <= colors[2][1]:
          return styles.grey;
        case colors[3][0] <= goals && goals <= colors[3][1]:
          return styles.lightgreen;
        case colors[4][0] <= goals && goals <= colors[4][1]:
          return styles.green;
        default:
          // used if the number is -1
          return styles.darkgrey;
      }
    } else if (colors.length === 6) {
      switch (true) {
        case colors[0][0] <= goals && goals <= colors[0][1]:
          return styles.darkred;
        case colors[1][0] <= goals && goals <= colors[1][1]:
          return styles.red;
        case colors[2][0] <= goals && goals <= colors[2][1]:
          return styles.lightred;
        case colors[3][0] <= goals && goals <= colors[3][1]:
          return styles.lightgreen;
        case colors[4][0] <= goals && goals <= colors[4][1]:
          return styles.green;
        case colors[5][0] <= goals && goals <= colors[5][1]:
          return styles.darkgreen;
        default:
          // used if the number is -1
          return styles.darkgrey;
      }
    } /* colors.length === 7 */ else {
      switch (true) {
        case colors[0][0] <= goals && goals <= colors[0][1]:
          return styles.darkred;
        case colors[1][0] <= goals && goals <= colors[1][1]:
          return styles.red;
        case colors[2][0] <= goals && goals <= colors[2][1]:
          return styles.lightred;
        case colors[3][0] <= goals && goals <= colors[3][1]:
          return styles.grey;
        case colors[4][0] <= goals && goals <= colors[4][1]:
          return styles.lightgreen;
        case colors[5][0] <= goals && goals <= colors[5][1]:
          return styles.green;
        case colors[6][0] <= goals && goals <= colors[6][1]:
          return styles.darkgreen;
        default:
          // used if the number is -1
          return styles.darkgrey;
      }
    }
  };

  createTable = (colors, display) => {
    return Object.keys(display).map((team) => {
      return (
        <tr key={team}>
          <th>{team}</th>
          {display[team].map((goals, index) => {
            return typeof goals === "number" ? (
              <td
                key={index}
                style={Object.assign(
                  {},
                  this.getColor(goals, colors),
                  styles.tableData
                )}
              >
                {goals}
              </td>
            ) : (
              <td key={index} style={styles.doubleGame}>
                <div
                  style={Object.assign(
                    {},
                    this.getColor(parseInt(goals.substring(0, 2)), colors),
                    styles.doubleGameData
                  )}
                >
                  {goals.substring(0, 2)}
                </div>
                <div
                  style={Object.assign(
                    {},
                    this.getColor(parseInt(goals.substring(3, 5)), colors),
                    styles.doubleGameData
                  )}
                >
                  {goals.substring(3, 5)}
                </div>
              </td>
            );
          })}
        </tr>
      );
    });
  };

  createHeaders = () => {
    let headers = [];
    headers.push("");
    for (let i = 1; i < 39; ++i) {
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
            {this.createHeaders()}
            {this.createTable(this.props.colors, this.props.display)}
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
  darkred: {
    background: "#ec2727",
  },
  red: {
    background: "#f26666",
  },
  lightred: {
    background: "#f9b5b5",
  },
  grey: {
    background: "#EBEBE4",
  },
  lightgreen: {
    background: "#6cea70",
  },
  green: {
    background: "#1bc020",
  },
  darkgreen: {
    background: "#169a1a",
  },
};
