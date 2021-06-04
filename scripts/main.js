let userNameButton = document.getElementById('UIDButton');
let userInputBox = document.getElementById('UIDInput');
let displayBody = document.getElementById('statsBody');
let wrongName = document.getElementById('wrongName');
let waitScreen = document.getElementById('waitScreen');
var puuid;
var summonerId;

userInputBox.addEventListener("keyup", event => {//make it so that pressing enter makes the textbox submit
    if (event.key !== "Enter") return;
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
    profilePic.src = './dragontail-stats/11.10.1/img/profileicon/' + summonerInfo.profileIconId + '.png';
}

async function fillRankedStats(rankedInfo) {

    let rank = document.getElementById('rank');//select elements
    let rankedEmblem = document.getElementById('rankLogo');
    let winRate = document.getElementById('winRate');
    let winsLosses = document.getElementById('winsLosses');
    try {//if an error occurs the person probably doesn't have any rank
        console.log(rankedInfo);//preform some calcs and show the data
        let rankTier = rankedInfo[0].tier + " " + rankedInfo[0].rank;
        let rankSrc = rankedInfo[0].tier.toLowerCase();
        let rankSrc1 = rankSrc.slice(0, 1);
        let WR = rankedInfo[0].wins / (rankedInfo[0].wins + rankedInfo[0].losses) * 100;//calculate winrate

        rankSrc1 = rankSrc1.toUpperCase();//src for ranked emblem
        rankSrc2 = rankSrc.slice(1, rankSrc.length);
        rankSrc = rankSrc1 + rankSrc2;
        console.log(rankSrc);

        winRate.textContent = Math.trunc(WR) + "%";//put info onto the page
        rankedEmblem.style.display = 'block';
        rankedEmblem.src = './dragontail-stats/ranked-emblems/Emblem_' + rankSrc + '.png';
        rank.textContent = rankTier;
        winsLosses.textContent = rankedInfo[0].wins + "W " + rankedInfo[0].losses + "L";
    } catch (err) {
        rank.textContent = "Not Ranked"
        winsLosses.style.display = 'none';
        winRate.style.display = 'none';
        rankedEmblem.style.display = 'none';
    }
}

async function fillMatchHistory(matchHistory, _callback) {

    try {
        console.log(matchHistory);
        let container = document.getElementById('historyContainer');
        container.style.display = 'none';
        removeElementsByClass('match');
        for (let i = 0; i < matchHistory.length; i++) {//5 previous games
            let match = document.createElement('div');
            match.className = 'match';

            let matchId = matchHistory[i];//grab data
            let response = fetchData(matchId, 'http://localhost:3000/matchInfo/by-matchid/');
            let matchInfo = await (await response).json();
            console.log(matchInfo);

            fillMatch(matchInfo, match);
            container.appendChild(match);
        }

        container.style.display = 'block';
    } catch (err) {
        console.log(err);
    }

    _callback();
}

async function fillMatch(matchInfo, match) {
    //metadata -> participants -> find puuid match index
    //participants -> index -> team
    //team id 100 = index 0, team id 200 = index 1 -> win (true/false) -> change background colour
    //queueId 450 = ARAM, 420 = Ranked, 400 = Norms, 1300 = Nexus blitz... why, lol.
    try {
        let playerIndex;
        for (let i = 0; i < 10; i++) {
            if (matchInfo.metadata.participants[i] === puuid) {
                playerIndex = i;
            }

        }
        let playerInfo = matchInfo.info.participants[playerIndex];
        let playerTeam = playerInfo.teamId;

        let win = false;
        if (playerTeam === 100) {
            if (matchInfo.info.teams[0].win) {
                win = true;
            }
        } else if (playerTeam === 200) {
            if (matchInfo.info.teams[1].win) {
                win = true;
            }
        }
        if (win === false) {//change background colour if lost
            match.style.backgroundColor = "lightpink";
        }

        let basicGameDisplay = document.createElement('div');//basic info: Game type & Win or loss.
        basicGameDisplay.className = "match_basic";
        let gameType = document.createElement('p');
        gameType.className = 'game_type';
        let winStatus = document.createElement('p');
        winStatus.className = 'win_status';

        if (matchInfo.info.queueId === 450) {//show game type
            gameType.textContent = "ARAM";
        } else if (matchInfo.info.queueId === 400) {
            gameType.textContent = "Normal"
        } else if (matchInfo.info.queueId === 420) {
            gameType.textContent = "Ranked";
        } else if (matchInfo.info.queueId === 1300) {
            gameType.textContent = "Nexus Blitz";
            gameType.style.fontSize = "10px";
        }

        basicGameDisplay.appendChild(winStatus);
        basicGameDisplay.appendChild(gameType);

        if (win === true) {
            winStatus.textContent = "win";
            winStatus.style.color = "blue";
        } else if (win === false) {
            winStatus.textContent = "loss";
            winStatus.style.color = "red";
        }

        match.appendChild(basicGameDisplay);
        let championPlayed = document.createElement('div');//create champion display div
        championPlayed.className = "match_champ";
        match.appendChild(championPlayed);
        championPlayed.textContent = playerInfo.championName;//put in champ name

        let championImage = document.createElement('img');//create champion image and fill it
        championImage.className = "match_image";
        championImage.src = './dragontail-stats/img/champion/tiles/' + playerInfo.championName + '_0.jpg';//champ image from dragontail
        championPlayed.appendChild(championImage);

        let kdaDisplay = document.createElement('div');
        let KDA = playerInfo.kills + '/' + playerInfo.deaths + '/' + playerInfo.assists;
        kdaDisplay.textContent = KDA;
        kdaDisplay.className = 'kda_display'
        match.appendChild(kdaDisplay);

    } catch (err) {
        let errorMessage = document.createElement('div');
        errorMessage.textContent = err + "(probably non-supported game type)";
        match.appendChild(errorMessage);
    }
}

async function fillDisplayBody(summonerInfo, _callback) {
    fillProfile(summonerInfo);
    //grab ranked stats and display
    {
        summonerId = summonerInfo.id;
        let response = fetchData(summonerId, 'http://localhost:3000/summonerRankedStats/by-id/');//grab ranked stats
        let rankedInfo = await (await response).json();
        fillRankedStats(rankedInfo);
    }
    //grab match history and display
    {
        puuid = summonerInfo.puuid;
        let response = fetchData(puuid, 'http://localhost:3000/summonerMatchHistory/by-puuid/');//grab previous five games
        let matchHistory = await (await response).json();
        fillMatchHistory(matchHistory, function () {
            _callback();
        });
    }



}

userNameButton.onclick = async function () {//when the search button is clicked

    displayBody.style.display = 'none';//hide everything currently on the page
    waitScreen.style.display = 'none';
    wrongName.style.display = 'none';
    let summonerName = userInputBox.value;
    let response = fetchData(summonerName, 'http://localhost:3000/summonerInfo/by-name/');
    let summonerInfo = await (await response).json();
    console.log(summonerInfo);

    try {//check to see if the request is valid
        let status = summonerInfo.status.status_code;
        if (status === 404) {
            console.log("The username is invalid.");
            displayBody.style.display = 'none';
            wrongName.style.display = 'block';
        } else if (status === 403) {
            console.log("Bad API key")
            displayBody.style.display = 'none';
            wrongName.style.display = 'block';
            wrongName.textContent = "Bad API key";
        }
    } catch (err) {
        console.log("The username works.");

        waitScreen.style.display = 'block';
        fillDisplayBody(summonerInfo, function () {
            waitScreen.style.display = 'none';
            wrongName.style.display = 'none';
            displayBody.style.display = 'block';
        });
    }

}

function removeElementsByClass(className) {
    const elements = document.getElementsByClassName(className);
    while (elements.length > 0) {
        elements[0].parentNode.removeChild(elements[0]);
    }
}