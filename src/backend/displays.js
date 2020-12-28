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

export const createDisplays = (teams, upcomingGameweek) => {
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


  let display = {
    "defenders_display": [],
    "attackers_display": [],
    "upcoming_gameweek": upcomingGameweek
  }

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

    display["defenders_display"].push(defendersDisplay);
    display["attackers_display"].push(attackersDisplay);
  }
  return display;
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

// const createColorBrackets = (arr) => {
//   arr.sort((a,b) => a - b);
//   // 12 is a completely arbitrary number that I think looks nice
//   // If you reduce the number of buckets, you may want to change the contrast on some of color ranges
//   const numBuckets = 12;
//   const max = Math.max.apply(null, arr);
//   const min = Math.min.apply(null, arr);

//   // bucketDistance = max - min value in a bucket
//   // if bucket = [12, 13, 15, 15, 16], then bucketDistance = 16 - 12 = 4
//   // We initialize bucketDistance to a value that we know we can use to create k buckets
//   let bucketDistance = Math.ceil((max - min) / numBuckets) + 1;

//   // We will use canMakeSubsets to try and reduce the bucketDistance to as small as possible.
//   // Reducing bucketDistance helps reduce the case where the final bucket only has a few teams which occurs quite frequently
//   // We are looking for an even distribution rather than fronloading the first few buckets
//   while (canMakeKBucketsWithBucketDistance(arr, numBuckets, bucketDistance - 1)) {
//     bucketDistance -= 1;
//   }

//   // Once we know the smallest possible value of bucketDistance,
//   // we will use that value to create the color brackets
//   return makeBuckets(arr, bucketDistance);
// }

// // k: number of buckets we are trying to create
// // bucketDistance: max - min value in a bucket
// // This function takes in an array of ints and tries to break up the array into subsets
// // Each subset will have a bucketDistance <= maxBucketDistance
// // Returns true if we can do this using <= k buckets
// // (I don't use an anonymous function here because I like putting this below the function createColorBrackets)
// function canMakeKBucketsWithBucketDistance(arr, k, maxBucketDistance) {
//   let numBucketsNeeded = 0;
//   let bucketMax = arr[0] + maxBucketDistance;
//   for (let i = 0; i < arr.length; ++i) {
//     if (arr[i] > bucketMax) {
//       numBucketsNeeded += 1;
//       bucketMax = arr[i] + maxBucketDistance;
//     }
//   }
//   // because the last bucket never gets added (as it's not > than bucketMax, we have to add 1 to account for the last bucket
//   return numBucketsNeeded + 1 <= k;
// }

// // Use a greedy alg to create the minimum number of buckets possible with a bucketDistance of maxBucketDistance
// function makeBuckets(arr, maxBucketDistance){
//   let buckets = [];
//   let bucket = [];
//   bucket.push(arr[0]);
//   bucket.push(arr[0] + maxBucketDistance);
//   buckets.push(bucket);
//   let bucketMax = arr[0] + maxBucketDistance;
//   for (let i = 0; i < arr.length; ++i) {
//     if (arr[i] > bucketMax) {
//       bucket = [];
//       bucket.push(arr[i]);
//       bucket.push(arr[i] + maxBucketDistance);
//       buckets.push(bucket);
//       bucketMax = arr[i] + maxBucketDistance;
//     }
//   }
//   return buckets;
// };