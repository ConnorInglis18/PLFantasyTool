import { TEAM_DATA_KEY } from "./consts";

export const getUserTeams = () => {
  let userTeams = localStorage.getItem(TEAM_DATA_KEY);
  if (userTeams === null) {
    localStorage.setItem(TEAM_DATA_KEY, JSON.stringify([]));
    return []
  } else {
    return JSON.parse(userTeams);
  }
}

export const createTeam = (teamName) => {
  let userTeams = localStorage.getItem(TEAM_DATA_KEY);
  userTeams = JSON.parse(userTeams)
  userTeams.push({
    name: teamName,
    players: [],
  });
  localStorage.setItem(TEAM_DATA_KEY, JSON.stringify(userTeams));
  return userTeams;
}

export const addPlayerToUserTeam = (playerId, teamIndex) => {
  let userTeams = localStorage.getItem(TEAM_DATA_KEY);
  userTeams = JSON.parse(userTeams);
  userTeams[teamIndex]["players"].push(playerId)
  localStorage.setItem(TEAM_DATA_KEY, JSON.stringify(userTeams));
  return userTeams;
}

export const removePlayerFromUserTeam = (playerId, teamIndex) => {
  let userTeams = localStorage.getItem(TEAM_DATA_KEY);
  userTeams = JSON.parse(userTeams);
  let currentTeam = userTeams[teamIndex];
  const index = currentTeam["players"].indexOf(playerId);
  if (index !== -1) { // make sure the item exists in list (it should)
    currentTeam["players"].splice(index, 1); // remove element
  }
  userTeams[teamIndex] = currentTeam;
  localStorage.setItem(TEAM_DATA_KEY, JSON.stringify(userTeams));
  return userTeams;
}