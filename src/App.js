import React, { Component } from 'react';
import Table from './Table.js';
import Home from './Home.js';
import Header from './Header.js';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      fixtures: null,
      gf: [],
      ga: [],
      playersDict: null,
      defendersDisplay: [],
      attackersDisplay: [],
      gfColors: [],
      gaColors: [],
      view: "Home",
      isMobile: false,
    }
  }


  componentDidMount() {
    this.loadData()
    this.isMobile()
  }

  loadData() {
    const getPlayersResults = this.getPlayers()
    const getScheduleResults = this.getSchedule()
    const fixtures = getScheduleResults["fixtures"]
    const gf = getScheduleResults["gf"]
    const ga = getScheduleResults["ga"]
    const defendersDisplay = getScheduleResults["defendersDisplay"]
    const attackersDisplay = getScheduleResults["attackersDisplay"]
    const gfColors = getScheduleResults["gfColors"]
    const gaColors = getScheduleResults["gaColors"]
    this.setState({
      playersDict: getPlayersResults,
      fixtures: fixtures,
      gf: gf,
      ga: ga,
      defendersDisplay: defendersDisplay,
      attackersDisplay: attackersDisplay,
      gfColors: gfColors,
      gaColors: gaColors,
    })
  }

  isMobile = () => {
    let isMobile = (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
    this.setState({
      isMobile: isMobile,
    })
  }

  getPlayers = () => {
    let playersDict = {}
    fetch("https://cors-anywhere.herokuapp.com/https://fantasy.premierleague.com/api/bootstrap-static/")
    .then((response) => {
      if (!response.ok) throw Error(response.statusText);
          return response.json();
      })
    .then((data) => {
      const players = data.elements // eslint-disable-next-line
      for(const player of players) {
        playersDict[player["id"]] = player["web_name"]
      }
    })
    .catch(error => console.log(error)); // eslint-disable-line no-console 
    
    return playersDict
  }

  // takes in a game and the previous info, which contains
  // fixtures, gf, ga
  // fixtures - dictionary of team keys, value is array of size 38 (for each match)
  // gf, ga - dictionary of team keys, value is that teams gf and ga
  addGameInfo = (game, info) => {
    const homeTeam = teamCodes[game["team_h"]]
    const awayTeam = teamCodes[game["team_a"]]
    const isFinished = game["finished"]
    // if a match is postponed, the event will be null. We only want to add games that are being played
    if (game["event"] != null) {
      // gameweeks are 1-indexed so -1 is used to index into arrray's
      const gameweek = parseInt(game["event"])-1
      if (info["fixtures"][homeTeam][gameweek] === null) {
        info["fixtures"][homeTeam][gameweek] = [{"opp": awayTeam, "isFinished": isFinished}]
      } else { // accounts for double gameweeks
        info["fixtures"][homeTeam][gameweek] = [info["fixtures"][homeTeam][gameweek][0], {"opp": awayTeam, "isFinished": isFinished}]
      }
      if (info["fixtures"][awayTeam][gameweek] === null) {
        info["fixtures"][awayTeam][gameweek] = [{"opp": homeTeam, "isFinished": isFinished}]
      } else { // accounts for double gameweeks
        info["fixtures"][awayTeam][gameweek] = [info["fixtures"][awayTeam][gameweek][0], {"opp": homeTeam, "isFinished": isFinished}]
      }
      // if the current game has been played, add the scores to the two team's
      if(isFinished) {
        const homeTeamScore = game["team_h_score"]
        const awayTeamScore = game["team_a_score"]
        info["gf"][homeTeam] += homeTeamScore
        info["ga"][homeTeam] += awayTeamScore
        info["gf"][awayTeam] += awayTeamScore
        info["ga"][awayTeam] += homeTeamScore
      }
    }
    return info
  }

  getSchedule = () => {
    let info = {
      fixtures: {
        "ARS": new Array(38).fill(null),
        "AVL": new Array(38).fill(null),
        "BOU": new Array(38).fill(null),
        "BHA": new Array(38).fill(null),
        "BUR": new Array(38).fill(null),
        "CHE": new Array(38).fill(null),
        "CRY": new Array(38).fill(null),
        "EVE": new Array(38).fill(null),
        "LEI": new Array(38).fill(null),
        "LIV": new Array(38).fill(null),
        "MCY": new Array(38).fill(null),
        "MUN": new Array(38).fill(null),
        "NEW": new Array(38).fill(null),
        "NOR": new Array(38).fill(null),
        "SHE": new Array(38).fill(null),
        "SOU": new Array(38).fill(null),
        "TOT": new Array(38).fill(null),
        "WAT": new Array(38).fill(null),
        "WHU": new Array(38).fill(null),
        "WOL": new Array(38).fill(null),
      },
      gf: {
        "ARS": 0,
        "AVL": 0,
        "BOU": 0,
        "BHA": 0,
        "BUR": 0,
        "CHE": 0,
        "CRY": 0,
        "EVE": 0,
        "LEI": 0,
        "LIV": 0,
        "MCY": 0,
        "MUN": 0,
        "NEW": 0,
        "NOR": 0,
        "SHE": 0,
        "SOU": 0,
        "TOT": 0,
        "WAT": 0,
        "WHU": 0,
        "WOL": 0
      },
      ga: {
        "ARS": 0,
        "AVL": 0,
        "BOU": 0,
        "BHA": 0,
        "BUR": 0,
        "CHE": 0,
        "CRY": 0,
        "EVE": 0,
        "LEI": 0,
        "LIV": 0,
        "MCY": 0,
        "MUN": 0,
        "NEW": 0,
        "NOR": 0,
        "SHE": 0,
        "SOU": 0,
        "TOT": 0,
        "WAT": 0,
        "WHU": 0,
        "WOL": 0
      },
      defendersDisplay: {},
      attackersDisplay: {},
      gfColors: [],
      gaColors: [],
    }
    fetch("https://cors-anywhere.herokuapp.com/https://fantasy.premierleague.com/api/fixtures/")
    .then((response) => {
      if (!response.ok) throw Error(response.statusText);
          return response.json();
      })
    .then((data) => { // eslint-disable-next-line
      for(const game of data) {
        info = this.addGameInfo(game, info);
      }
      this.createAttackersDisplay(info)
      this.createDefendersDisplay(info)
      this.createColorBrackets(info)
      this.setState({
        gfColors: info["gfColors"],
        gaColors: info["gaColors"],
      })
    })
    .catch(error => console.log(error)); // eslint-disable-line no-console
    return info;
  }

  canMakeSubsets = (arr, k, inc) => {
    let subsets = 0
    let largestVal = arr[0] + inc
    for (let i = 0; i < arr.length; ++i) {
      if (arr[i] > largestVal) {
        subsets += 1
        largestVal = arr[i] + inc
      }
    }
    return subsets < k
  }

  makeSubsets = (arr, inc) => {
    let subsets = []
    let subset = []
    subset.push(arr[0])
    subset.push(arr[0]+inc)
    subsets.push(subset)
    let largestVal = arr[0] + inc
    for (let i = 0; i < arr.length; ++i) {
      if (arr[i] > largestVal) {
        subset = []
        subset.push(arr[i])
        subset.push(arr[i]+inc)
        subsets.push(subset)
        largestVal = arr[i] + inc
      }
    }
    return subsets
  }

  createColorBrackets = (info) => {
    const numColors = 5
    // gf colors
    const gf = Object.values(info["gf"]).sort()
    // get max and min of gf array
    const maxGF = Math.max.apply(null, gf)
    const minGF = Math.min.apply(null, gf)
    let gfRange = Math.ceil((maxGF - minGF) / numColors) + 1
    while (this.canMakeSubsets(gf, numColors, gfRange-1)) {
      gfRange -= 1
    }
    info["gfColors"] = this.makeSubsets(gf, gfRange)
    // reverse the ordering to make the colors easier to handle
    let tmp = info["gfColors"][0]
    info["gfColors"][0] = info["gfColors"][4];
    info["gfColors"][4] = tmp;
    tmp = info["gfColors"][1]
    info["gfColors"][1] = info["gfColors"][3];
    info["gfColors"][3] = tmp;
    // // ga colors
    const ga = Object.values(info["ga"]).sort()
    const maxGA = Math.max.apply(null, ga)
    const minGA = Math.min.apply(null, ga)
    let gaRange = Math.ceil((maxGA - minGA) / numColors) + 1
    while (this.canMakeSubsets(ga, numColors, gaRange-1)) {
      gaRange -= 1
    }
    info["gaColors"] = this.makeSubsets(ga, gaRange)
  }

  createDefendersDisplay = (info) => {
    const fixtures = info["fixtures"]
    const defendersDisplay = info["defendersDisplay"]
    const gf = info["gf"]
    Object.keys(fixtures).forEach(team => {
      defendersDisplay[team] = new Array(38)
      for (let week = 0; week < 38; ++week) {
        if (fixtures[team][week] === null) {
          defendersDisplay[team][week] = -1
        }
        else if (fixtures[team][week].length > 1) {
          let game1 = fixtures[team][week][0]["isFinished"] ? -1 : gf[fixtures[team][week][0]["opp"]]
          let game2 = fixtures[team][week][1]["isFinished"] ? -1 : gf[fixtures[team][week][1]["opp"]]
          defendersDisplay[team][week] = game1 + " " + game2
        }
        else {
          defendersDisplay[team][week] = fixtures[team][week][0]["isFinished"] ? -1 : gf[fixtures[team][week][0]["opp"]]
        }
      }
    })
  }

  createAttackersDisplay = (info) => {
    const fixtures = info["fixtures"]
    const attackersDisplay = info["attackersDisplay"]
    const ga = info["ga"]
    Object.keys(fixtures).forEach(team => {
      attackersDisplay[team] = new Array(38)
      for (let week = 0; week < 38; ++week) {
        if (fixtures[team][week] === null) {
          attackersDisplay[team][week] = -1
        }
        else if (fixtures[team][week].length > 1) {
          let game1 = fixtures[team][week][0]["isFinished"] ? -1 : ga[fixtures[team][week][0]["opp"]]
          let game2 = fixtures[team][week][1]["isFinished"] ? -1 : ga[fixtures[team][week][1]["opp"]]
          attackersDisplay[team][week] = game1 + " " + game2
        }
        else {
          attackersDisplay[team][week] = fixtures[team][week][0]["isFinished"] ? -1 : ga[fixtures[team][week][0]["opp"]]
        }
      }
    })
  }

  showDefenders = (e) => {
    this.setState({
      view: "Defenders",
    })
  }

  showAttackers = (e) => {
    this.setState({
      view: "Attackers",
    })
  }
  
  showHome = (e) => {
    this.setState({
      view: "Home",
    })
  }

  showDisplay = () => {
    const mainFeaturedPost = {
      title: 'FPL Scheduling Tool',
      description:
        "This tool shows the goals for and against, rather than the opponent they are playing",
      image: './PL_Banner.jpg',
      imgText: '',
      linkText: '',
    };

    return this.state.view === "Defenders" ?
      (<Table colors={this.state.gfColors} display={this.state.defendersDisplay} />) :
      this.state.view === "Attackers" ?
        (<Table colors={this.state.gaColors} display={this.state.attackersDisplay} />) :
        this.state.view === "Home" ?
        (<Home post={mainFeaturedPost}/>) :
        (<div>Loading...</div>)
  }

  renderDesktopScreen = () => {
    const sections = [
      { title: 'Home', onClick: this.showHome },
      { title: 'Defenders', onClick: this.showDefenders },
      { title: 'Attackers', onClick: this.showAttackers },
    ];

    return (
      <React.Fragment>
        <CssBaseline />
        <Container maxWidth="lg">
          <Header title="FPL Tool" sections={sections}/>
          {this.showDisplay()}
        </Container>
      </React.Fragment>
    )
  }

  renderMobileScreen = () => {
    return (<div>Mobile site being developed {this.renderDesktopScreen()}</div>)
  }

  render () {
    return this.state.isMobile ?
      this.renderMobileScreen() :
      this.renderDesktopScreen()
  }
}

export default App;

let teamCodes = {
  1: "ARS",
  2: "AVL",
  3: "BOU",
  4: "BHA",
  5: "BUR",
  6: "CHE",
  7: "CRY",
  8: "EVE",
  9: "LEI",
  10: "LIV",
  11: "MCY",
  12: "MUN",
  13: "NEW",
  14: "NOR",
  15: "SHE",
  16: "SOU",
  17: "TOT",
  18: "WAT",
  19: "WHU",
  20: "WOL"
}