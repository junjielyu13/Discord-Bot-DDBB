import {Controller} from "@nestjs/common";
import {MemberService} from "../utils/member.service";
import {On, UseGuards} from "discord-nestjs-xzyv";
import {Message, VoiceState} from "discord.js";
import {BotConfig} from "../bot.config";
import {MessageFilter} from "../guards/message.filter";
import {EmbedFactory} from "../utils/embed.factory";
import {Cron} from "@nestjs/schedule";
import {HelperService} from "../utils/helper.service";

@Controller()
export class GlobalController {
	constructor(
		private readonly memberService: MemberService,
		private readonly embedFactory: EmbedFactory,
		private readonly helperService: HelperService
	) {}

	@On({
		event: "voiceStateUpdate",
	})
	async onVoiceStateUpdate(oldState: VoiceState, newState: VoiceState) {
		const member = newState.member;
		if (!member.user.bot) {
			const newChannelID = newState.channelId;
			const oldChannelID = oldState.channelId;
			let online = this.memberService.online.has(member.id);
			let isLeave = true;
			let ignored = true;
			if (newChannelID != oldChannelID) {
				ignored = false;
				if (newChannelID != null) {
					const parentID = newState.channel.parentId;
					const isXiuXianCategory =
						BotConfig.Category.Study == parentID;
					if (isXiuXianCategory) {
						if (!online) {
							await this.memberService.startXiuXian(member.id);
							if (await this.memberService.signIn(member.id)) {
								const channel =
									await this.helperService.getTextChannelById(
										BotConfig.Channel.Daily
									);
								await channel.send(`<@!${member.id}> 签到成功`);
								await channel.send(
									await this.embedFactory.getSignInCard(
										member
									)
								);
							}
							this.memberService.online.set(member.id);
						}
						isLeave = false;
					}
					await member.voice.setMute(
						newChannelID == BotConfig.Channel.Study
					);
				}
			}
			if (!ignored && isLeave && online) {
				await this.memberService.endXiuXian(member.id);
				this.memberService.online.delete(member.id);
			}
		}
	}

	@On({
		// event: 'Message',
		event: "messageCreate",
	})
	@UseGuards(MessageFilter)
	async onMessage(msg: Message) {
		if (msg.content == "鸡汤") {
			const quotation = await this.embedFactory.getQuotationCard();
			await msg.reply(quotation);
		}
	}
	//晚上12点执行
	@Cron("0 0 0 * * *")
	async displayRanking() {
		const rankChannel = await this.helperService.getTextChannelById(
			BotConfig.Channel.Rank
		);
		// const embed = await this.embedFactory.getRankingCard();
		// await rankChannel.send(embed);
	}
}
