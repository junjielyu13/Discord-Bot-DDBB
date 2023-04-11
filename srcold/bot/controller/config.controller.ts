import {Controller} from "@nestjs/common";
import {On, UseGuards} from "discord-nestjs-xzyv";
import {MessageFilter} from "../guards/message.filter";
import {Message} from "discord.js";
import {HelperService} from "../utils/helper.service";
import {EmbedFactory} from "../utils/embed.factory";
import {BotConfig} from "../bot.config";
import {ConfigChannel} from "../guards/config.channel";

export type CommandCallBack = (
	msg: Message,
	command: string[]
) => Promise<Boolean>;

@Controller()
export class ConfigController {
	commandMap: Map<string, CommandCallBack>;

	constructor(
		private readonly embedFactory: EmbedFactory,
		private readonly helperService: HelperService
	) {
		this.commandMap = new Map<string, CommandCallBack>();
		this.commandMap.set("鸡汤", this.handlerQuotation.bind(this));
	}

	@On({
		// event: 'Message',
		event: "messageCreate",
	})
	@UseGuards(MessageFilter, ConfigChannel)
	async onMessage(msg: Message) {
		let shouldDelete = false;
		let str = msg.content.replace(/\s+/g, " ").trim();
		let command = str.split(" ");
		do {
			if (command.length > 0) {
				if (this.commandMap.has(command[0])) {
					if (
						!(await this.commandMap.get(command[0])(msg, command))
					) {
						break;
					}
				}
			}
			shouldDelete = true;
		} while (false);

		if (shouldDelete) {
			await msg.delete();
		}
	}

	@On({
		// @ts-ignore
		event: "raw",
	})
	async removeQuotation(raw) {
		let type = raw["t"];
		let channelID = "";
		if (
			type == "MESSAGE_REACTION_ADD" &&
			(channelID = raw["d"]["channel_id"]) == BotConfig.Channel.Config
		) {
			let messageID = raw["d"]["message_id"];
			let memberID = raw["d"]["user_id"];
			let emj = raw["d"]["emoji"]["name"];
			let message = await this.helperService.getChannelMessageByID(
				channelID,
				messageID
			);
			if (emj == "❌") {
				if (
					memberID != BotConfig.Self &&
					message.member.id == BotConfig.Self
				) {
					if (message.embeds) {
						let firstEmbed = message.embeds[0];
						if (firstEmbed) {
							const idPattern = /(?<=`).*?(?=`)/;
							let id = firstEmbed.description.match(idPattern);
							if (id) {
								let member =
									await this.helperService.getMemberById(
										memberID
									);
								let quotation = (
									await this.helperService.pickQuotation({
										short_id: id[0],
									})
								)[0];
								if (
									quotation &&
									member.displayName == quotation.author
								) {
									await message.fetch();
									await message.delete();
									await quotation.delete();
									await this.helperService.deleteQuotation(
										null,
										quotation
									);
								}
							}
						}
					}
				}
			}
		}
	}

	async handlerQuotation(msg: Message, command: string[]): Promise<boolean> {
		if (command[1] == "add") {
			let content = "";
			for (let i = 2; i < command.length; i++) {
				content += command[i] + " ";
			}
			content.trimEnd();
			if (content.length > 0) {
				let quotation = await this.helperService.newQuotation(
					msg.member.displayName,
					content
				);
				await msg
					.reply(await this.embedFactory.getQuotationCard(quotation))
					.then(async (m) => {
						await m.react("❌");
					});
				return true;
			} else {
				msg.reply("内容不能为空哦").then((r) => {
					r.delete();
				});
			}
		}
		return false;
	}
}
