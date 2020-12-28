import React, { Component } from "react";
import Table from "./Table.js";
import Home from "./Home.js";
import Header from "./Header.js";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import { loadData } from './backend/getFormData';
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      defendersDisplay: [],
      attackersDisplay: [],
      upcomingGameweek: 1,
      view: "Home",
    };
  }

  componentDidMount() {
    loadData().then(res => {
      this.setState({
        defendersDisplay: res["defenders_display"],
        attackersDisplay: res["attackers_display"],
        upcomingGameweek: res["upcoming_gameweek"]
      });
    });
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
      image: "./PL_Banner.jpg",
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
      <Home post={mainFeaturedPost} />
    ) : (
      <div>Error</div>
    );
  };

  renderDesktopScreen = () => {
    const sections = [
      { title: "Home", onClick: this.selectView },
      { title: "Defenders", onClick: this.selectView },
      { title: "Attackers", onClick: this.selectView },
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