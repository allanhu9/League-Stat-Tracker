const express = require('express');
const app = express();
const port = 3000;
const fetch = require('node-fetch');
const cors = require('cors');
let userId;

async function fetchData(summonerSpec, key, url) {
    let fullUrl = url + summonerSpec + '?api_key=' + key;
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

    res.send(`nothing here right now!`)

})

app.get('/summonerRankedStats/by-id/:id', async (req, res) =>{
    const { apiKey, apiRankedInfoById } = require(`./config`);
    var id = req.params.id;
    const data = await fetchData(id, `${apiKey}`, `${apiRankedInfoById}`)
    res.send(data);
})

app.get('/summonerInfo/by-name/:name', async (req, res) => {
    const { apiKey, apiBasicInfoByName } = require(`./config`);
    var name = req.params.name;
    const data = await fetchData(name, `${apiKey}`, `${apiBasicInfoByName}`)
    res.send(data);
})

app.listen(port, () => {
    console.log(`League Stat Tracker BackEnd listening at http://localhost:${port}`)
})