import React, { Component } from "react";
import Cell from './Cell';
import { TEAM_DATA_KEY } from "./backend/consts"
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
    // get the userTeam from localStorage and set it as current state
    let userTeams = localStorage.getItem(TEAM_DATA_KEY);
    if (userTeams !== null) {
      userTeams = JSON.parse(userTeams);
      this.setState({
        userTeams: userTeams
      })
    }
  }

  addPlayerToUserTeam = (e) => {
    e.preventDefault();
    let userTeams = this.state.userTeams;
    const currentTeam = userTeams[this.state.currentTeamIndex];
    const index = currentTeam["players"].indexOf(e.target.id);
    if (index === -1) { // make sure the player does not already exist in the current team
      currentTeam["players"].push(e.target.id);
    }
    userTeams[this.state.currentTeamIndex] = currentTeam
    this.setState({
      userTeams: userTeams
    });
    localStorage.setItem(TEAM_DATA_KEY, JSON.stringify(userTeams));
  }

  removePlayerFromUserTeam = (e) => {
    e.preventDefault();
    let userTeams = this.state.userTeams;
    let currentTeam = userTeams[this.state.currentTeamIndex];
    const index = currentTeam["players"].indexOf(e.target.id);
    if (index !== -1) { // make sure the item exists in list (it should)
      currentTeam["players"].splice(index, 1); // remove element
    }
    userTeams[this.state.currentTeamIndex] = currentTeam;
    this.setState({
      userTeams: userTeams
    });
    localStorage.setItem(TEAM_DATA_KEY, JSON.stringify(userTeams));
  }

  handleTeamNameChange = (e) => {
    this.setState({
      teamName: e.target.value
    });
  }
  
  handleTeamNameSubmit = (e) => {
    e.preventDefault();
    let userTeams = this.state.userTeams;
    let newTeam = {
      name: this.state.teamName,
      players: []
    };
    // console.log(newTeam);
    userTeams.push(newTeam);
    this.setState({
      userTeams: userTeams,
      teamName: ""
    })
    localStorage.setItem(TEAM_DATA_KEY, JSON.stringify(userTeams));
  }

  changeCurrentTeam = (index) => {
    this.setState({
      currentTeamIndex: index
    })
  }


  render() {
    const { orderedPlayers, players, defendersDisplay, attackersDisplay } = this.props;
    // TODO: Move this to the backend
    let userTeamDisplay = [[], [], [], []] // 4 arrays for 4 player types (goalkeepers = 1 / go in 0th array);
    if (this.state.userTeams.length && defendersDisplay.length) {
      let userTeam = this.state.userTeams[this.state.currentTeamIndex];
      userTeam["players"].forEach(playerId => {
        let playerDisplay = {}
        playerDisplay["player_id"] = playerId
        playerDisplay["web_name"] = players[playerId]["web_name"];
        let teamId = players[playerId]["team_id"];
        playerDisplay["team_id"] = teamId;
        playerDisplay["total_points"] = players[playerId]["total_points"];
        playerDisplay["now_cost"] = players[playerId]["now_cost"];
        // TODO: Add jerseys and team logo
        const element_type = players[playerId]["element_type"];
        if (element_type <= 2) { // defender or goalie
          playerDisplay["upcoming_fixtures"] = defendersDisplay[teamId-1]["upcoming_fixtures"]; // -1 b/c pl uses 1-index
        } else { // midfielder or forward
          playerDisplay["upcoming_fixtures"] = attackersDisplay[teamId-1]["upcoming_fixtures"]; // -1 b/c pl uses 1-index
        }
        // put the player in the proper position array (goalie element type 1 goes in 0th indexed array)
        userTeamDisplay[element_type-1].push(playerDisplay); // -1 b/c pl uses 1-index
      });
    }

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
                      // TODO: Fix styling
                      <button key={"navbar-" + team["name"]} style={Object.assign({}, styles.teamButton, styles.selectedTeam)} onClick={() => this.changeCurrentTeam(index)}>
                        {team["name"]}
                      </button>
                    )
                  } else {
                    return (
                      // TODO: Fix styling
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
              {userTeamDisplay.map((positionGroup, index) => {
                return (
                  <div key={headers[index]}>
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
                        <th style={styles.playerColumn}>Name</th>
                        <th style={styles.numberColumn}>Points</th>
                        <th style={styles.numberColumn}>Cost</th>
                        <th style={styles.numberColumn}></th>
                      </thead>
                      {playerList.map((playerId, index) => {
                      return (
                        <tbody style={index % 2 === 0 ? styles.evenRow : styles.oddRow}>
                          <td style={styles.alignLeft}>{players[playerId]["web_name"]}</td>
                          <td>{players[playerId]["total_points"]}</td>
                          <td>{players[playerId]["now_cost"]}</td>
                          <td style={styles.buttonPadding}>
                            <button style={Object.assign({}, styles.circleButton, styles.green)} id={playerId} onClick={this.addPlayerToUserTeam}>
                              + 
                            </button></td>
                        </tbody>
                      )
                    })}
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