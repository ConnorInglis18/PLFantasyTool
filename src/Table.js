import React, { Component } from "react";
import PropTypes from "prop-types";

class Table extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  createTable = () => {
    return (
      <table>
        <tbody>
          {this.createHeaders()}
          {this.props.display.map(team => {
            return (
              <tr key={team["short_name"]}>
                <th>{team["short_name"]}</th>
                {team["fixtures"].map((fixture, index) => {
                  if (fixture.length === 0) {
                    return (
                      <td
                        key={index}
                        style={Object.assign(
                          {},
                          { background: "#FFF999" },
                          styles.tableData
                        )}
                      ></td>
                    );
                  } else if (fixture.length === 1) {
                    return (
                      <td
                        key={index}
                        style={Object.assign(
                          {},
                          { background: fixture[0]["color"] },
                          styles.tableData
                        )}
                      >
                        {fixture[0]["value"]}
                      </td>
                    );
                  } else {
                    return (
                      <td key={index} style={styles.doubleGame}>
                        <div
                          style={Object.assign(
                            {},
                            { background: fixture[0]["color"] },
                            styles.doubleGameData
                          )}
                        >
                          {fixture[0]["value"]}
                        </div>
                        <div
                          style={Object.assign(
                            {},
                            { background: fixture[1]["color"] },
                            styles.doubleGameData
                          )}
                        >
                          {fixture[1]["value"]}
                        </div>
                      </td>
                    );
                  }
                })}
              </tr>
            );
          })}
          ;
        </tbody>
      </table>
    );
  };

  createHeaders = () => {
    let headers = [];
    headers.push("");
    for (let i = 1; i < 39; ++i) {
      i < 10 ? headers.push("0" + i) : headers.push(i);
    }
    let mappedHeaders = headers.map(header => {
      return (
        <th key={header} style={styles.column}>
          {header}
        </th>
      );
    });
    return <tr>{mappedHeaders}</tr>;
  };

  render() {
    const table = this.createTable();
    return (
      <div style={styles.background}>
        <div>
          <button>Refresh Gameweek</button>
        </div>
        {table}
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
    overflowX: "auto"
  },
  column: {
    textAlign: "center"
  },
  tableData: {
    height: "4vh",
    width: "2.2vw",
    textAlign: "center",
    border: "1px solid black",
    fontSize: "1vw"
  },
  doubleGame: {
    border: "1px solid black",
    width: "2.2vw"
  },
  doubleGameData: {
    height: "2vh",
    fontSize: ".75vw",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  }
};

Table.propTypes = {
  display: PropTypes.array.isRequired
};
