import { cron } from "https://deno.land/x/deno_cron@v1.0.0/cron.ts";
import {
  createBot,
  Intents,
  startBot,
} from "https://deno.land/x/discordeno@18.0.1/mod.ts";
import fetchMatches from "./valorant/fetch-matches.ts";
import { matchEmbed } from "./discord/embed.ts";
import config from "./config.json" assert { type: "json" };

const bot = createBot({
  token: config.discord.token,
  intents: Intents.Guilds | Intents.GuildMessages,
});

bot.events.ready = (b) => {
  console.log("Successfully connected to gateway");

  cron("1 */5 * * * *", async () => {
    const unfetchedMatches = await fetchMatches();
    for (const match of unfetchedMatches.reverse()) {
      await b.helpers.sendMessage(config.discord.match_history_channel, {
        embeds: [matchEmbed(match)],
      });
    }

    await b.helpers.sendMessage(config.discord.match_history_channel, {
      embeds: [],
      file: [],
    });
  });
};

await startBot(bot);
