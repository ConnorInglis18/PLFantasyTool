export const handlePlayers = (players) => {
  let playerDict = {};
  for (const player in players) {
    playerDict[players[player]["id"]] = {
      "team": players[player]["team"],
      "web_name": players[player]["web_name"],
      "element_type": players[player]["element_type"]
    }
  }
  return playerDict;
}