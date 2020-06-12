import React, { Component } from "react";
import Table from "./Table.js";
import Home from "./Home.js";
import Header from "./Header.js";
import Register from "./Register.js";
import UserTeam from "./UserTeam.js";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import PropTypes from "prop-types";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playersDict: null,
      defendersDisplay: [],
      attackersDisplay: [],
      view: "Home",
      isMobile: false,
      userTeam: []
    };
  }

  componentDidMount() {
    this.loadDisplays();
    this.isMobile();
  }

  loadDisplays() {
    const displayUrl = this.props.displayUrl;
    fetch(displayUrl)
      .then(response => {
        if (!response.ok) throw Error(response.statusText);
        return response.json();
      })
      .then(data => {
        this.setState({
          defendersDisplay: data["defenders_display"],
          attackersDisplay: data["attackers_display"]
        });
      })
      .catch(error => console.log(error)); // eslint-disable-line no-console
  }

  isMobile = () => {
    let isMobile =
      typeof window.orientation !== "undefined" ||
      navigator.userAgent.indexOf("IEMobile") !== -1;
    this.setState({
      isMobile: isMobile
    });
  };

  getPlayers = () => {
    let playersDict = {};
    fetch(
      "https://cors-anywhere.herokuapp.com/https://fantasy.premierleague.com/api/bootstrap-static/"
    )
      .then(response => {
        if (!response.ok) throw Error(response.statusText);
        return response.json();
      })
      .then(data => {
        const players = data.elements; // eslint-disable-next-line
        for (const player of players) {
          playersDict[player["id"]] = player["web_name"];
        }
      })
      .catch(error => console.log(error)); // eslint-disable-line no-console

    return playersDict;
  };

  selectView = event => {
    event.preventDefault();
    this.setState({
      view: event.target.title
    });
  };

  handleGetUserTeamSubmit = event => {
    event.preventDefault();

    const playerData = [
      {
        web_name: "Henderson",
        team: "SHE",
        full_fixtures: [
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          34,
          23,
          34,
          12,
          23,
          34,
          23,
          33,
          24,
          26,
          28,
          29,
          19
        ],
        next_five_fixtures: [34, 23, 34, 12, 23]
      },
      {
        web_name: "Henderson 2",
        team: "SHE",
        full_fixtures: [
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          34,
          23,
          34,
          12,
          23,
          34,
          23,
          33,
          24,
          26,
          28,
          29,
          19
        ],
        next_five_fixtures: [34, 23, 34, 12, 23]
      },
      {
        web_name: "Henderson 3",
        team: "SHE",
        full_fixtures: [
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          34,
          23,
          34,
          12,
          23,
          34,
          23,
          33,
          24,
          26,
          28,
          29,
          19
        ],
        next_five_fixtures: [34, 23, 34, 12, 23]
      },
      {
        web_name: "Henderson 4",
        team: "SHE",
        full_fixtures: [
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          34,
          23,
          34,
          12,
          23,
          34,
          23,
          33,
          24,
          26,
          28,
          29,
          19
        ],
        next_five_fixtures: [34, 23, 34, 12, 23]
      },
      {
        web_name: "Henderson 5",
        team: "SHE",
        full_fixtures: [
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          34,
          23,
          34,
          12,
          23,
          34,
          23,
          33,
          24,
          26,
          28,
          29,
          19
        ],
        next_five_fixtures: [34, 23, 34, 12, 23]
      },
      {
        web_name: "Henderson 6",
        team: "SHE",
        full_fixtures: [
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          34,
          23,
          34,
          12,
          23,
          34,
          23,
          33,
          24,
          26,
          28,
          29,
          19
        ],
        next_five_fixtures: [34, 23, 34, 12, 23]
      }
    ];

    this.setState({
      userTeam: playerData
    });

    // const data = {
    //   username: event.target.username.value,
    //   password: event.target.password.value
    // };
    // console.log("Fetching");
    // fetch("http://localhost:5000/getTeam", {
    //   method: "POST",
    //   body: JSON.stringify(data),
    //   credentials: "same-origin",
    //   headers: new Headers({
    //     "content-type": "application/json"
    //   })
    // })
    //   .then(response => {
    //     console.log(response);
    //     if (!response.ok) throw Error(response.statusText);
    //     return response.json();
    //   })
    //   .then(data => {
    //     this.setState(
    //       {
    //         team: data["team"]
    //       },
    //       () => console.log(this.state.team)
    //     );
    //   })
    //   .catch(error => console.log(error)); // eslint-disable-line no-console
  };

  showDisplay = () => {
    const {
      view,
      gfColors,
      gaColors,
      defendersDisplay,
      attackersDisplay,
      userTeam
    } = this.state;

    const mainFeaturedPost = {
      title: "FPL Scheduling Tool",
      description:
        "This tool shows the goals for and against, rather than the opponent they are playing",
      image: "./PL_Banner.jpg",
      imgText: "",
      linkText: ""
    };

    return view === "Defenders" ? (
      <Table colors={gfColors} display={defendersDisplay} />
    ) : view === "Attackers" ? (
      <Table colors={gaColors} display={attackersDisplay} />
    ) : view === "Home" ? (
      <Home post={mainFeaturedPost} />
    ) : view === "Register" ? (
      <Register />
    ) : view === "My Team" ? (
      <UserTeam
        userTeam={userTeam}
        onSubmit={this.handleGetUserTeamSubmit}
        background={"#1bc020"}
      />
    ) : (
      <div>Loading...</div>
    );
  };

  renderDesktopScreen = () => {
    const sections = [
      { title: "Home", onClick: this.selectView },
      { title: "Register", onClick: this.selectView },
      { title: "My Team", onClick: this.selectView },
      { title: "Defenders", onClick: this.selectView },
      { title: "Attackers", onClick: this.selectView }
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

  renderMobileScreen = () => {
    return <div>Mobile site being developed {this.renderDesktopScreen()}</div>;
  };

  render() {
    // return this.state.isMobile ?
    //   this.renderMobileScreen() :
    //   this.renderDesktopScreen()
    return this.renderDesktopScreen();
  }
}

export default App;

App.propTypes = {
  displayUrl: PropTypes.string.isRequired
};
