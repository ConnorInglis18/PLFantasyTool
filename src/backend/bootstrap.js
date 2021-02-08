// for now, just returns the current gameweek (is_current = true)
// the id of the gameweek is 1-indexed (1-38)
export const handleEvents = (weeks) => {
  for (const week of weeks) {
    if (week["is_next"] === true) {
      return week["id"];
    }
  }
  console.error("handleEvents has not found the current gameweek");
  console.error("I have not error handled the first or last week of the season as I'm not sure how FPL sends the data");
  return 1;
}

export const handleTeams = (teams, upcomingGameweek) => {
  let teamDict = {};
  for (const team in teams) {
    let teamId = teams[team]["id"];
    teamDict[teamId] = {
      "team_id": teamId,
      "short_name": teams[team]["short_name"],
      "gf": 0,
      "ga": 0,
      "previous_opponents": {},
      "future_opponents": {}
    };

    // This will initialize all of the arrays to handle blank and double gameweeks
    for (let i = 1; i < upcomingGameweek; ++i) {
      teamDict[teamId]["previous_opponents"][i] = [];
    }
    for (let i = upcomingGameweek; i < 39; ++i) {
      teamDict[teamId]["future_opponents"][i] = [];
    }
  }
  return teamDict;
}