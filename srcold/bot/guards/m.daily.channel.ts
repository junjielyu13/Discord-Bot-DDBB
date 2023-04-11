import {DiscordGuard} from "discord-nestjs-xzyv";
import {ClientEvents, Message} from "discord.js";
import {BotConfig} from "../bot.config";

export class MDailyChannel implements DiscordGuard {
	canActive(
		event: keyof ClientEvents,
		context: any
	): boolean | Promise<boolean> {
		let pass = false;
		// event: 'Message',
		if (event == "messageCreate") {
			pass = (context[0] as Message).channel.id == "834105346477785089";
		}
		return pass;
	}
}
