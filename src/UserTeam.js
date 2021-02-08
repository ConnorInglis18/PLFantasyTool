import React, { Component } from "react";
import Cell from './Cell';
import { TEAM_DATA_KEY } from "./backend/consts"
import { withTheme } from "@material-ui/core";
import { grey } from "@material-ui/core/colors";
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
    console.log(newTeam);
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
    const { players, defendersDisplay, attackersDisplay } = this.props;
    const allPlayersArray = Object.values(players).sort((a, b) => a["element_type"] - b["element_type"] || b["total_points"] - a["total_points"]);
    let userTeamDisplay = [[], [], [], []] // 4 arrays for 4 player types (goalkeepers = 1 / go in 0th array);
    if (this.state.userTeams.length && defendersDisplay.length) {
      let userTeam = this.state.userTeams[this.state.currentTeamIndex];
      console.log(userTeam);
      userTeam["players"].forEach(playerId => {
        let playerDisplay = {}
        playerDisplay["player_id"] = playerId
        playerDisplay["web_name"] = players[playerId]["web_name"];
        let teamId = players[playerId]["team_id"];
        playerDisplay["team_id"] = teamId;
        playerDisplay["total_points"] = players[playerId]["total_points"];
        playerDisplay["now_cost"] = players[playerId]["now_cost"];
        console.log(players[playerId]);
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
                  {headers[index]}
                  <table>
                    <tbody>
                      {positionGroup.map((player) => {
                        return (
                          <tr key={player["player_id"]}>
                            <td style={{width: "40px"}}>{player["now_cost"]}</td>
                            <td style={{width: "40px"}}>{player["total_points"]}</td>
                            <th style={{width: "110px"}}>{player["web_name"]}</th>
                            {player["upcoming_fixtures"].map((weekArray, index) => {
                              return (
                                <Cell
                                  weekArray={weekArray}
                                  key={`${player["web_name"]}-${index}`}
                                />
                              )
                            })}
                            <td>
                              <button style={{marginLeft: "20px", background: "rgb(247, 166, 166)", height: "20px", width: "20px", borderRadius: "20px"}} id={player["player_id"]} onClick={this.removePlayerFromUserTeam}>
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
          {allPlayersArray.map((player) => {
            return (
              <div key={"AllPlayers-" + player["player_id"]}>
                <button style={{background: "rgb(114, 235, 118)", height: "20px", width: "20px", borderRadius: "20px"}} id={player["player_id"]} onClick={this.addPlayerToUserTeam}>
                + 
                </button>
                {`   ${player["web_name"]}      Total Points: ${player["total_points"]}`}
              </div>
            )
          })}
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
    background: "lightgrey",
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
    background: "lightgrey"
  }
}