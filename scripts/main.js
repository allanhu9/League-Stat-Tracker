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
    let url = "https://obscure-bayou-75383.herokuapp.com/" + preURL + summonerSpec;
    //console.log(url);
    try {
        let response = await fetch(url, {
            method: 'GET',
        });
        //let status = await response.status;
        //let body = await response.json();//no need to parse to json, it already is
        //console.log(response);
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
    profilePic.src = 'http://ddragon.leagueoflegends.com/cdn/11.10.1/img/profileicon/' + summonerInfo.profileIconId + '.png';
    //profilePic.src = './dragontail-stats/11.10.1/img/profileicon/' + summonerInfo.profileIconId + '.png';
}

async function fillRankedStats(rankedInfo) {

    let rank = document.getElementById('rank');//select elements
    let rankedEmblem = document.getElementById('rankLogo');
    let winRate = document.getElementById('winRate');
    let winsLosses = document.getElementById('winsLosses');
    try {//if an error occurs the person probably doesn't have any rank
        console.log(rankedInfo);//preform some calcs and show the data
        let rankTier = rankedInfo[0].tier + " " + rankedInfo[0].rank;
        let WR = rankedInfo[0].wins / (rankedInfo[0].wins + rankedInfo[0].losses) * 100;//calculate winrate

        /*
        let rankSrc1 = rankSrc.slice(0, 1);
        let rankSrc = rankedInfo[0].tier.toLowerCase();
        rankSrc1 = rankSrc1.toUpperCase();//src for ranked emblem
        rankSrc2 = rankSrc.slice(1, rankSrc.length);
        rankSrc = rankSrc1 + rankSrc2;
        console.log(rankSrc);
        */
        //put info onto the page
        winRate.textContent = Math.trunc(WR) + "% " + rankedInfo[0].leaguePoints + "LP";
        rankedEmblem.src = 'https://fl0rixn.de/cdn/libs/lol/ranks/' + rankedInfo[0].tier + '.png';
        rankedEmblem.style.display = 'block';
        //rankedEmblem.src = './dragontail-stats/ranked-emblems/Emblem_' + rankSrc + '.png';
        //https://fl0rixn.de/cdn/libs/lol/ranks/Position_Challenger-Bot.png <- position links
        rank.textContent = rankTier;
        winsLosses.textContent = rankedInfo[0].wins + "W " + rankedInfo[0].losses + "L";

        winsLosses.style.display = 'block';
        winRate.style.display = 'block';

    } catch (err) {
        rank.textContent = "Not Ranked"
        rankedEmblem.src = 'https://fl0rixn.de/cdn/libs/lol/ranks/unranked.png';
        rankedEmblem.style.width = '12vh';
        winsLosses.style.display = 'none';
        winRate.style.display = 'none';
    }
}

async function fillMatchHistory(matchHistory, _callback) {
    //console.log(matchHistory);

    let container = document.getElementById('historyContainer');
    container.style.display = 'none';
    removeElementsByClass('match');
    let counter = 0;
    for (let i = 0; i < matchHistory.length; i++) {//5 previous games (also, check if it is a legit game)


        let match = document.createElement('div');
        match.className = 'match';
        await sleep(1);
        let matchId = matchHistory[i];//grab data
        let response = fetchData(matchId, 'matchInfo/by-matchid/');
        let matchInfo = await (await response).json();
        //console.log(matchInfo);
        try {
            if (matchInfo.status.status_code === 404) {//skips games that do not count as matchmade/are not saved.
                continue;
            }
        } catch (err) {
            if (counter === 5) //stop adding games once it has filled 5 games.
                break;
            //console.log(err);
            fillMatch(matchInfo, match);
            container.appendChild(match);
            counter++;
        }

    }

    container.style.display = 'block';

    _callback();
}

async function fillMatch(matchInfo, match) {
    //metadata -> participants -> find puuid match index
    //participants -> index -> team
    //team id 100 = index 0, team id 200 = index 1 -> win (true/false) -> change background colour
    //queueId 450 = ARAM, 420 = Ranked, 400 = Norms, 1300 = Nexus blitz, 850 and 830 are bot games... why, lol.
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
            gameType.textContent = "Normal";

        } else if (matchInfo.info.queueId === 420) {
            gameType.textContent = "Ranked";

        } else if (matchInfo.info.queueId === 1300) {
            gameType.textContent = "Nexus Blitz";
            gameType.style.fontSize = "8px";
        } else if (matchInfo.info.queueId === 850 || matchInfo.info.queueId === 830) {
            gameType.textContent = "Coop vs AI";
            gameType.style.fontSize = "10px";
        }

        basicGameDisplay.appendChild(winStatus);
        basicGameDisplay.appendChild(gameType);

        if (win === true) {
            winStatus.textContent = "Win";
            winStatus.style.color = "blue";
        } else if (win === false) {
            winStatus.textContent = "Loss";
            winStatus.style.color = "red";
        }

        match.appendChild(basicGameDisplay);
        let championPlayed = document.createElement('div');//create champion display div
        championPlayed.className = "match_champ";
        match.appendChild(championPlayed);
        championPlayed.textContent = playerInfo.championName;//put in champ name

        let championImage = document.createElement('img');//create champion image and fill it
        championImage.className = "match_image";
        //let imageSrc = fetch("http://ddragon.leagueoflegends.com/cdn/img/champion/tiles/" + playerInfo.championName + "_0.jpg")
        championImage.src = "https://ddragon.leagueoflegends.com/cdn/img/champion/tiles/" + playerInfo.championName + "_0.jpg"//champ image from dragontail
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

