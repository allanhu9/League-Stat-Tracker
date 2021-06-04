# League-Stat-Tracker
A stat tracking website for league of legends

Gets data from the RIOT API and displays your stats on the website! In development.

Assuming I don't have my page up and running online anywhere:
## To run the website locally:

This project uses something called express.js, a node.js framework, to host a local server so that it can fetch data from the RIOT api.
Since this is obviously not optimized, there's a few things you'll need to do to be able to run it.
First, you'll need to download node.js, which you can just do by googling it.
Once you've done that, you can go ahead and download this repository and put it somewhere that you would like.

For this next part, I suggest using Visual Studio Code, but there are probably other IDE's that work fine.

With your console looking at the league-stat-tracker-main folder, type the commands:

~~~
npm install express
(to install express)
npm install node-fetch
(so we can fetch data from API)
npm install dot-env
(for the environment file... More on that later)
npm install cors
(once again to fetch data from API)
~~~

Assuming that all went well, you'll need to download some League of Legends assets that I would have included in the repository if it wasn't too large.

Download from [here](https://ddragon.leagueoflegends.com/cdn/dragontail-9.3.1.tgz)

unzip it, and place it in the league-stat-tracker-main folder. 

Also you will need to rename it to `dragontail-stats`. Currently, you will also need to put the ranked-emblems folder into the dragontail-stats folder. Hopefully these
last two steps are gone by the time you see this. But maybe not. Who knows.

Okay one more thing before you can run this code, the .env file. My .env file is hidden for safety reasons, but if you need to make your own, just create a .env file and copy paste what's below directly into the file.

~~~
NODE_ENV=development
PORT=
API_KEY=
API_URL_BYNAME=https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/
API_URL_RANKED_BYID=https://na1.api.riotgames.com/lol/league/v4/entries/by-summoner/
API_URL_MATCHES_BYPUUID=https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/
API_URL_MATCHDATA_BYMATCHID=https://americas.api.riotgames.com/lol/match/v5/matches/
~~~

You can set your own port to be whatever you want. As for the api-key, you can either get your own by going onto RIOT API, or if you know me personally, just email me. Hopefully my website will be approved to have a key by then.

Now, all you have to do to run it is to type
~~~
node index.js
~~~
into the command line (that is still on the league-stat-tracker-main folder and then run the index.html file. Yay.
