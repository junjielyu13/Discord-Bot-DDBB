import {DiscordClient} from "discord-nestjs-xzyv";
import {VerbalService} from "../bot/utils/verbal.service";
import {Guild} from "discord.js";

export interface BotClient extends DiscordClient {
	verbalFilter: VerbalService;
	defaultGuild: Guild;
}
