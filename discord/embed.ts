import { Embed } from "https://deno.land/x/discordeno@18.0.1/mod.ts";
import { Match } from "../valorant/match.ts";

export const matchEmbed = (match: Match): Embed => {
  const kills = match.player.stats.kills;
  const deaths = match.player.stats.deaths;
  const kd = deaths === 0 ? String(kills) : (kills / deaths).toFixed(2);

  const stats = match.player.stats;
  const hs =
    (100 * stats.headShots) /
    (stats.bodyShots + stats.headShots + stats.legShots);

  let rankDisplay = "";
  const mmrChangeToLastGame = match.player.mmrChangeToLastGame;

  if (mmrChangeToLastGame === null) {
    rankDisplay = "Unranked";
  } else {
    rankDisplay = `${match.player.rankingInTier}RR (${
      mmrChangeToLastGame >= 0 ? "+" : ""
    }${mmrChangeToLastGame})`;
  }

  return {
    color: match.hasWon ? 1500596 : 15684433,
    title: `${match.hasWon ? "VICTORY" : "DEFEAT"} ${match.roundsWon} - ${
      match.roundsLost
    }`,
    url: `https://tracker.gg/valorant/match/${match.id}`,
    description: `KDA **${match.player.stats.kills} / ${
      match.player.stats.deaths
    } / ${match.player.stats.assists}**\nK/D **${kd}**\nHS% **${Math.floor(
      hs
    )}%**`,
    timestamp: new Date(match.gameStartPatched).getTime() + 28800000,
    author: {
      name: rankDisplay,
      iconUrl: match.assets.tierIcon,
    },
    thumbnail: {
      url: match.assets.agentIcon,
    },
    image: {
      url: match.assets.mapIcon,
    },
    footer: {
      text: `${Math.floor(match.gemeLength / 60000)}minutes`,
    },
  };
};

export const chartEmbed = (match: Match): Embed => {
  return {
    title: "ELO",
  };
};
