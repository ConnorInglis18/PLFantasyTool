import { BACKEND_DATA_KEY, TEAM_DATA_KEY } from "./consts";

export const getUserTeams = () => {
  
  let backendData = localStorage.getItem(BACKEND_DATA_KEY);
  if (backendData === null) {
    return []
  } else {
    backendData = JSON.parse(backendData)
  }
  if (TEAM_DATA_KEY in backendData) {
    return backendData[TEAM_DATA_KEY];
  } else {
    return []
  }
}

export const createTeam = (teamName) => {
  let backendData = localStorage.getItem(BACKEND_DATA_KEY);
  backendData = JSON.parse(backendData);
  let userTeams = backendData[TEAM_DATA_KEY];
  userTeams.push({
    name: teamName,
    players: [],
  });
  backendData[TEAM_DATA_KEY] = userTeams;
  localStorage.setItem(BACKEND_DATA_KEY, JSON.stringify(backendData));
  return userTeams;
}

export const addPlayerToUserTeam = (playerId, teamIndex) => {
  let backendData = localStorage.getItem(BACKEND_DATA_KEY);
  backendData = JSON.parse(backendData);
  let userTeams = backendData[TEAM_DATA_KEY];
  userTeams[teamIndex]["players"].push(playerId)
  backendData[TEAM_DATA_KEY] = userTeams;
  localStorage.setItem(BACKEND_DATA_KEY, JSON.stringify(backendData));
  return userTeams;
}

export const removePlayerFromUserTeam = (playerId, teamIndex) => {
  let backendData = localStorage.getItem(BACKEND_DATA_KEY);
  backendData = JSON.parse(backendData);
  let userTeams = backendData[TEAM_DATA_KEY];
  let currentTeam = userTeams[teamIndex];
  const index = currentTeam["players"].indexOf(playerId);
  if (index !== -1) { // make sure the item exists in list (it should)
    currentTeam["players"].splice(index, 1); // remove element
  }
  userTeams[teamIndex] = currentTeam;
  backendData[TEAM_DATA_KEY] = userTeams;
  localStorage.setItem(BACKEND_DATA_KEY, JSON.stringify(backendData));
  return userTeams
}