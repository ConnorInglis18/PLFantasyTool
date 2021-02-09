export const handlePlayers = (players) => {
  let playerList = [[],[],[],[]] // 1 list for each position that will store the order of the player Ids (GK, DEF, MID, FWD)
  let playerDict = {}
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
    playerList[player["element_type"]-1].push({"player_id": player["id"], "total_points": player["total_points"]})
  }

  // Sort the players by points and return sorted arrays of player_ids
  for (let i = 0; i < playerList.length; ++i) {
    playerList[i].sort((a,b) => b["total_points"] - a["total_points"])
    playerList[i] = playerList[i].map(player => {
      return player["player_id"]
    })
  }
  return {playerDict, playerList};
}

// turn "125" into "12.5" or "67" into "6.7"
function handleCost(cost) {
  cost = cost.toString();
  const lastIndex = cost.length - 1;
  return cost.substring(0, lastIndex) + "." + cost.substring(lastIndex, cost.length);
}