async function fillMastery(masteryList) {

    try {

        let response = await fetch('http://ddragon.leagueoflegends.com/cdn/11.11.1/data/en_US/champion.json');
        let dDragon = await (await response).json();
        console.log(dDragon);
        console.log(masteryList);
        let masteryDisplay = document.getElementById('masteryDisplay');
        removeElementsByClass('champ_mastery');
        for (let i = 0; i < 5; i++) {
            let championMasteryDisplay = document.createElement('div');

            championMasteryDisplay.className = 'champ_mastery';
            let championData = masteryList[i];
            await sleep(1);
            fillChampMastery(championData, dDragon, championMasteryDisplay)
            masteryDisplay.appendChild(championMasteryDisplay);

        }
    } catch (err) {
        console.log(err);
    }
}

async function fillChampMastery(championData, dDragon, championMasteryDisplay) {
    let championName;
    let championId;

    for (var key in dDragon.data) {
        if (dDragon.data.hasOwnProperty(key)) {
            if (championData.championId === parseInt(dDragon.data[key].key)) {
                championId = dDragon.data[key].id;
                championName = dDragon.data[key].name;
            }
        }
    }
    let championContainer = document.createElement('div');//champion container
    championContainer.className = 'mastery_champ_container';

    let champImg = document.createElement('img');//image of champion
    champImg.className = 'mastery_champ_img';
    champImg.src = "http://ddragon.leagueoflegends.com/cdn/img/champion/tiles/" + championId + "_0.jpg";

    let championNameDisplay = document.createElement('p');//name of champion
    championNameDisplay.className = 'mastery_champ_name';
    championNameDisplay.textContent = championName;

    let masteryContainer = document.createElement('div');//Mastery container
    masteryContainer.className = 'mastery_container';

    let pointsContainer = document.createElement('div');
    pointsContainer.className = 'points_container';
    let pointsDisplay = document.createElement('p');
    pointsDisplay.className = 'points_display';

    let masteryEmblem;
    if (championData.championLevel > 3) {
        masteryEmblem = document.createElement('img');//mastery emblem
        masteryEmblem.className = 'mastery_emblem';
        masteryEmblem.src = "https://raw.communitydragon.org/10.1/game/assets/loadouts/summoneremotes/rewards/mastery/em_champ_mastery_0" + championData.championLevel + "_selector.png";
    }

    let masteryLevel = document.createElement('p');//mastery level in text
    masteryLevel.className = 'mastery_level';
    masteryLevel.textContent = 'Level: ' + championData.championLevel;//fill in the mastery level

    championContainer.appendChild(championNameDisplay);//fill up the champion container
    championContainer.appendChild(champImg);

    masteryContainer.appendChild(masteryLevel);//show the image assuming mastery level is 4 or greater
    if (championData.championLevel > 3) {
        masteryContainer.appendChild(masteryEmblem);
    }
    pointsDisplay.textContent = "Points: " + championData.championPoints;
    pointsContainer.appendChild(pointsDisplay);

    championMasteryDisplay.appendChild(championContainer);//put everything into the mastery display
    championMasteryDisplay.appendChild(masteryContainer);
    championMasteryDisplay.appendChild(pointsContainer);
    /*for (let i = 0; i < Object.keys(dDragon.data).length; i++) {
        console.log("printing " + dDragon.data[i]);
    }*/

    /*for (let i = 0; i < dDragon.data.length; i++) {
        console.log(dDragon.data[i]);
    }*/

}

async function fillDisplayBody(summonerInfo, _callback) {
    fillProfile(summonerInfo);
    //GET ranked stats and display
    {
        summonerId = summonerInfo.id;
        let response = fetchData(summonerId, 'summonerRankedStats/by-id/');//fetch ranked stats
        let rankedInfo = await (await response).json();
        fillRankedStats(rankedInfo);
    }
    //GET mastery info and display
    {
        summonerId = summonerInfo.id;
        let response = fetchData(summonerId, 'mastery/by-id/');//fetch mastery of champions
        let masteryList = await (await response).json();
        //console.log(masteryList)
        fillMastery(masteryList);
    }

    //GET match history and display
    {
        puuid = summonerInfo.puuid;
        let response = fetchData(puuid, 'summonerMatchHistory/by-puuid/');//fetch previous five games
        let matchHistory = await (await response).json();
        console.log(matchHistory);
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
    let response = fetchData(summonerName, 'summonerInfo/by-name/');
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

    //temporary fast implementation to stop spamming
    sleep(5000);//Wait 5 seconds.

}

function removeElementsByClass(className) {
    const elements = document.getElementsByClassName(className);
    while (elements.length > 0) {
        elements[0].parentNode.removeChild(elements[0]);
    }
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}