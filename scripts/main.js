let userNameButton = document.getElementById('UIDButton')
let userInputBox = document.getElementById('UIDInput')
let displayBody = document.getElementById('statsBody')
let wrongName = document.getElementById('wrongName')

userInputBox.addEventListener("keyup", event => {
    if(event.key !== "Enter") return; 
    userNameButton.click();
    event.preventDefault(); 
});


async function fetchData(summonerSpec, preURL) {

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
    let url = preURL + summonerSpec;
    console.log(url);
    try {
        let response = await fetch(url, {
            method: 'GET',
        });
        //let status = await response.status;
        //let body = await response.json();//no need to parse to json, it already is
        console.log(response);
        return response;
    } catch (err) {
        console.log(err);
    }
}

async function fillProfile(summonerInfo) {
    let profileName = document.getElementById('profileName')
    let profileLevel = document.getElementById('profileLevel')
    let profilePic = document.getElementById('profilePic')

    profileLevel.textContent = summonerInfo.summonerLevel;
    profileName.textContent = summonerInfo.name;
    let profilePicSrc = './dragontail_stats/11.10.1/img/profileicon/' + summonerInfo.profileIconId + '.png';
    console.log(profilePicSrc);
    profilePic.src = profilePicSrc;
    console.log(profilePic);

}

async function fillRankedStats(summonerInfo){
    let summonerId = summonerInfo.id;
    let response = fetchData(summonerId, 'http://localhost:3000/summonerRankedStats/by-id/');
    let rankedInfo = await (await response).json();
    console.log(rankedInfo);

}

async function fillDisplayBody(summonerInfo) {
    fillProfile(summonerInfo);
    fillRankedStats(summonerInfo);
    
}

userNameButton.onclick = async function () {

    let summonerName = userInputBox.value;
    let response = fetchData(summonerName, 'http://localhost:3000/summonerInfo/by-name/');

    let status = (await response).status;
    console.log(status);
    let summonerInfo = await (await response).json();
    console.log(summonerInfo);
    if(status === 200){
    displayBody.style.display = "block";
    fillDisplayBody(summonerInfo);
    }else{
        wrongName.style.display = "block";
    }
    
}