import { fixturesUrl } from './urls';

export const updateTeamInfo = (teams, upcomingGameweek) => {
  return fetch(fixturesUrl)
  .then((response) => {
    if (!response.ok) throw Error(response.statusText);
    return response.json();
  })
  .then((data) => {
    return handleFixtures(data, teams, upcomingGameweek);
  })
  .catch((error) => console.log(error)); // eslint-disable-line no-console
}

const handleFixtures = (fixtures, teams, upcomingGameweek) => {
  for (let fixture in fixtures) {
    fixture = fixtures[fixture];
    const isFinished = fixture["finished"];
  
    // if a match is postponed, the event will be null. We only want to add games that are being played
    if (fixture["event"] != null) {
      const gameweek = parseInt(fixture["event"]); // gameweek is 1-indexed, but so is upcomingGameweek
      const homeId = fixture["team_h"];
      const awayId = fixture["team_a"];
      /* 
        If the gameweek of the fixture is before the upcoming gameweek,
        add it to the previous matches segment. If not, add it to the future opponents segment.
        Note: Just because gameweek < upcomingGameweek does not mean the game has been played yet.
        If it is Saturday morning on gameweek 15, then upcomingGameweek will equal 16.
        However, a majority of the games in gameweek 15 will not have been played yet.
        I am using upcomingGameweek rather than currentGameweek because once the deadline has
        passed for gameweek 15, an owner cannot change his team for that gameweek.
        Only gameweek 16 and on is important in this example
      */
      const segment = gameweek < upcomingGameweek ? "previous_opponents" : "future_opponents";

      // add fixtures
      teams[homeId][segment][gameweek].push(awayId);
      teams[awayId][segment][gameweek].push(homeId);

      // if the fixture is finished, add the scores for the two team's gf and ga
      if (isFinished) {
        const homeScore = fixture["team_h_score"];
        const awayScore = fixture["team_a_score"];
        teams[homeId]["gf"] += homeScore;
        teams[homeId]["ga"] += awayScore;
        teams[awayId]["gf"] += awayScore;
        teams[awayId]["ga"] += homeScore;
      }
    }
  }
  return teams;
};