export const handlePlayers = (players) => {
  let playerDict = {};
  for (let player in players) {
    player = players[player];
    playerDict[player["id"]] = {
      "team_id": player["team"], // fixtures uses team instead of team_code
      "web_name": player["web_name"],
      "element_type": player["element_type"],
      "total_points": player["total_points"],
      "player_id": player["id"],
      "now_cost": handleCost(player["now_cost"]),
    }
  }
  console.log(playerDict);
  return playerDict;
}

// turn "125" into "12.5" or "67" into "6.7"
function handleCost(cost) {
  cost = cost.toString();
  const lastIndex = cost.length - 1;
  return cost.substring(0, lastIndex) + "." + cost.substring(lastIndex, cost.length);
}