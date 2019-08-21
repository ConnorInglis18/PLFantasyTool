import React, { Component } from 'react';
import './App.css';
import { all } from 'q';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      fixtures: null,
      oppGF: null,
      oppGA: null,
      gf: null,
      ga: null,
      playersDict: null,
    }
  }

  componentDidMount() {
    // const getPlayersResults = this.getPlayers()
    // const getScheduleResults = this.getSchedule()
    // const fixtures = getScheduleResults["fixtures"]
    // const oppGF = getScheduleResults["oppGF"]
    // const oppGA = getScheduleResults["oppGA"]
    // const gf = getScheduleResults["gf"]
    // const ga = getScheduleResults["ga"]
    // this.setState({
    //   playersDict: getPlayersResults,
    //   fixtures: fixtures,
    //   oppGF: oppGF,
    //   oppGA: oppGA,
    //   gf: gf,
    //   ga: ga
    // })
  }

  getPlayers = () => {
    let playersDict = {}
    fetch("https://fantasy.premierleague.com/api/bootstrap-static/")
    .then((response) => {
      console.log(response);
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

  addGameInfo = (game, info) => {
    const homeTeam = teamCodesInverted[game["team_h"]]
    const awayTeam = teamCodesInverted[game["team_a"]]
    const isFinished = game["finished"]
    const homeTeamScore = game["team_h_score"]
    const awayTeamScore = game["team_a_score"]


    info["fixtures"][homeTeam].push({"opp": awayTeam, "isFinished": isFinished, "gf": homeTeamScore, "ga": awayTeamScore})
    info["fixtures"][awayTeam].push({"opp": homeTeam, "isFinished": isFinished, "gf": awayTeamScore, "ga": homeTeamScore})
    info["gf"][homeTeam] = info["gf"][homeTeam] + homeTeamScore
    info["ga"][homeTeam] = info["ga"][homeTeam] + awayTeamScore
    info["gf"][awayTeam] = info["gf"][awayTeam] + awayTeamScore
    info["ga"][awayTeam] = info["ga"][awayTeam] + homeTeamScore
    return info
  }

  getSchedule = () => {
    let info = {
      fixtures: {
        "ARS": [],
        "AVL": [],
        "BOU": [],
        "BHA": [],
        "BUR": [],
        "CHE": [],
        "CRY": [],
        "EVE": [],
        "LEI": [],
        "LIV": [],
        "MCY": [],
        "MUN": [],
        "NEW": [],
        "NOR": [],
        "SHE": [],
        "SOU": [],
        "TOT": [],
        "WAT": [],
        "WHU": [],
        "WOL": [],
      },
      oppGF: {
        "ARS": [],
        "AVL": [],
        "BOU": [],
        "BHA": [],
        "BUR": [],
        "CHE": [],
        "CRY": [],
        "EVE": [],
        "LEI": [],
        "LIV": [],
        "MCY": [],
        "MUN": [],
        "NEW": [],
        "NOR": [],
        "SHE": [],
        "SOU": [],
        "TOT": [],
        "WAT": [],
        "WHU": [],
        "WOL": [],
      },
      oppGA: {
        "ARS": [],
        "AVL": [],
        "BOU": [],
        "BHA": [],
        "BUR": [],
        "CHE": [],
        "CRY": [],
        "EVE": [],
        "LEI": [],
        "LIV": [],
        "MCY": [],
        "MUN": [],
        "NEW": [],
        "NOR": [],
        "SHE": [],
        "SOU": [],
        "TOT": [],
        "WAT": [],
        "WHU": [],
        "WOL": [],
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
      }
    }
    fetch("https://fantasy.premierleague.com/api/fixtures/")
    .then((response) => {
      console.log(response);
      if (!response.ok) throw Error(response.statusText);
          return response.json();
      })
    .then((data) => { // eslint-disable-next-line
      for(const game of data) {
        info = this.addGameInfo(game, info);
      }
      this.setState({
        dataLoaded: true
      })
      for(const curTeam of Object.keys(info["fixtures"])) { // eslint-disable-line
        for(let opposingTeam of info["fixtures"][curTeam]) { // eslint-disable-line
          info["oppGF"][curTeam].push(info["gf"][opposingTeam])
          info["oppGA"][curTeam].push(info["ga"][opposingTeam])
        }
      }
    })
    .catch(error => console.log(error)); // eslint-disable-line no-console
    return info;
  }

  getGFColor = (oppTeamGF, isFinished, minGF, maxGF) => {
    switch(true) {
      case(isFinished):
        return styles.grey
      case(minGF <= oppTeamGF && oppTeamGF < (maxGF * 0.11)):
        return styles.darkgreen
      case((minGF * 0.11) <= oppTeamGF && oppTeamGF < (maxGF * 0.22)):
        return styles.green
      case((minGF * 0.22) <= oppTeamGF && oppTeamGF < (maxGF * 0.33)):
        return styles.lightgreen
      case((minGF * 0.33) <= oppTeamGF && oppTeamGF < (maxGF * 0.44)):
        return styles.whitegreen
      case((minGF * 0.44) <= oppTeamGF && oppTeamGF < (maxGF * 0.55)):
        return styles.white
      case((minGF * 0.55) <= oppTeamGF && oppTeamGF < (maxGF * 0.66)):
        return styles.whitered
      case((minGF * 0.66) <= oppTeamGF && oppTeamGF < (maxGF * 0.77)):
        return styles.lightred
      case((minGF * 0.77) <= oppTeamGF && oppTeamGF < (maxGF * 0.88)):
        return styles.red
      case((minGF * 0.88) <= oppTeamGF && oppTeamGF <= maxGF):
        return styles.darkred
      default:
        console.log("ERROR")
    }
  }

  getGAColor = (oppTeamGA, isFinished, minGA, maxGA) => {
    switch(true) {
      case(isFinished):
        return styles.grey
      case(minGA <= oppTeamGA && oppTeamGA < (maxGA * 0.11)):
        return styles.darkred
      case((minGA * 0.11) <= oppTeamGA && oppTeamGA < (maxGA * 0.22)):
        return styles.red
      case((minGA * 0.22) <= oppTeamGA && oppTeamGA < (maxGA * 0.33)):
        return styles.lightred
      case((minGA * 0.33) <= oppTeamGA && oppTeamGA < (maxGA * 0.44)):
        return styles.whitered
      case((minGA * 0.44) <= oppTeamGA && oppTeamGA < (maxGA * 0.55)):
        return styles.white
      case((minGA * 0.55) <= oppTeamGA && oppTeamGA < (maxGA * 0.66)):
        return styles.whitegreen
      case((minGA * 0.66) <= oppTeamGA && oppTeamGA < (maxGA * 0.77)):
        return styles.lightgreen
      case((minGA * 0.77) <= oppTeamGA && oppTeamGA < (maxGA * 0.88)):
        return styles.green
      case((minGA * 0.88) <= oppTeamGA && oppTeamGA <= maxGA):
        return styles.darkgreen
      default:
        console.log("ERROR")
    }
  }

  render () {
    const { gf, ga } = this.state
    // Data still loading
    if(!this.state.fixtures || !this.state.ga || !this.state.gf) {
      return (<div>Loading...</div>)
    } else if(this.state.fixtures["ARS"].length === 0) {
      return (<div>Loading...</div>)
    }
    // Data is done loading
    else {

      let minGF = 1000
      let maxGF = 0
      let minGA = 1000
      let maxGA = 0

      for(const GF of Object.keys(gf)) {
        if(gf[GF] < minGF) { minGF = gf[GF] }
        if(gf[GF] > maxGF) { maxGF = gf[GF] }
      }

      for(const GA of Object.keys(ga)) {
        if(ga[GA] < minGA) { minGA = ga[GA] }
        if(ga[GA] > maxGA) { maxGA = ga[GA] }
      }

      let oppGA = Object.keys(this.state.fixtures).map(team => {
        return (
          <tr key={team}>
            <th>{team}</th>
            {this.state.fixtures[team].map((gameInfo,index) => {
              return(
                <td key={index} style={this.getGAColor(ga[gameInfo["opp"]], gameInfo["isFinished"], minGA, maxGA)}>
                  {ga[gameInfo["opp"]]}
                </td>
              )
            })}
          </tr>
        )
      })

      let oppGF = Object.keys(this.state.fixtures).map(team => {
        return (
          <tr key={team}>
            <th>{team}</th>
            {this.state.fixtures[team].map((gameInfo,index) => {
              return(
                <td key={index} style={this.getGFColor(gf[gameInfo["opp"]], gameInfo["isFinished"], minGF, maxGF)}>
                  {gf[gameInfo["opp"]]}
                </td>
              )
            })}
          </tr>
        )
      })

      return (
        <div>
          <div>
            Used for Defense
            <table>
              <tbody>
                <tr>
                  <th style={styles.column}>TEAM</th>
                  <th style={styles.column}>01</th>
                  <th style={styles.column}>02</th>
                  <th style={styles.column}>03</th>
                  <th style={styles.column}>04</th>
                  <th style={styles.column}>05</th>
                  <th style={styles.column}>06</th>
                  <th style={styles.column}>07</th>
                  <th style={styles.column}>08</th>
                  <th style={styles.column}>09</th>
                  <th style={styles.column}>10</th>
                  <th style={styles.column}>11</th>
                  <th style={styles.column}>12</th>
                  <th style={styles.column}>13</th>
                  <th style={styles.column}>14</th>
                  <th style={styles.column}>15</th>
                  <th style={styles.column}>16</th>
                  <th style={styles.column}>17</th>
                  <th style={styles.column}>18</th>
                  <th style={styles.column}>19</th>
                  <th style={styles.column}>20</th>
                  <th style={styles.column}>21</th>
                  <th style={styles.column}>22</th>
                  <th style={styles.column}>23</th>
                  <th style={styles.column}>24</th>
                  <th style={styles.column}>25</th>
                  <th style={styles.column}>26</th>
                  <th style={styles.column}>27</th>
                  <th style={styles.column}>28</th>
                  <th style={styles.column}>29</th>
                  <th style={styles.column}>30</th>
                  <th style={styles.column}>31</th>
                  <th style={styles.column}>32</th>
                  <th style={styles.column}>33</th>
                  <th style={styles.column}>34</th>
                  <th style={styles.column}>35</th>
                  <th style={styles.column}>36</th>
                  <th style={styles.column}>37</th>
                  <th style={styles.column}>38</th>
                </tr>
                {oppGF}
              </tbody>
            </table>
          </div>
          <div>
            Used for Offense
            <table>
              <tbody>
              <tr>
                  <th style={styles.column}>TEAM</th>
                  <th style={styles.column}>01</th>
                  <th style={styles.column}>02</th>
                  <th style={styles.column}>03</th>
                  <th style={styles.column}>04</th>
                  <th style={styles.column}>05</th>
                  <th style={styles.column}>06</th>
                  <th style={styles.column}>07</th>
                  <th style={styles.column}>08</th>
                  <th style={styles.column}>09</th>
                  <th style={styles.column}>10</th>
                  <th style={styles.column}>11</th>
                  <th style={styles.column}>12</th>
                  <th style={styles.column}>13</th>
                  <th style={styles.column}>14</th>
                  <th style={styles.column}>15</th>
                  <th style={styles.column}>16</th>
                  <th style={styles.column}>17</th>
                  <th style={styles.column}>18</th>
                  <th style={styles.column}>19</th>
                  <th style={styles.column}>20</th>
                  <th style={styles.column}>21</th>
                  <th style={styles.column}>22</th>
                  <th style={styles.column}>23</th>
                  <th style={styles.column}>24</th>
                  <th style={styles.column}>25</th>
                  <th style={styles.column}>26</th>
                  <th style={styles.column}>27</th>
                  <th style={styles.column}>28</th>
                  <th style={styles.column}>29</th>
                  <th style={styles.column}>30</th>
                  <th style={styles.column}>31</th>
                  <th style={styles.column}>32</th>
                  <th style={styles.column}>33</th>
                  <th style={styles.column}>34</th>
                  <th style={styles.column}>35</th>
                  <th style={styles.column}>36</th>
                  <th style={styles.column}>37</th>
                  <th style={styles.column}>38</th>
                </tr>
                {oppGA}
              </tbody>
            </table>
          </div>
        </div>
      );
    }
  }
}

export default App;

const styles = {
  column: {
    width: "2px",
    justifyContent: "center"
  },
  grey: {
    background: "grey",
    color: "grey"
  },
  darkred: {
    background: "#F8696B",
  },
  red: {
    background: "#FAA5A6",
  },
  lightred: {
    background: "#FCD2D2",
  },
  whitered: {
    background: "#FEF0F0",
  },
  white: {
    background: "#FFFFFF",
  },
  whitegreen: {
    background: "#EFF8F1",
  },
  lightgreen: {
    background: "#CFEBD6",
  },
  green: {
    background: "#A0D7AF",
  },
  darkgreen: {
    background: "#63BE7B",
  },
}

let teamCodes = {
  "ARS": 1,
  "AVL": 2,
  "BOU": 3,
  "BHA": 4,
  "BUR": 5,
  "CHE": 6,
  "CRY": 7,
  "EVE": 8,
  "LEI": 9,
  "LIV": 10,
  "MCY": 11,
  "MUN": 12,
  "NEW": 13,
  "NOR": 14,
  "SHE": 15,
  "SOU": 16,
  "TOT": 17,
  "WAT": 18,
  "WHU": 19,
  "WOL": 20,
}

let teamCodesInverted = {
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