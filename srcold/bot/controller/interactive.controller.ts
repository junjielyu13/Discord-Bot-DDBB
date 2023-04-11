import {Controller} from "@nestjs/common";
import {On, UseGuards} from "discord-nestjs-xzyv";
import {Message} from "discord.js";
import {MessageFilter} from "../guards/message.filter";
import {EmbedFactory} from "../utils/embed.factory";
import {InteractiveChannel} from "../guards/interactive.channel";

@Controller()
export class InteractiveController {
	constructor(private readonly embedFactory: EmbedFactory) {}

	@On({
		// event: 'Message',
		event: "messageCreate",
	})
	@UseGuards(MessageFilter, InteractiveChannel)
	async onMessage(msg: Message) {
		if (msg.content == "修行") {
			// let embed = await this.embedFactory.getXiuXianCard(msg.member);
			// await msg.reply(embed);
		}
	}
}
