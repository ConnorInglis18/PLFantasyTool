import { updateTeamInfo } from './fixtures';
import { handlePlayers } from './players';
import { handleEvents, handleTeams } from './bootstrap';
import { createDisplays } from './displays';
import { createUserTeamsDisplay } from './userTeam';
import { BACKEND_DATA_KEY, BOOTSTRAP_URL, FIXTURES_URL, UPDATE_TIMES_KEY } from './consts';

export const fetchData = () => {
  // Check if there is an UPDATE_TIMES array for the user
  // this will be the array to determine whether the data is stale in the future
  let updateTimes = localStorage.getItem(UPDATE_TIMES_KEY);
  if (updateTimes === null) {
    // if there is not an UPDATE_TIMES array, we need to generate one
    updateTimes = createGameweekSchedule();
  }

  let backendData = localStorage.getItem(BACKEND_DATA_KEY);
  // We need to call the api if we either don't have any backend data or the data is stale
  if (backendData === null || isBackendDataStale(JSON.parse(updateTimes))) {
    console.log("FETCHING BACKEND DATA");
    let responseObject = {};
    return fetch(BOOTSTRAP_URL)
    .then((response) => {
      console.log(response)
      if (!response.ok) throw Error(response.statusText);
      return response.json();
    })
    .then((data) => {
      const upcomingGameweek = handleEvents(data["events"]);
      let teams = handleTeams(data["teams"], upcomingGameweek);
      const handlePlayersObj = handlePlayers(data["elements"], upcomingGameweek);
      responseObject["ordered_players"] = handlePlayersObj["playerList"];
      responseObject["players"] = handlePlayersObj["playerDict"];
      responseObject["upcoming_gameweek"] = upcomingGameweek;
      return updateTeamInfo(teams, responseObject);
    })
    .then((teams) => {
      return createDisplays(teams, responseObject);
    })
    .catch((error) => console.log(error))
  } else { // if we already have data, we will return that data as the response object
    return new Promise(function(resolve, reject) {
      let responseObject = JSON.parse(backendData);
      responseObject["user_teams"] = createUserTeamsDisplay();
      resolve(responseObject);
      reject(refreshData);
    })
  }
}

function isBackendDataStale(updateTimes) {
  let now = new Date();
  const nextUpdate = new Date(updateTimes[0]);
  if (nextUpdate > now) { // if we have not reached the next update time, the data is not stale
    return false;
  } else { // the data is stale
    // remove all dates from updateTimes that are before now
    // (there could be more than one date that needs to be removed if the user hasn't visited the site in awhile)
    for (let i = 0; i < updateTimes.length; ++i) {
      const testDate = new Date(updateTimes[i])
      if (testDate > now) {
        // remove all dates before i
        let newUpdateTimes = updateTimes.slice(i, updateTimes.length)
        localStorage.setItem(UPDATE_TIMES_KEY, JSON.stringify(newUpdateTimes))
        break;
      }
    }
    return true;
  }
}

export const refreshData = () => {
  let responseObject = {};
  return fetch(BOOTSTRAP_URL)
  .then((response) => {
    if (!response.ok) throw Error(response.statusText);
    return response.json();
  })
  .then((data) => {
    const upcomingGameweek = handleEvents(data["events"]);
    let teams = handleTeams(data["teams"], upcomingGameweek);
    const handlePlayersObj = handlePlayers(data["elements"], upcomingGameweek);
    responseObject["ordered_players"] = handlePlayersObj["playerList"];
    responseObject["players"] = handlePlayersObj["playerDict"];
    responseObject["upcoming_gameweek"] = upcomingGameweek;
    return updateTeamInfo(teams, responseObject);
  })
  .then((teams) => {
    return createDisplays(teams, responseObject);
  })
  .catch((error) => console.log(error))
}

// This function will create an array of all future gamedays
// It will then store this array in local storage
// This array will then be used to check whether or not to call the backend api
function createGameweekSchedule() {
  fetch(FIXTURES_URL)
  .then((response) => {
    if (!response.ok) throw Error(response.statusText);
    return response.json();
  })
  .then((fixtures) => {
    let updateTimes = {}
    let now = new Date();
    fixtures.forEach(fixture => {
      if (fixture["kickoff_time"] !== null) {
        let dateString = fixture["kickoff_time"];
        // set the dateString to be 9:00pm of that day (the premier league site)
        dateString = dateString.split("T")[0] + "T21:00:00"
        const fixtureDate = new Date(dateString)
        if (fixtureDate > now) {
          updateTimes[fixtureDate] = null // dictionary's are easier to work with than sets in js
        }
      }
    })
    localStorage.setItem(UPDATE_TIMES_KEY, JSON.stringify(Object.keys(updateTimes).sort((a, b) => Date(a) < Date(b))));
    return Object.keys(updateTimes).sort((a, b) => Date(a) < Date(b))
})}