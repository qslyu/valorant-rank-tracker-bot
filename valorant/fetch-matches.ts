import { Match } from "./match.ts";

import config from "../config.json" assert { type: "json" };
import data from "../data/data.json" assert { type: "json" };
import maps from "../data/maps.json" assert { type: "json" };

let latest_fetched_match = data.latest_fetched_match;

// Return unfetched matches in order of newest to oldest
const fetchMatches = async (): Promise<Match[]> => {
  console.log("Fetching match history...");

  const matchesResponse = await fetch(
    `https://api.henrikdev.xyz/valorant/v3/by-puuid/matches/${config.valorant.region}/${config.valorant.puuid}?filter=competitive`
  );

  const matchesData = await matchesResponse.json();
  if (matchesData.status !== 200) {
    console.log("Fetch faild ;;");
    return [];
  }

  const matches = matchesData.data;

  const mmrHistoryResponse = await fetch(
    `https://api.henrikdev.xyz/valorant/v1/by-puuid/mmr-history/${config.valorant.region}/${config.valorant.puuid}`
  );

  const mmrHistoryData = await mmrHistoryResponse.json();
  if (mmrHistoryData.status !== 200) {
    console.log("Fetch faild ;;");
    return [];
  }

  const mmrHistory = mmrHistoryData.data;

  const unfetchedMatches: Match[] = [];

  for (const match of matches) {
    const matchMetadata = match.metadata;

    if (matchMetadata.matchid === latest_fetched_match) {
      break;
    }

    console.log("Unfetched match found!");

    const map = maps.find((map) => map.displayName === matchMetadata.map);
    const mapIcon = map!.listViewIcon;

    const me = match.players.all_players.find(
      (player: { puuid: string }) => player.puuid === config.valorant.puuid
    );

    const myStats = me.stats;

    const myTeam = match.teams[me.team.toLowerCase()];

    let currentTier = 0;
    let currentTierPatched = "Unranked";
    let rankingInTier = null;
    let mmrChangeToLastGame = null;
    let tierIcon =
      "https://media.valorant-api.com/competitivetiers/564d8e28-c226-3180-6285-e48a390db8b1/0/smallicon.png";

    const a = mmrHistory.find(
      (m: { date_raw: number }) => m.date_raw === matchMetadata.game_start
    );
    if (a !== undefined) {
      currentTier = a.currenttier;
      currentTierPatched = a.currenttierpatched;
      rankingInTier = a.ranking_in_tier;
      mmrChangeToLastGame = a.mmr_change_to_last_game;
      tierIcon = a.images.small;
    }

    unfetchedMatches.push({
      id: matchMetadata.matchid,
      seasonId: matchMetadata.season_id,
      map: matchMetadata.map,
      gemeLength: matchMetadata.game_length,
      gameStart: matchMetadata.game_start,
      gameStartPatched: new Date(matchMetadata.game_start_patched),

      hasWon: myTeam.has_won,
      roundsWon: myTeam.rounds_won,
      roundsLost: myTeam.rounds_lost,

      player: {
        currentTier: currentTier,
        currentTierPatched: currentTierPatched,
        rankingInTier: rankingInTier,
        mmrChangeToLastGame: mmrChangeToLastGame,
        character: me.character,
        stats: {
          score: myStats.score,
          kills: myStats.kills,
          deaths: myStats.deaths,
          assists: myStats.assists,
          bodyShots: myStats.bodyshots,
          headShots: myStats.headshots,
          legShots: myStats.legshots,
        },
      },
      assets: {
        tierIcon: tierIcon,
        mapIcon: mapIcon,
        agentIcon: me.assets.agent.small,
      },
    });
  }

  latest_fetched_match = matches[0].metadata.matchid;
  Deno.writeTextFile(
    "./data/data.json",
    JSON.stringify({
      latest_fetched_match: latest_fetched_match,
    })
  );

  console.log("Success ^^");

  return unfetchedMatches;
};

export default fetchMatches;
