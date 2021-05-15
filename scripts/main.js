
let levelDisplay = document.querySelector('h3')
let userNameButton = document.getElementById('UIDButton')
let userInputBox = document.getElementById('UIDInput')

async function getInfo(summonerName) {


    /*fetch(url, {
        mode: 'no-cors'
    }).then(function (response) {
        console.log(response);
        response.json().then(function (summonerInfo) {
            console.log(summonerInfo);
            levelDisplay.textContent = summonerInfo.summonerLevel;
        })
    }).catch(function (err) {
        console.log(err)
        levelDisplay.textContent = 'Fetch problem: ' + err.message;
    });
    */

    //grab data from express server:
    let url = 'http://localhost:3000/summonerInfo/by-name/' + summonerName;
    console.log(url);
    try {
        let response = await fetch(url, {
            method: 'GET',
        });
        let body = await response.json();
        return body;
    } catch (err) {
        console.log(err);
    }
}

userNameButton.onclick = function () {
    let summonerName = userInputBox.value;
    let summonerInfo = displayUserLevel(summonerName);


}