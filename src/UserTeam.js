import React, { Component } from "react";
import Cell from './Cell';
import { createTeam, addPlayerToUserTeam, removePlayerFromUserTeam, isPlayerInUserTeam, createUserTeamsDisplay } from "./backend/userTeam";
// import PropTypes from "prop-types";

class UserTeam extends Component {
  constructor(props) {
    super(props); // if there is a line striked through super, it's a bug on VS Code side
    this.state = {
      userTeams: [],
      currentTeamIndex: 0,
      teamName: ""
    };
  }

  componentDidMount() {
    this.setState({
      userTeams: createUserTeamsDisplay(),
    });
  }

  addPlayerToUserTeam = (e) => {
    e.preventDefault();
    const playerId = e.target.id;
    // Get the element so a visual indicator can be shown to the user when the button is pressed
    const playerElt = document.getElementById("addPlayer"+playerId);
    const originalBackgroundColor = playerElt.style.getPropertyValue("background-color");
    if (isPlayerInUserTeam(playerId, this.state.currentTeamIndex)) { // make sure the player does not already exist in the current team
      // Give green flash visual indication the player was added
      playerElt.style.setProperty("background-color", styles.green.background);
      setTimeout(() => {
        playerElt.style.setProperty("background-color", originalBackgroundColor);
      }, 400);
      // Add the player to the team
      let userTeams = addPlayerToUserTeam(playerId, this.state.currentTeamIndex);
      this.setState({
        userTeams: userTeams,
      });
    } else {
      // Give grey flash visual indication the player was already in the team
      playerElt.style.setProperty("background-color", styles.headerRow.background);
      setTimeout(() => {
        playerElt.style.setProperty("background-color", originalBackgroundColor);
      }, 400);
    }
  }

  removePlayerFromUserTeam = (e) => {
    e.preventDefault();
    let userTeams = removePlayerFromUserTeam(e.target.id, this.state.currentTeamIndex);
    this.setState({
      userTeams: userTeams
    });
  }

  handleTeamNameChange = (e) => {
    this.setState({
      teamName: e.target.value
    });
  }
  
  handleTeamNameSubmit = (e) => {
    e.preventDefault();
    let userTeams = createTeam(this.state.teamName);
    this.setState({
      userTeams: userTeams,
      teamName: "",
    });
  }

  changeCurrentTeam = (index) => {
    this.setState({
      currentTeamIndex: index
    })
  }


