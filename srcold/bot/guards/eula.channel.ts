import {DiscordGuard} from "discord-nestjs-xzyv";
import {ClientEvents, Message} from "discord.js";
import {BotConfig} from "../bot.config";

export class EulaChannel implements DiscordGuard {
	canActive(
		event: keyof ClientEvents,
		context: any
	): boolean | Promise<boolean> {
		let pass = false;
		// event: 'Message',
		if (event == "messageCreate") {
			pass = (context[0] as Message).channel.id == BotConfig.Channel.Eula;
		}
		return pass;
	}
}
