let levelDisplay = document.querySelector('h3')
let userNameButton = document.getElementById('UIDButton')
let userInputBox = document.getElementById('UIDInput')
let displayBody = document.getElementById('statsBody')
let wrongName = document.getElementById('wrongName')
let profile = document.getElementById('profile')

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
        //let status = await response.status;
        //let body = await response.json();//parse to json file
        console.log(response);
        return response;
    } catch (err) {
        console.log(err);
    }
}

async function getProfilePic(summonerId) {
    try {
        let response = await fetch('http://ddragon.leagueoflegends.com/cdn/10.18.1/data/en_US/profileicon.json', {
            method: 'GET',
        });
    }

}

function showDisplayBody(status, summonerInfo) {
    if (status === 200) {
        displayBody.style.display = "block";
        profile.textContent = summonerInfo.name;
    }
    else
        wrongName.style.display = "block";
}

userNameButton.onclick = async function () {

    let summonerName = userInputBox.value;
    let fullResponse = getInfo(summonerName);

    let status = (await fullResponse).status;
    console.log(status);
    let summonerInfo = await (await fullResponse).json();
    console.log(summonerInfo);
    showDisplayBody(status, summonerInfo);
}