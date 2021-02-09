import { BACKEND_DATA_KEY, TEAM_DATA_KEY } from "./consts";

export const getUserTeams = () => {
  let userTeams = localStorage.getItem(TEAM_DATA_KEY);
  if (userTeams === null) {
    localStorage.setItem(TEAM_DATA_KEY, JSON.stringify([]));
    return []
  } else {
    return JSON.parse(userTeams);
  }
}

export const createUserTeamsDisplay = () => {
  let backendData = JSON.parse(localStorage.getItem(BACKEND_DATA_KEY));
  let players = backendData["players"];
  let defendersDisplay = backendData["defenders_display"];
  let attackersDisplay = backendData["attackers_display"];
  let userTeams = getUserTeams();
  let userTeamsDisplay = []
  userTeams.forEach(team => {
    let userTeamDisplay = [[], [], [], []] // 4 arrays for 4 player types (goalkeepers = 1 / go in 0th array);
    team["players"].forEach(playerId => {
      let playerDisplay = {}
        playerDisplay["player_id"] = playerId
        playerDisplay["web_name"] = players[playerId]["web_name"];
        let teamId = players[playerId]["team_id"];
        playerDisplay["team_id"] = teamId;
        playerDisplay["total_points"] = players[playerId]["total_points"];
        playerDisplay["now_cost"] = players[playerId]["now_cost"];
        // TODO: Add jerseys and team logo
        const element_type = players[playerId]["element_type"];
        if (element_type <= 2) { // defender or goalie
          playerDisplay["upcoming_fixtures"] = defendersDisplay[teamId-1]["upcoming_fixtures"]; // -1 b/c pl uses 1-index
        } else { // midfielder or forward
          playerDisplay["upcoming_fixtures"] = attackersDisplay[teamId-1]["upcoming_fixtures"]; // -1 b/c pl uses 1-index
        }
        // put the player in the proper position array (goalie element type 1 goes in 0th indexed array)
        userTeamDisplay[element_type-1].push(playerDisplay); // -1 b/c pl uses 1-index
    })
    userTeamsDisplay.push({name: team["name"], players: userTeamDisplay});
  })
  return userTeamsDisplay;
}

export const createTeam = (teamName) => {
  let userTeams = localStorage.getItem(TEAM_DATA_KEY);
  userTeams = JSON.parse(userTeams)
  userTeams.push({
    name: teamName,
    players: [],
  });
  localStorage.setItem(TEAM_DATA_KEY, JSON.stringify(userTeams));
  return createUserTeamsDisplay();
}

export const addPlayerToUserTeam = (playerId, teamIndex) => {
  let userTeams = localStorage.getItem(TEAM_DATA_KEY);
  userTeams = JSON.parse(userTeams);
  userTeams[teamIndex]["players"].push(playerId)
  localStorage.setItem(TEAM_DATA_KEY, JSON.stringify(userTeams));
  return createUserTeamsDisplay();
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
  return createUserTeamsDisplay();
}

export const isPlayerInUserTeam = (playerId, teamIndex) => {
  let userTeams = localStorage.getItem(TEAM_DATA_KEY);
  userTeams = JSON.parse(userTeams);
  let currentTeam = userTeams[teamIndex];
  const index = currentTeam["players"].indexOf(playerId);
  return index === -1
}