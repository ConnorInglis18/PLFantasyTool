import React, { Component } from "react";
import PropTypes from "prop-types";
import UserTeamLogin from "./UserTeamLogin.js";

class UserTeam extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { userTeam, onSubmit, background } = this.props;

    let mappedTeam = userTeam.map((player, index) => {
      return (
        <div key={index}>
          {player["web_name"]} {player["team"]}
          {player["next_five_fixtures"].map((fixture, index) => {
            return <div key={index}>{fixture}</div>;
          })}
        </div>
      );
    });

    return userTeam.length === 0 ? (
      <UserTeamLogin onSubmit={onSubmit} />
    ) : (
      <div style={{ background: background }}>{mappedTeam}</div>
    );
  }
}

export default UserTeam;

UserTeam.propTypes = {
  userTeam: PropTypes.array.isRequired,
  onSubmit: PropTypes.func.isRequired
};

/* 
What the data should look like:
[
  {
    "web_name": "name",
    "team": "ARS",
    "all_fixtures": [ // for fixture in all_fixtures, fixture.length will either be 0 (blank gameweek), 1 (normal), 2 (double gameweek)
      [[-1, #1bc020]],
      [[-1, #1bc020]],
      [[-1, #1bc020]],
      [[-1, #1bc020],[23, #FFFFFF]],
      []
      ...
    ],
    "next_five": ?

  }
]
*/
