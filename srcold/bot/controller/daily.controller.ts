import {Controller} from "@nestjs/common";
import {On, UseGuards} from "discord-nestjs-xzyv";
import {Message} from "discord.js";
import {MemberService} from "../utils/member.service";
import {MessageFilter} from "../guards/message.filter";
import {EmbedFactory} from "../utils/embed.factory";
import {DailyChannel} from "../guards/daily.channel";

@Controller()
export class DailySignInController {
	constructor(
		private readonly memberService: MemberService,
		private readonly embedFactory: EmbedFactory
	) {}

	@On({
		// event: 'Message',
		event: "messageCreate",
	})
	@UseGuards(MessageFilter, DailyChannel)
	async onMessage(msg: Message) {
		if (msg.content == "签到") {
			if (await this.memberService.signIn(msg.member.id)) {
				let embed = await this.embedFactory.getSignInCard(msg.member);
				await msg.reply(embed);
				await msg.delete();
			} else {
				msg.reply("您已经签到过了").then(async (m) => {
					await msg.delete();
					await m.delete();
				});
			}
		} else {
			await msg.delete();
		}
	}
}
