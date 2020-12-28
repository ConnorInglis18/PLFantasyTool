import { updateTeamInfo } from './fixtures';
// import { handlePlayers } from './players';
import { handleEvents, handleTeams } from './bootstrap';
import { createDisplays } from './displays';
import { bootstrapUrl } from './urls';

export const loadData = () => {
  // We must call bootstrap-static before fixtures and wait for the result as
  // fixtures relies on the teams to be created and for us to know the current gameweek
  let upcomingGameweek;
  return fetch(bootstrapUrl)
  .then((response) => {
    if (!response.ok) throw Error(response.statusText);
    return response.json();
  })
  .then((data) => {
    upcomingGameweek = handleEvents(data["events"]);
    let teams = handleTeams(data["teams"], upcomingGameweek);
    // let players = handlePlayers(data["elements"]);
    return updateTeamInfo(teams, upcomingGameweek);
  })
  .then((teams) => {
    return createDisplays(teams, upcomingGameweek);
  })
  .catch((error) => console.log(error))
}


/*
  returns
  {
    "AttackersDisplay": {
      "TEAM_SHORT_0": WeekArray[num_gameweeks_remaining],
      "TEAM_SHORT_1": WeekArray[num_gameweeks_remaining],
      ...
      "TEAM_SHORT_19": WeekArray[num_gameweeks_remaining]
    }
    "DefendersDisplay": {
      "TEAM_SHORT_0": WeekArray[num_gameweeks_remaining],
      "TEAM_SHORT_1": WeekArray[num_gameweeks_remaining],
      ...
      "TEAM_SHORT_19": WeekArray[num_gameweeks_remaining]
    }
  }

  WeekArray = GameObject[# games in gameweek]

  GameObject = {
    "value": int,
    "color": (hex)string
  }
  */