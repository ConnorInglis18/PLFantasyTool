import React, { Component } from "react";
import PropTypes from "prop-types";

class UserTeamLogin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: ""
    };
  }

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  render() {
    return (
      <form onSubmit={this.props.onSubmit}>
        <label>
          PL Email:
          <input
            type="text"
            name="username"
            value={this.state.username}
            onChange={this.handleChange}
          />
        </label>
        <br />
        <label>
          FPL Password:
          <input
            type="password"
            name="password"
            value={this.state.password}
            onChange={this.handleChange}
          />
        </label>
        <br />
        <input type="submit" value="Get Team" />
      </form>
    );
  }
}

export default UserTeamLogin;

UserTeamLogin.propTypes = {
  onSubmit: PropTypes.func.isRequired
};
