const express = require('express');
const app = express();
const port = 3000;
const fetch = require('node-fetch');
const cors = require('cors');

async function fetchData(summonerSpec, key, url) {
    let fullUrl = url + summonerSpec + 'api_key=' + key;
    console.log(key)

    try {
        let response = await fetch(fullUrl, {
            method: 'GET',
        });
        console.log(response);
        let body = await response.json();
        console.log(body);
        return body;

    } catch (err) {
        console.log(err);
    }
}

app.use(cors());

app.get('/testplatform', (req, res) => {

    res.send(`nothing here right now!`);

})

app.get('/summonerRankedStats/by-id/:id', async (req, res) => {
    const { apiKey, apiRankedInfoById } = require(`./config`);
    let id = req.params.id;
    let spec = id + '?';
    const data = await fetchData(spec, `${apiKey}`, `${apiRankedInfoById}`);
    res.send(data);
})

app.get('/summonerInfo/by-name/:name', async (req, res) => {
    const { apiKey, apiBasicInfoByName } = require(`./config`);
    let name = req.params.name;
    let spec = name + '?';
    const data = await fetchData(spec, `${apiKey}`, `${apiBasicInfoByName}`);
    res.send(data);
})

app.get('/summonerMatchHistory/by-puuid/:puuid', async (req, res) => {//Just call for five matches at a time so I dont have to make a new fetch function
    const { apiKey, apiMatchesByPuuid } = require(`./config`);
    let puuid = req.params.puuid;
    let spec = puuid + '/ids?start=0&count=5&';//this is a really dumb solution to add in the start and count variables...
    const data = await fetchData(spec, `${apiKey}`, `${apiMatchesByPuuid}`);
    res.send(data);
    //start=0&count=20
    ///ids?start=0&count=5
})

app.get('/matchInfo/by-matchid/:matchid', async (req, res) => {
    const { apiKey, apiMatchDataByMatchId } = require(`./config`);
    let matchid = req.params.matchid;
    let spec = matchid + '?';
    const data = await fetchData(spec, `${apiKey}`, `${apiMatchDataByMatchId}`);
    res.send(data);

})

app.listen(port, () => {
    console.log(`League Stat Tracker Backend listening at http://localhost:${port}`);
})