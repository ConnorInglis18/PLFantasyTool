import React, { Component } from "react";
import Table from "./Table.js";
import Home from "./Home.js";
import Header from "./Header.js";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fixtures: null,
      gf: [],
      ga: [],
      defendersDisplay: [],
      attackersDisplay: [],
      gfColors: [],
      gaColors: [],
      view: "Home",
    };
  }

  componentDidMount() {
    this.loadData();
  }

  loadData() {
    const getScheduleResults = this.getSchedule();
    const fixtures = getScheduleResults["fixtures"];
    const gf = getScheduleResults["gf"];
    const ga = getScheduleResults["ga"];
    const defendersDisplay = getScheduleResults["defendersDisplay"];
    const attackersDisplay = getScheduleResults["attackersDisplay"];
    const gfColors = getScheduleResults["gfColors"];
    const gaColors = getScheduleResults["gaColors"];
    this.setState({
      fixtures: fixtures,
      gf: gf,
      ga: ga,
      defendersDisplay: defendersDisplay,
      attackersDisplay: attackersDisplay,
      gfColors: gfColors,
      gaColors: gaColors,
    });
  }

  // takes in a game and the previous info, which contains
  // fixtures, gf, ga
  // fixtures - dictionary of team keys, value is array of size 38 (for each match)
  // gf, ga - dictionary of team keys, value is that teams gf and ga
  addGameInfo = (game, info) => {
    const homeTeam = teamCodes[game["team_h"]];
    const awayTeam = teamCodes[game["team_a"]];
    const isFinished = game["finished"];
    // if a match is postponed, the event will be null. We only want to add games that are being played
    if (game["event"] != null) {
      // gameweeks are 1-indexed so -1 is used to index into arrray's
      const gameweek = parseInt(game["event"]) - 1;
      if (info["fixtures"][homeTeam][gameweek] === null) {
        info["fixtures"][homeTeam][gameweek] = [
          { opp: awayTeam, isFinished: isFinished },
        ];
      } else {
        // accounts for double gameweeks
        info["fixtures"][homeTeam][gameweek] = [
          info["fixtures"][homeTeam][gameweek][0],
          { opp: awayTeam, isFinished: isFinished },
        ];
      }
      if (info["fixtures"][awayTeam][gameweek] === null) {
        info["fixtures"][awayTeam][gameweek] = [
          { opp: homeTeam, isFinished: isFinished },
        ];
      } else {
        // accounts for double gameweeks
        info["fixtures"][awayTeam][gameweek] = [
          info["fixtures"][awayTeam][gameweek][0],
          { opp: homeTeam, isFinished: isFinished },
        ];
      }
      // if the current game has been played, add the scores to the two team's
      if (isFinished) {
        const homeTeamScore = game["team_h_score"];
        const awayTeamScore = game["team_a_score"];
        info["gf"][homeTeam] += homeTeamScore;
        info["ga"][homeTeam] += awayTeamScore;
        info["gf"][awayTeam] += awayTeamScore;
        info["ga"][awayTeam] += homeTeamScore;
      }
    }
    return info;
  };

  getSchedule = () => {
    let info = {
      fixtures: {
        ARS: new Array(38).fill(null),
        AVL: new Array(38).fill(null),
        BHA: new Array(38).fill(null),
        BUR: new Array(38).fill(null),
        CHE: new Array(38).fill(null),
        CRY: new Array(38).fill(null),
        EVE: new Array(38).fill(null),
        FUL: new Array(38).fill(null),
        LEI: new Array(38).fill(null),
        LEE: new Array(38).fill(null),
        LIV: new Array(38).fill(null),
        MCI: new Array(38).fill(null),
        MUN: new Array(38).fill(null),
        NEW: new Array(38).fill(null),
        SHU: new Array(38).fill(null),
        SOU: new Array(38).fill(null),
        TOT: new Array(38).fill(null),
        WBA: new Array(38).fill(null),
        WHU: new Array(38).fill(null),
        WOL: new Array(38).fill(null),
      },
      gf: {
        ARS: 0,
        AVL: 0,
        BHA: 0,
        BUR: 0,
        CHE: 0,
        CRY: 0,
        EVE: 0,
        FUL: 0,
        LEI: 0,
        LEE: 0,
        LIV: 0,
        MCI: 0,
        MUN: 0,
        NEW: 0,
        SHU: 0,
        SOU: 0,
        TOT: 0,
        WBA: 0,
        WHU: 0,
        WOL: 0,
      },
      ga: {
        ARS: 0,
        AVL: 0,
        BHA: 0,
        BUR: 0,
        CHE: 0,
        CRY: 0,
        EVE: 0,
        FUL: 0,
        LEI: 0,
        LEE: 0,
        LIV: 0,
        MCI: 0,
        MUN: 0,
        NEW: 0,
        SHU: 0,
        SOU: 0,
        TOT: 0,
        WBA: 0,
        WHU: 0,
        WOL: 0,
      },
      defendersDisplay: {},
      attackersDisplay: {},
      gfColors: [],
      gaColors: [],
    };
    fetch(
      "https://cors-anywhere.herokuapp.com/https://fantasy.premierleague.com/api/fixtures/"
    )
      .then((response) => {
        if (!response.ok) throw Error(response.statusText);
        return response.json();
      })
      .then((data) => {
        // eslint-disable-next-line
        for (const game of data) {
          info = this.addGameInfo(game, info);
        }
        this.createAttackersDisplay(info);
        this.createDefendersDisplay(info);
        this.createColorBrackets(info);
        this.setState({
          gfColors: info["gfColors"],
          gaColors: info["gaColors"],
        });
      })
      .catch((error) => console.log(error)); // eslint-disable-line no-console
    return info;
  };

  canMakeSubsets = (arr, k, inc) => {
    let subsets = 0;
    let largestVal = arr[0] + inc;
    for (let i = 0; i < arr.length; ++i) {
      if (arr[i] > largestVal) {
        subsets += 1;
        largestVal = arr[i] + inc;
      }
    }
    return subsets < k;
  };

  makeSubsets = (arr, inc) => {
    let subsets = [];
    let subset = [];
    subset.push(arr[0]);
    subset.push(arr[0] + inc);
    subsets.push(subset);
    let largestVal = arr[0] + inc;
    for (let i = 0; i < arr.length; ++i) {
      if (arr[i] > largestVal) {
        subset = [];
        subset.push(arr[i]);
        subset.push(arr[i] + inc);
        subsets.push(subset);
        largestVal = arr[i] + inc;
      }
    }
    return subsets;
  };

  createColorBrackets = (info) => {
    const numColors = 7;
    // gf colors
    const gf = Object.values(info["gf"]).sort((a,b) => {return a-b});
    // get max and min of gf array
    const maxGF = Math.max.apply(null, gf);
    const minGF = Math.min.apply(null, gf);
    let gfRange = Math.ceil((maxGF - minGF) / numColors) + 1;
    while (this.canMakeSubsets(gf, numColors, gfRange - 1)) {
      gfRange -= 1;
    }
    info["gfColors"] = this.makeSubsets(gf, gfRange);
    // reverse the ordering to make the colors easier to handle
    let left = 0;
    let right = info["gfColors"].length;
    while (left < right) {
      let tmp = info["gfColors"][left];
      info["gfColors"][left] = info["gfColors"][right];
      info["gfColors"][right] = tmp;
      ++left;
      --right;
    }
    // ga colors
    const ga = Object.values(info["ga"]).sort((a,b) => {return a-b});
    const maxGA = Math.max.apply(null, ga);
    const minGA = Math.min.apply(null, ga);
    console.log(maxGA)
    console.log(minGA)
    let gaRange = Math.ceil((maxGA - minGA) / numColors) + 1;
    while (this.canMakeSubsets(ga, numColors, gaRange - 1)) {
      gaRange -= 1;
    }
    info["gaColors"] = this.makeSubsets(ga, gaRange);
    console.log(info["gaColors"])
    // make sure none of the ranges are undefined which can occur if 6 or less colors are needed to cover the entire range
    for (let i = info["gfColors"].length; i >= 0; --i) {
      if (info["gfColors"][i] === undefined) {
        info["gfColors"].splice(i, 1);
      }
    }
    for (let i = info["gaColors"].length; i >= 0; --i) {
      if (info["gaColors"][i] === undefined) {
        info["gaColors"].splice(i, 1);
      }
    }
    console.log(info["gfColors"])
  };

  createDefendersDisplay = (info) => {
    const fixtures = info["fixtures"];
    const defendersDisplay = info["defendersDisplay"];
    const gf = info["gf"];
    Object.keys(fixtures).forEach((team) => {
      defendersDisplay[team] = new Array(38);
      for (let week = 0; week < 38; ++week) {
        if (fixtures[team][week] === null) {
          defendersDisplay[team][week] = -1;
        } else if (fixtures[team][week].length > 1) {
          let game1 = fixtures[team][week][0]["isFinished"]
            ? -1
            : gf[fixtures[team][week][0]["opp"]];
          let game2 = fixtures[team][week][1]["isFinished"]
            ? -1
            : gf[fixtures[team][week][1]["opp"]];
          defendersDisplay[team][week] = game1 + " " + game2;
        } else {
          defendersDisplay[team][week] = fixtures[team][week][0]["isFinished"]
            ? -1
            : gf[fixtures[team][week][0]["opp"]];
        }
      }
    });
  };

  createAttackersDisplay = (info) => {
    const fixtures = info["fixtures"];
    const attackersDisplay = info["attackersDisplay"];
    const ga = info["ga"];
    Object.keys(fixtures).forEach((team) => {
      attackersDisplay[team] = new Array(38);
      for (let week = 0; week < 38; ++week) {
        if (fixtures[team][week] === null) {
          attackersDisplay[team][week] = -1;
        } else if (fixtures[team][week].length > 1) {
          let game1 = fixtures[team][week][0]["isFinished"]
            ? -1
            : ga[fixtures[team][week][0]["opp"]];
          let game2 = fixtures[team][week][1]["isFinished"]
            ? -1
            : ga[fixtures[team][week][1]["opp"]];
          attackersDisplay[team][week] = game1 + " " + game2;
        } else {
          attackersDisplay[team][week] = fixtures[team][week][0]["isFinished"]
            ? -1
            : ga[fixtures[team][week][0]["opp"]];
        }
      }
    });
  };

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
        colors={this.state.gfColors}
        display={this.state.defendersDisplay}
      />
    ) : this.state.view === "Attackers" ? (
      <Table
        colors={this.state.gaColors}
        display={this.state.attackersDisplay}
        />
    ) : this.state.view === "Home" ? (
      <Home post={mainFeaturedPost} />
    ) : (
      <div>Loading...</div>
    );
  };

  renderDesktopScreen = () => {
    const sections = [
      { title: "Home", onClick: this.selectView },
      { title: "Defenders", onClick: this.selectView },
      { title: "Attackers", onClick: this.selectView },
    ];

    console.log(this.state.defendersDisplay)

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

let teamCodes = {
  1: "ARS",
  2: "AVL",
  3: "BHA",
  4: "BUR",
  5: "CHE",
  6: "CRY",
  7: "EVE",
  8: "FUL",
  9: "LEI",
  10: "LEE",
  11: "LIV",
  12: "MCI",
  13: "MUN",
  14: "NEW",
  15: "SHU",
  16: "SOU",
  17: "TOT",
  18: "WBA",
  19: "WHU",
  20: "WOL",
};
