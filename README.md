# Premier League Fantasy Tool

Scripts:

npm run start
Dev server on localhost

To Deploy to gh-pages, run
npm run predeploy
npm run deploy
git add .
git commit -m "..."
git push origin master

May need to run npm install if npm isn't working properly
May need to download https://chrome.google.com/webstore/detail/allow-control-allow-origi/nlfbmbojpeacfghkpbjhddihlkkiljbi for CORS

### FPL API Endpoints ###

### Default
Lots of Info
https://fantasy.premierleague.com/api/bootstrap-static/

### Fixtures
All Fixtures
https://fantasy.premierleague.com/api/fixtures/

### Players
Single Player Stats (Gameweek by gameweek)
https://fantasy.premierleague.com/api/element-summary/{player-id}/ => (https://fantasy.premierleague.com/api/element-summary/191/)
All Players Stats (For individual gameweek)
https://fantasy.premierleague.com/api/event/1/live/ => (https://fantasy.premierleague.com/api/event/{GW}/live/)

### Managers
General Info
https://fantasy.premierleague.com/api/entry/{team-id}/ => (https://fantasy.premierleague.com/api/entry/657945/)
Transfers
https://fantasy.premierleague.com/api/entry/{team-id}/transfers/ => (https://fantasy.premierleague.com/api/entry/657945/transfers/)
Gameweek Info
https://fantasy.premierleague.com/api/entry/{team-id}/event/{GW}/picks/ => (https://fantasy.premierleague.com/api/entry/657945/event/1/picks/)
History
https://fantasy.premierleague.com/api/entry/{team-id}/history/ => (https://fantasy.premierleague.com/api/entry/657945/history/)

### Leagues
Standings
https://fantasy.premierleague.com/api/leagues-classic/{league-id}/standings/ => (https://fantasy.premierleague.com/api/leagues-classic/170270/standings/)