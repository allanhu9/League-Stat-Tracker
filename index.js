const express = require('express');
const app = express();
const port = 3000;
const fetch = require('node-fetch');
const cors = require('cors');

async function fetchData(summonerName, key, url) {
    let fullUrl = url + summonerName + '?api_key=' + key;
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

app.get('/summonerInfo/by-name/:name', async (req, res) => {
    const { apiKey, apiGetByName } = require(`./config`);
    var name = req.params.name;
    const data = await fetchData(name, `${apiKey}`, `${apiGetByName}`)
    res.send(data)
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})