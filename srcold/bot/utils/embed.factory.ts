import {Injectable} from "@nestjs/common";
import {XiuXianService} from "./xiu.xian.service";
import {GuildMember, MessageEmbed} from "discord.js";
import {MemberService} from "./member.service";
import moment from "moment";
import {HelperService} from "./helper.service";
import {QuotationDocument} from "../../database/schemas/quotation.schema";
import {MemberDocument} from "../../database/schemas/member.schema";

const TIME_FORMAT = "HH:mm:ss";

type Predicate = (a: MemberDocument, b: MemberDocument) => number;

function getSayHello(hour: number) {
	if (hour < 3) {
		return "深夜好! ";
	} else if (hour < 6) {
		return "凌晨好！";
	} else if (hour < 9) {
		return "早上好！";
	} else if (hour < 12) {
		return "上午好！";
	} else if (hour < 14) {
		return "中午好！";
	} else if (hour < 17) {
		return "下午好！";
	} else if (hour < 19) {
		return "傍晚好！";
	} else if (hour < 22) {
		return "晚上好！";
	} else {
		return "夜深好！";
	}
}

function getKeyword(hour: number) {
	if (hour < 3) {
		return "Night";
	} else if (hour < 6) {
		return "Morning";
	} else if (hour < 9) {
		return "Morning";
	} else if (hour < 12) {
		return "Morning";
	} else if (hour < 14) {
		return "Midday";
	} else if (hour < 17) {
		return "Afternoon";
	} else if (hour < 19) {
		return "Evening";
	} else if (hour < 22) {
		return "Night";
	} else {
		return "Night";
	}
}

@Injectable()
export class EmbedFactory {
	constructor(
		private xiuXianService: XiuXianService,
		private memberService: MemberService,
		private helperService: HelperService
	) {}

	// async getXiuXianCard(member: GuildMember) {

	//   let memberDoc = await this.memberService.getMemberSafe(member.id);
	//   const xx = await this.xiuXianService.updateXiuXianData(memberDoc);
	//   memberDoc.xiuXian = xx;
	//   const nowExperience = this.xiuXianService.getNowExperience(memberDoc);
	//   const todayExperience = memberDoc.todayStudiedTime + nowExperience;
	//   const totalExperience = memberDoc.totalStudiedTime + todayExperience;

	//   const embed = new MessageEmbed();

	//   const isOnline = this.memberService.online.has(member.id);
	//   let nowStudiedTimeText = '';

	//   embed.setAuthor(member.displayName, member.user.avatarURL());
	//   if (totalExperience >= 0 && xx != null) {
	//     const currentLevelText = xx.isMaxLevel ? ('祖神') :
	//       (`${xx.currentMajorLevelText}-${xx.currentMinorLevelText}`);
	//     const nextLevelText = xx.isNextMaxLevel ? ('祖神') :
	//       (`${xx.nextMajorLevelText}-${xx.nextMinorLevelText}`);
	//     const nextTimeLeftText =
	//       `${EmbedFactory.padZero(xx.leftHour)}小时` +
	//       `${EmbedFactory.padZero(xx.leftMinute)}分钟` +
	//       `${EmbedFactory.padZero(xx.leftSecond)}秒`;