  render() {
    const { orderedPlayers, players } = this.props;
    const headers = ["GOALKEEPERS", "DEFENDERS", "MIDFIELDERS", "FORWARDS"];
    return (
      <div>
        {
          (this.state.userTeams.length === 0) ? 
          // TODO: create this into a popup
          <div>
            Create a team
            <form onSubmit={this.handleTeamNameSubmit}>
              <label>
                Team name:
                <input type="text" name="teamName" value={this.state.teamName} onChange={this.handleTeamNameChange} />
              </label>
              <input type="submit" value="Submit" />
            </form>
          </div> : 
          // if there are players in the user team, render the table
          <>
            <div style={styles.teamInfo}>
              <div>
                Teams:
                {this.state.userTeams.map((team, index) => {
                  if (index === this.state.currentTeamIndex) {
                    return (
                      <button key={"navbar-" + team["name"]} style={Object.assign({}, styles.teamButton, styles.selectedTeam)} onClick={() => this.changeCurrentTeam(index)}>
                        {team["name"]}
                      </button>
                    )
                  } else {
                    return (
                      <button key={"navbar-" + team["name"]} style={styles.teamButton} onClick={() => this.changeCurrentTeam(index)}>
                        {team["name"]}
                      </button>
                    )
                  }
                })}
              </div>
              <form style={styles.newTeamForm} onSubmit={this.handleTeamNameSubmit}>
                <label>
                  Add New Team
                  <input type="text" name="teamName" value={this.state.teamName} onChange={this.handleTeamNameChange} />
                </label>
                <input type="submit" value="Submit" />
              </form>
            </div>
            <div style={styles.teamSelection}>
              {/* Display the current team selected */}
              {this.state.userTeams[this.state.currentTeamIndex]["players"].map((positionGroup, index) => {
                return (
                  <div key={"Current Team" + headers[index]}>
                    <table>
                      <thead>
                        <tr style={styles.headerRow}>
                          <th style={styles.numberColumn}>Price</th>
                          <th style={styles.numberColumn}>Points</th>
                          <th style={styles.playerColumn}>Name</th>
                          <th>{headers[index]}</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody style={styles.tableBody}>
                        {positionGroup.map((player, index) => {
                          return (
                            <tr key={player["player_id"]} style={index % 2 === 0 ? styles.evenRow : styles.oddRow}>
                              <td>{player["now_cost"]}</td>
                              <td>{player["total_points"]}</td>
                              <th>{player["web_name"]}</th>
                              {/* TODO: Don't put a td inside of a td */}
                              <td>
                                {player["upcoming_fixtures"].map((weekArray, index) => {
                                  return (
                                    <Cell
                                      weekArray={weekArray}
                                      key={`${player["web_name"]}-${index}`}
                                    />
                                  )
                                })}
                              </td>
                              <td style={styles.buttonPadding}>
                                <button style={Object.assign({}, styles.circleButton, styles.red)} id={player["player_id"]} onClick={this.removePlayerFromUserTeam}>
                                  -
                                </button>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                )
              })}
            </div>
            <div style={styles.playerSelectionArea}>
              {orderedPlayers.map((playerList, index) => {
                return (
                  <div key={"playerList" + index}>
                    <div style={styles.playerHeader}>{headers[index]}</div>
                    <table style={styles.tableBody}>
                      <thead style={styles.headerRow}>
                        <tr>
                          <th style={styles.playerColumn}>Name</th>
                          <th style={styles.numberColumn}>Points</th>
                          <th style={styles.numberColumn}>Cost</th>
                          <th style={styles.numberColumn}></th>
                        </tr>
                      </thead>
                      <tbody>
                        {playerList.map((playerId, index) => {
                          return (
                            <tr key={"addPlayer" + playerId} id={"addPlayer" + playerId} style={index % 2 === 0 ? styles.evenRow : styles.oddRow}>
                                <td style={styles.alignLeft}>{players[playerId]["web_name"]}</td>
                                <td>{players[playerId]["total_points"]}</td>
                                <td>{players[playerId]["now_cost"]}</td>
                                <td style={styles.buttonPadding}>
                                  <button style={Object.assign({}, styles.circleButton, styles.green)} id={playerId} onClick={this.addPlayerToUserTeam}>
                                    + 
                                  </button>
                                </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                    
                    
                  </div>
                )
              })}
            </div>
          </>
        }
      </div>
    )
  }
}

export default UserTeam;

const styles = {
  teamInfo: {
    display: "flex",
    justifyContent: "space-between",
    paddingBottom: 0,
    marginBottom: 0,
  },
  newTeamForm: {
    float: "right",
  },
  teamSelection: {
    paddingTop: 0,
    marginTop: 0,
  },
  teamButton: {
    background: "white",
    border: "none",
    cursor:"pointer",
    overflow: "hidden",
    outline:"none",
    marginLeft: "2px",
    height: "100%",
  },
  selectedTeam: {
    background: "silver",
    fontWeight: "bold",
  },
  tableBody: {
    textAlign: "center",
    verticalAlign: "center",
  },
  headerRow: {
    background: "silver",
    height: "30px",
  },
  evenRow: {
    background: "gainsboro",
  },
  oddRow: {
    background: "whitesmoke",
  },
  numberColumn: {
    width: "45px",
  },
  playerColumn: {
    width: "130px",
  },
  buttonPadding: {
    padding: "10px",
  },
  circleButton: {
    height: "20px",
    width: "20px",
    borderRadius: "20px",
    cursor: "pointer",
  },
  red: {
    background: "rgb(247, 166, 166)",
  },
  green: {
    background: "rgb(114, 235, 118)",
  },
  playerHeader: {
    textAlign: "center",
    background: "silver",
    height: "40px",
    paddingTop: "10px",
    fontWeight: "bold",
  },
  playerSelectionArea: {
    marginTop: "50px",
    display: "flex",
    justifyContent: "space-between",
  },
  alignLeft: {
    textAlign: "left",
    paddingLeft: "5px"
  }
}