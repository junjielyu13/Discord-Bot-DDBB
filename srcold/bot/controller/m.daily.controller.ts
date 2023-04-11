import {Controller} from "@nestjs/common";
import {On, UseGuards} from "discord-nestjs-xzyv";
import {Message} from "discord.js";
import {MemberService} from "../utils/member.service";
import {MessageFilter} from "../guards/message.filter";
import {EmbedFactory} from "../utils/embed.factory";
import {DailyChannel} from "../guards/daily.channel";
import {MDailyChannel} from "../guards/m.daily.channel";
import moment from "moment";

@Controller()
export class MDailySignInController {
	constructor(
		private readonly memberService: MemberService,
		private readonly embedFactory: EmbedFactory
	) {}

	@On({
		// event: 'Message',
		event: "messageCreate",
	})
	@UseGuards(MessageFilter, MDailyChannel)
	async onMessage(msg: Message) {
		let now = moment(moment());
		if (now.isBetween(moment("6:00", "HH:mm"), moment("8:00", "HH:mm"))) {
			if (msg.content == "打卡") {
				if (await this.memberService.m_signIn(msg.member.id)) {
					let embed = await this.embedFactory.getMSignInCard(
						msg.member
					);
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
		} else {
			msg.reply("不在打卡时间内").then(async (m) => {
				await msg.delete();
				await m.delete();
			});
		}
	}
}