	//     embed.setTitle(`您现在是 \`${currentLevelText}\` 的修士`);
	//     embed.setDescription(
	//       '> 您的下一阶段:\n' +
	//       `> \`${nextLevelText}\`\n` +
	//       '> 您还需要修行:\n' +
	//       `> \`${nextTimeLeftText}\``,
	//     );
	//     if (isOnline) {
	//       let prevStartTimeText =
	//         moment(memberDoc.previousStartTime).format(TIME_FORMAT);
	//       let nowStudiedTime = this.xiuXianService.getLeftTime(nowExperience);
	//       nowStudiedTimeText =
	//         `${EmbedFactory.padZero(nowStudiedTime.hour)}小时` +
	//         `${EmbedFactory.padZero(nowStudiedTime.minute)}分钟` +
	//         `${EmbedFactory.padZero(nowStudiedTime.second)}秒`;
	//       let fieldText =
	//         `> 您从\`${prevStartTimeText}\`开始修行\n` +
	//         `> 现在已经修行了\`${nowStudiedTimeText}\``;
	//       embed.addField('**目前修行:**', fieldText);
	//     }
	//     if (todayExperience > 0) {
	//       let todayStudiedTime = this.xiuXianService.getLeftTime(todayExperience);
	//       let todayStudiedTimeText =
	//         `${EmbedFactory.padZero(todayStudiedTime.hour)}小时` +
	//         `${EmbedFactory.padZero(todayStudiedTime.minute)}分钟` +
	//         `${EmbedFactory.padZero(todayStudiedTime.second)}秒`;
	//       const fieldTitle = `**今日修行:** \`${todayStudiedTimeText}\``;
	//       let fieldText =
	//         '> \n' +
	//         '> **历史记录:**\n' +
	//         '> ▾\n';
	//       for (let period of memberDoc.todayStudiedSection) {
	//         const startText = moment(period.start).format(TIME_FORMAT);
	//         const endText = moment(period.end).format(TIME_FORMAT);
	//         const studiedTime = this.xiuXianService.getLeftTime(period.totalSecond);
	//         const studiedTimeText =
	//           `${EmbedFactory.padZero(studiedTime.hour)}小时` +
	//           `${EmbedFactory.padZero(studiedTime.minute)}分钟` +
	//           `${EmbedFactory.padZero(studiedTime.second)}秒`;
	//         fieldText += `> ✓ \`${startText}\` 至 \`${endText}\` 共 \`${studiedTimeText}\`\n`;
	//       }
	//       if (isOnline) {
	//         const startText = moment(memberDoc.previousStartTime).format(TIME_FORMAT);
	//         const endText = moment().format(TIME_FORMAT);
	//         fieldText += `> ☐ \`${startText}\` 至 \`${endText}\` 共 \`${nowStudiedTimeText}\`\n`;
	//       }
	//       fieldText += '> ▴';
	//       embed.addField(fieldTitle, fieldText);
	//     } else {
	//       embed.addField('**今日修行:**', '> 您今日还没有开始修行!');
	//     }
	//     const totalStudiedTime = this.xiuXianService.getLeftTime(totalExperience);
	//     const totalStudiedTimeText =
	//       `${EmbedFactory.padZero(totalStudiedTime.hour)}小时` +
	//       `${EmbedFactory.padZero(totalStudiedTime.minute)}分钟` +
	//       `${EmbedFactory.padZero(totalStudiedTime.second)}秒`;
	//     embed.addField('总共修行:', `\`\`\`js\n${totalStudiedTimeText}\n\`\`\``);
	//     embed.setColor(xx.levelColor);
	//   } else {
	//     embed.setTitle('您只是一介凡人');
	//     embed.setDescription('加入学习区频道开始你的修仙之旅吧!!');
	//   }
	//   return embed;

	// }

	async getSignInCard(guildMember: GuildMember) {
		const memberDoc = await this.memberService.getMemberSafe(
			guildMember.id
		);
		const now = moment();
		const imageUrl = "https://source.unsplash.com/1300x900?";

		let embed = new MessageEmbed();
		embed.setAuthor(
			guildMember.displayName + ", " + getSayHello(now.hour()),
			guildMember.user.avatarURL()
		);
		embed.setThumbnail("https://i.loli.net/2020/11/18/5KVIMCvO7isRZHU.png");
		embed.setTitle("您已经连续签到了" + memberDoc.continueSignIn + "天");
		embed.setDescription(
			"```css\n[ " + this.helperService.getQuotation().content + " ]\n```"
		);
		embed.setImage(
			imageUrl + getKeyword(now.hour()) + "/?sig=" + Math.random()
		);
		embed.setColor("#aad29e");
		embed.setFooter(now.locale("zh_CN").format("LLLL"));
		return embed;
	}

