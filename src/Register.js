import React, { Component } from 'react';

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      first: '',
      last: '',
      username: '',
      password: '',
      userID: '',
      leagueID: '',
    };
  }

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  handleSubmit = event => {
    event.preventDefault();

    const data = {
      first: this.state.first,
      last: this.state.last,
      username: this.state.username,
      password: this.state.password,
      userID: this.state.userID,
      leagueID: this.state.leagueID
    }

    fetch("http://localhost:5000/register", {
      method: "POST",
      body: JSON.stringify(data),
      headers: new Headers({
        "content-type": "application/json"
      })
    })
    .then((response) => {
      console.log(response)
      if (!response.ok) throw Error(response.statusText);
          return response.json();
      })
    .then((data) => {
      console.log(data)
    })
    .catch(error => console.log(error)); // eslint-disable-line no-console 
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Email/Username (use the same email as your FPL email):
          <input type="text" name="username" value={this.state.username} onChange={this.handleChange} />
        </label>
        <br />
        <label>
          Password:
          <input type="password" name="password" value={this.state.password} onChange={this.handleChange} />
        </label>
        <br />
        <label>
          First Name:
          <input type="text" name="first" value={this.state.first} onChange={this.handleChange} />
        </label>
        <br />
        <label>
          Last Name:
          <input type="text" name="last" value={this.state.last} onChange={this.handleChange} />
        </label>
        <br />
        <label>
          userID (from your FPL account):
          <input type="number" name="userID" value={this.state.userID} onChange={this.handleChange} />
        </label>
        <br />
        <label>
          leagueID (from your FPL account):
          <input type="number" name="leagueID" value={this.state.leagueID} onChange={this.handleChange} />
        </label>
        <br />
        <input type="submit" value="Submit" />
      </form>
    );
  }
}

export default Register;