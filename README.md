# League-Stat-Tracker
A stat tracking website for league of legends

Gets data from the RIOT API and displays your stats on the website! In development.

## update - Webpage is online! Please read everything in this section

The website is now hosted online through heroku and Github! Yay!

Of course, since I only have a development API key from Riot Games, I will need to refresh the key every day or the website will not work. If you want to try the website, you can contact me by my email or phone number and I'll put the new key in.

If I happen to get a permanent personal API key, there will be another update.

This is the link to the website, by the way: https://gchroma.github.io/League-Stat-Tracker/

## Brief description of what each file does

### Front-End - These files are actually being accessed by GitHub to host the webpage :

1. index.html : The structure of the website frontpage, what you see on your screen.
2. style.css : Gives the look of the website. It could be better, but it is what it is.
3. script.js : The script fetches the data from the website backend and places it onto the page. It also makes the button and search bar work, hides things, and is basically all of the interactibility on the page.
4. images folder : Consists only of the background image used in the website, everything else is taken from online APIs.

### Back-end - These are the files that are hosting using Heroku. They're only in this github repository for viewing purposes:

1. index.js : This is the main file for the backend and is responsible for grabbing data from the RIOT API and sending it to the front end. (or technically anywhere 2. else that issues a request...)
3. config.js : Takes data from the .env file in a secure way.
4. .env file : Holds sensitive information and other constants such as API key, port to host on, and more, it is not put in git because .gitignore helps by not uploading it to the repository.

## Some reflections

Html, css, and js suck. They are not the way to go.

Using something like react.js would've been so much easier, and also I would've been able to make the website much better looking, and run faster. (Currently it's a slog.)

I was originally planning on adding more things like MMR, but before I ran out of time to work on the website I figured it would be better to get it up live so it is easy to use.

While there was some significant difficulty with getting data from Riot and working with the backend, the most difficult thing was learning the html and css to actually have the webpage have some level of presentability. Despite that though, there's some clipping, empty space, scalability is a nightmare (I should not have used height scaling) and it's generally pretty ugly.

Maybe in the future i'll make a discord bot... at least that doesn't require anything other than displaying text.

Anyway this is the form that i'll be leaving this webpage in for a while.

BTW: Big thanks to someone named fl0rixn from the RIOT games Third Party developer discord channel, he was a great help.


## To run the website locally:

If you want to run the project locally, for some reason, here are some instructions:

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

You can set your own port to be whatever you want. As for the api-key, you can either get your own by going onto RIOT API, or if you know me personally, just email me and I can tell you more. Hopefully my website will be approved to have a key by then.

Now, all you have to do to run it is to type
~~~
node index.js
~~~
into the command line (that is still on the league-stat-tracker-main folder) and then run the index.html file. Woohoo.