	async getMSignInCard(guildMember: GuildMember) {
		const memberDoc = await this.memberService.getMemberSafe(
			guildMember.id
		);
		const now = moment();
		const imageUrl = "https://source.unsplash.com/1300x900?";

		let embed = new MessageEmbed();
		embed.setAuthor(
			guildMember.displayName + ", " + getSayHello(now.hour()),
			guildMember.user.avatarURL()
		);
		embed.setThumbnail("https://i.loli.net/2020/11/18/5KVIMCvO7isRZHU.png");
		embed.setTitle("您已经连续签到了" + memberDoc.m_continueSignIn + "天");
		embed.setDescription(
			"```css\n[ " + this.helperService.getQuotation().content + " ]\n```"
		);
		embed.setImage(
			imageUrl + getKeyword(now.hour()) + "/?sig=" + Math.random()
		);
		embed.setColor("#aad29e");
		embed.setFooter(now.locale("zh_CN").format("LLLL"));
		return embed;
	}

	// 登入
	async getQuotationCard(quotation?: QuotationDocument) {
		if (!quotation) {
			quotation = await this.helperService.getQuotation();
		}

		const embed = new MessageEmbed();
		embed.setAuthor(quotation.content);
		embed.setDescription(
			quotation.author + ` \`${quotation.id.substr(-5)}\``
		);
		embed.setColor("#f6d8e2");
		return embed;
	}

	private static padZero(x: number, count?: number) {
		if (!count) {
			count = 2;
		}
		return String(x).padStart(count, "0");
	}

	// async getRankingCard() {
	//   await this.memberService.endDay();

	//   const embed = new MessageEmbed();
	//   const list = await this.memberService.getAll();
	//   embed.setTitle('仙榜');
	//   embed.setDescription('扬道固我愿，修儒为径是，世间人逍遥，数彼我贤圣');
	//   embed.addField('总榜', await this.getContent(list,
	//     ((a, b) => b.totalStudiedTime - a.totalStudiedTime), 10, 'totalStudiedTime'));
	//   embed.addField('单榜', await this.getContent(list,
	//     ((a, b) => b.yesterdayStudiedTime - a.yesterdayStudiedTime), 15, 'yesterdayStudiedTime'));
	//   embed.setFooter('万世沉浮，兴衰荣辱，千百万年似弹指一瞬间，纵使真正的长生不死又如何？到头来不过是亲眼见证一场神话的兴起与灭亡，徒留下满腹的惘怅与哀伤');
	//   return embed;

	// }

	async getContent(
		list: MemberDocument[],
		s: Predicate,
		count: number,
		key: string
	) {
		list.sort(s);
		let content = "";
		let length = Math.min(list.length, count);
		for (let i = 0; i < length; i++) {
			let memberDoc = list[i];
			const t = this.xiuXianService.getLeftTime(memberDoc[key]);
			let extra = "";
			if (key == "totalStudiedTime") {
				let day = Math.floor(t.hour / 24);
				if (day != 0) {
					extra = `${EmbedFactory.padZero(day)}天`;
					t.hour %= 24;
				}
			}
			const text =
				extra +
				`${EmbedFactory.padZero(t.hour)}小时` +
				`${EmbedFactory.padZero(t.minute)}分钟` +
				`${EmbedFactory.padZero(t.second)}秒`;
			const index = EmbedFactory.padZero(i + 1);
			const xx = await this.xiuXianService.updateXiuXianData(memberDoc);
			content +=
				`> \`${index}.\` \`${xx.currentMajorLevelText}-${xx.currentMinorLevelText}\`` +
				`:\`${text}\` <@!${memberDoc.memberID}> \n`;
		}
		return content;
	}
}
