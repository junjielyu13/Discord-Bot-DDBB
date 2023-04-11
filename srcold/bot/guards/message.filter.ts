import {Client, DiscordGuard} from "discord-nestjs-xzyv";
import {ClientEvents, Message, EmbedBuilder} from "discord.js"; //EmbedBuilder
import {BotClient} from "../../interfaces/bot.client";
import {BotConfig} from "../bot.config";

const cache: Map<string, boolean> = new Map<string, boolean>();

//用来过滤机器人发送的消息
export class MessageFilter implements DiscordGuard {
	@Client()
	botClient: BotClient;

	canActive(event: keyof ClientEvents, context: any): boolean {
		// event: 'Message',
		if (event == "messageCreate") {
			let msg = context[0] as Message;
			if (msg.guild) {
				if (!cache.has(msg.id)) {
					if (msg.member) {
						let result = false;
						do {
							if (msg.member.user.bot) {
								break;
							}
							if (
								!BotConfig.FilterWhiteList.includes(
									msg.channel.id
								)
							) {
								const filterValue =
									this.botClient.verbalFilter.filter(
										msg.content
									);
								if (!filterValue.pass) {
									sendNoPassSensitiveMessage(
										msg,
										filterValue.text
									);
									break;
								}
							}
							result = true;
						} while (false);
						cache.set(msg.id, result);
						return result;
					}
				} else {
					return cache.get(msg.id);
				}
			}
		}
		return true;
	}
}

function sendNoPassSensitiveMessage(msg: Message, filteredMessage) {
	msg.delete().then(async () => {
		let username = msg.member.displayName;
		let userAvatar = msg.member.user.avatarURL();
		// let message = new EmbedBuilder();
		// EmbedBuilder.from();
		// message.setColor('#e53935');
		await msg.reply("**请您注意文明! 消息以撤回过滤处理!**");
	});
}
