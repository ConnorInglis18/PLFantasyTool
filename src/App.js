import React, { Component } from "react";
import Table from "./Table.js";
import Home from "./Home.js";
import Header from "./Header.js";
import UserTeam from "./UserTeam";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import { fetchData } from './backend/getFormData';
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      defendersDisplay: [],
      attackersDisplay: [],
      players: {},
      orderedPlayers: [],
      upcomingGameweek: 1,
      view: "Home",
    };
  }

  componentDidMount() {
    fetchData().then(res => {
      console.log(res);
      this.setState({
        defendersDisplay: res["defenders_display"],
        attackersDisplay: res["attackers_display"],
        upcomingGameweek: res["upcoming_gameweek"],
        players: res["players"],
        orderedPlayers: res["ordered_players"],
        userTeams: res["user_teams"]
      });
    })
  }

  selectView = (event) => {
    event.preventDefault();
    this.setState({
      view: event.target.title,
    });
  };

  showDisplay = () => {
    const mainFeaturedPost = {
      title: "FPL Scheduling Tool",
      description:
        "This tool shows the goals for and against, rather than the opponent they are playing",
      image: "PL_Banner.jpg",
      imgText: "",
      linkText: "",
    };

    return this.state.view === "Defenders" ? (
      <Table
        display={this.state.defendersDisplay}
        upcomingGameweek={this.state.upcomingGameweek}
        type="DEFENDERS"
      />
    ) : this.state.view === "Attackers" ? (
      <Table
        display={this.state.attackersDisplay}
        upcomingGameweek={this.state.upcomingGameweek}
        type="ATTACKERS"
      />
    ) : this.state.view === "Home" ? (
      <Home post={mainFeaturedPost} refreshData={this.refresh} />
    ) : this.state.view === "Team" ? (
      <UserTeam
        orderedPlayers={this.state.orderedPlayers}
        players={this.state.players}
        defendersDisplay={this.state.defendersDisplay}
        attackersDisplay={this.state.attackersDisplay}
      />
    ) : (
      <div>Error</div>
    );
  };

  renderDesktopScreen = () => {
    const sections = [
      { title: "Home", onClick: this.selectView },
      { title: "Defenders", onClick: this.selectView },
      { title: "Attackers", onClick: this.selectView },
      { title: "Team", onClick: this.selectView }
    ];

    return (
      <React.Fragment>
        <CssBaseline />
        <Container maxWidth="lg">
          <Header title="FPL Tool" sections={sections} />
          {this.showDisplay()}
        </Container>
      </React.Fragment>
    );
  };

  render() {
    return this.renderDesktopScreen();
  }
}

export default App;