import {Controller} from "@nestjs/common";
import {Client, On, UseGuards} from "discord-nestjs-xzyv";
import {Message, Role} from "discord.js";
import {MessageFilter} from "../guards/message.filter";
import {HelperService} from "../utils/helper.service";
import {EulaChannel} from "../guards/eula.channel";
import {BotConfig} from "../bot.config";
import {BotClient} from "../../interfaces/bot.client";

@Controller()
export class EulaController {
	@Client() client: BotClient;
	vipRole: Role;
	constructor(private readonly helperService: HelperService) {}

	@On({
		// event: 'Message',
		event: "messageCreate",
	})
	@UseGuards(MessageFilter, EulaChannel)
	async onMessage(msg: Message) {
		if (this.vipRole == null) {
			this.vipRole = await this.helperService.getRoleById(
				BotConfig.Role.Member
			);
		}
		await msg.delete();
		let content = msg.content.toLowerCase();
		if (content == "yes") {
			await msg.member.roles.add(this.vipRole);
		} else if (content == "no") {
			await msg.member.kick();
		}
	}
}
