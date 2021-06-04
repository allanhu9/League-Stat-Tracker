# League-Stat-Tracker
A stat tracking website for league of legends

For now: The website is able to grab data from the RIOT API and display it on the website. Requires a .env file with a riot api key, port, and GET url. Also, these files need to be in an express.js project with a few extra add-ons like cors and dotenv installed.


## To run the website:

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
(to fetch data from API)
npm install dot-env
(for the environment file... More on that later)
npm install cors
(once again to fetch data from API)
~~~

Assuming that all went well, you'll need to download some League of Legends assets that I would have included in the repository if it wasn't too large.

Download from [here](https://ddragon.leagueoflegends.com/cdn/dragontail-9.3.1.tgz)

and unzip it
