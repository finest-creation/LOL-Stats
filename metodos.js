const riotKey = "RGAPI-412e3c92-2c76-4402-a29f-68d4c141c1c7";
//Mismomis Bloblis

async function getAccountData() {
    
    // Transformar nome da conta para inserir na URL para o pedido na API da Riot.
    var accountName = document.getElementById("nomeConta").value;

    while(accountName.includes(" ")) {
        var espaco = accountName.indexOf(" ");
        accountName = accountName.substring(0, espaco) + '%20' + accountName.substring(espaco + 1);
    }
    
    // Pedido na API para conseguir dados da conta (Retorna uma lista de atributos da conta).
    const linkAccount = `https://br1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${accountName}?api_key=${riotKey}`;

    let AccResponse = await fetch(linkAccount);
    let AccData = await AccResponse.json();

    // Pedido na API para conseguir dados de partidas de um jogador (Retorna List<String>).
    const linkMatches = `https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/${AccData.puuid}/ids?start=0&count=20&api_key=${riotKey}`

    let MatchResponse = await fetch(linkMatches);
    let MatchesData = await MatchResponse.json();

    // Mostrar os dados da conta do jogador.
    document.getElementById("summonerName").innerHTML = AccData.name;
    document.getElementById("summonerLevel").innerHTML = "Level: " + AccData.summonerLevel;

    var idImagemResponse = await fetch("http://ddragon.leagueoflegends.com/cdn/13.10.1/data/en_US/profileicon.json");
    var idImagemData = await idImagemResponse.json();

    document.getElementById("summonerIcon").src = "http://ddragon.leagueoflegends.com/cdn/13.10.1/img/profileicon/" + idImagemData.data[AccData.profileIconId].image.full;

    // Mostrar os dados de partidas do jogador.
    var idChampionResponse = await fetch("http://ddragon.leagueoflegends.com/cdn/13.10.1/data/en_US/champion.json");
    var idChampionData = await idChampionResponse.json();
    
    // Percorrer todas as partidas encontradas.
    for (let index = 0; index < 20; index++) {
        var meuTime;
        var minhaPos;
        var linkMatch = `https://americas.api.riotgames.com/lol/match/v5/matches/${MatchesData[index]}?api_key=${riotKey}`;
        var matchIdResponse = await fetch(linkMatch);
        var matchData = await matchIdResponse.json();
        // Achar todas as partidas ranqueadas do jogador.
        if (matchData.info.queueId == 420 || matchData.info.queueId == 440) {
            // Percorrer pelos participantes da partida para achar dados do jogador.
            for (let index1 = 0; index1 < 10; index1++) {
                if (matchData.info.participants[index1].summonerName == AccData.name) {
                    // Criar segunda tabela com os dados obtidos
                    var table = document.getElementById("tabela");
                    var row = table.insertRow(1);
                    var cell = row.insertCell(0);
                    var cell2 = row.insertCell(1);
                    var cell3 = row.insertCell(2);
                    var cell4 = row.insertCell(3);
                    var cell5 = row.insertCell(4);
                    cell.innerHTML = matchData.info.participants[index1].championName + "<br>";
                    cell2.innerHTML = matchData.info.participants[index1].teamPosition;
                    cell3.innerHTML = matchData.info.participants[index1].kills + "/" + matchData.info.participants[index1].deaths + "/" + matchData.info.participants[index1].assists;
                    if (matchData.info.participants[index1].win == true) {
                        cell4.innerHTML = "Vitória";
                    } else {
                        cell4.innerHTML = "Derrota";
                    }
                    var img = document.createElement('img');
                    img.src = "http://ddragon.leagueoflegends.com/cdn/13.10.1/img/champion/" + idChampionData.data[matchData.info.participants[index1].championName].image.full;
                    cell.appendChild(img);
                    
                    meuTime = matchData.info.participants[index1].teamId;
                    minhaPos = matchData.info.participants[index1].teamPosition;
                }
            }
            for (let index2 = 0; index2 < 10; index2++) {
                if(matchData.info.participants[index2].teamId != meuTime && matchData.info.participants[index2].teamPosition == minhaPos) {
                    var img = document.createElement('img');
                    img.src = "http://ddragon.leagueoflegends.com/cdn/13.10.1/img/champion/" + idChampionData.data[matchData.info.participants[index2].championName].image.full;
                    cell5.innerHTML = matchData.info.participants[index2].championName + "<br>";
                    cell5.appendChild(img);

                    meuTime = null;
                    minhaPos = null;
                }
            }
        }

    }

}

document.getElementById("meuBotao").addEventListener("click", getAccountData);

 
