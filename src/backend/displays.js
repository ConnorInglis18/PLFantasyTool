import { BACKEND_DATA_KEY } from "./consts";
import { createUserTeamsDisplay, getUserTeams } from "./userTeam";

const ColorBarsType = {
  HIGH_GOOD: 1,
  LOW_GOOD: 2
};
const greenHue = 122;
const greenSat = 75;
const maxGreenLightness = 75;
const minGreenLightness = 35;
const redHue = 0;
const redSat = 84;
const maxRedLightness = 85;
const minRedLightness = 54;

export const createDisplays = (teams, responseObject) => {
  // create the goals for and goals against arrays using the teams object
  let gfArray = [];
  let gaArray = [];
  for (const team in teams) {
    gfArray.push(teams[team]["gf"]);
    gaArray.push(teams[team]["ga"]);
  }  
  gfArray.sort((a, b) => a - b); // a - b sorts in ascending order (b - a for descending)
  gaArray.sort((a, b) => a - b);
  const medianGf = (gfArray[9] + gfArray[10]) / 2; // 20 teams so take the middle of 9th and 10th team (0-indexed)
  const medianGa = (gaArray[9] + gaArray[10]) / 2;

  // To create the constant factor for all displays,
  // we need to first figure out the largest differnece between max/min and the respective median
  const gfMaxDistanceFromMedian = Math.max(medianGf - gfArray[0], gfArray[19] - medianGf);
  const gaMaxDistanceFromMedian = Math.max(medianGa - gaArray[0], gaArray[19] - medianGa);  

  responseObject["defenders_display"] = [];
  responseObject["attackers_display"] = [];

  for (let team in teams) {
    team = teams[team];

    let defendersDisplay = {};
    let attackersDisplay = {};

    defendersDisplay["short_name"] = team["short_name"];
    attackersDisplay["short_name"] = team["short_name"];

    let defendersUpcomingFixtures = []; // used for defenders display
    let attackersUpcomingFixtures = []; // used for attackers display
    for (const week in team["future_opponents"]) {
      let defendersWeekArray = [];
      let attackersWeekArray = [];
      team["future_opponents"][week].forEach(oppId => {
        const oppGf = teams[oppId]["gf"];
        const oppGa = teams[oppId]["ga"];
        let defenderGameObject = {
          "value": oppGf,
          "color": getColor(oppGf, medianGf, gfMaxDistanceFromMedian, ColorBarsType.LOW_GOOD)
        }
        let attackerGameObject = {
          "value": oppGa,
          "color": getColor(oppGa, medianGa, gaMaxDistanceFromMedian, ColorBarsType.HIGH_GOOD)
        }
        defendersWeekArray.push(defenderGameObject);
        attackersWeekArray.push(attackerGameObject);
      })
      defendersUpcomingFixtures.push(defendersWeekArray);
      attackersUpcomingFixtures.push(attackersWeekArray);
    }
    defendersDisplay["upcoming_fixtures"] = defendersUpcomingFixtures;
    attackersDisplay["upcoming_fixtures"] = attackersUpcomingFixtures;

    defendersDisplay["goals"] = {
      "value": team["ga"],
      "color": getColor(team["ga"], medianGa, gaMaxDistanceFromMedian, ColorBarsType.LOW_GOOD)
    };
    attackersDisplay["goals"] = {
      "value": team["gf"],
      "color": getColor(team["gf"], medianGf, gfMaxDistanceFromMedian, ColorBarsType.HIGH_GOOD)
    };

    responseObject["defenders_display"].push(defendersDisplay);
    responseObject["attackers_display"].push(attackersDisplay);
  }
  // write backend object to local storage / db
  localStorage.setItem(BACKEND_DATA_KEY, JSON.stringify(responseObject));
  
  responseObject["user_teams"] = createUserTeamsDisplay();
  return responseObject;
}

function getColor(goals, medianGoals, maxDistanceFromMedian, colorBarsType) {
  let lightness;
  let sat;
  let hue;
  if (Math.abs(medianGoals - goals) <= 0.5) { // color white
    hue = 100;
    sat = 100;
    lightness = 100;
  } else if ((goals > medianGoals && colorBarsType === ColorBarsType.HIGH_GOOD) ||
      (goals < medianGoals && colorBarsType === ColorBarsType.LOW_GOOD)) { // color green
    // close to median = close to white = maxGreenLightness
    // far from median = darker color = minGreenLightness
    // we need to figure out the value (lightnessConstant) at which the furthest value away from the median will achieve the darkest color we want
    // maxGreenLightness - (lightnessConstant * medianDistance) = minGreenLightness
    let lightnessConstant = (maxGreenLightness - minGreenLightness) / maxDistanceFromMedian;
    hue = greenHue;
    sat = greenSat;
    lightness = maxGreenLightness - (Math.abs(goals - medianGoals) * lightnessConstant)
  } else { // color red
    let lightnessConstant = (maxRedLightness - minRedLightness) / maxDistanceFromMedian;
    hue = redHue;
    sat = redSat;
    lightness = maxRedLightness - (Math.abs(goals - medianGoals) * lightnessConstant)
  }
  return `hsl(${hue}, ${sat}%, ${lightness}%)`
}