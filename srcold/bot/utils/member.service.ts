import {Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {Member, MemberDocument} from "../../database/schemas/member.schema";
import {Model} from "mongoose";
import {BotConfig} from "../bot.config";
import {HelperService} from "./helper.service";
import {XiuXianService} from "./xiu.xian.service";
import moment from "moment";
import {VoiceChannel} from "discord.js";
import {EmbedFactory} from "./embed.factory";

@Injectable()
export class MemberService {
	online: Map<string, void>;

	constructor(
		@InjectModel(Member.name) private memberModel: Model<MemberDocument>,
		private xiuXianService: XiuXianService,
		private helperService: HelperService
	) {
		this.online = new Map<string, void>();
	}

	async getMember(id: string): Promise<MemberDocument | null> {
		return this.memberModel.findOne({memberID: id});
	}

	async getMemberSafe(id: string): Promise<MemberDocument> {
		let member: MemberDocument = await this.getMember(id);
		if (member == null) {
			member = await this.save(new Member(id));
		}
		return member;
	}

	async save(member: Member): Promise<MemberDocument> {
		let temp = new this.memberModel(member);
		return temp.save();
	}

	async getAll(): Promise<MemberDocument[]> {
		return this.memberModel.find();
	}

	async fix() {
		let members = await this.getAll();
		for (let member of members) {
			let guildMember = await this.helperService.getMemberById(
				member.memberID
			);
			if (guildMember != null) {
				if (guildMember.user.bot) {
					await member.delete();
					continue;
				}
				let online = false;
				if (guildMember.voice.channel != null) {
					let channel =
						(await guildMember.voice.channel.fetch()) as VoiceChannel;
					online = channel.parentId == BotConfig.Category.Study;
				}
				if (online) {
					this.online.set(guildMember.id);
					if (member.previousStartTime == null) {
						await this.xiuXianService.startXiuXian(member);
					}
				} else {
					if (member.previousStartTime != null) {
						await this.xiuXianService.endXiuXian(member);
					}
				}
				if (member.xiuXian) {
					member.xiuXian.expire = null;
				}
			} else {
				member.delete();
			}
		}
		let onlineMembers = await this.helperService.getCategoryOnlineMember(
			BotConfig.Category.Study
		);
		for (let guildMember of onlineMembers) {
			if (!this.online.has(guildMember.id)) {
				let memberDocument = await this.getMemberSafe(guildMember.id);
				await this.xiuXianService.startXiuXian(memberDocument);
			}
		}
	}

	async startXiuXian(id: string) {
		let user = await this.getMemberSafe(id);
		await this.xiuXianService.startXiuXian(user);
	}

	async endXiuXian(id: string) {
		return this.xiuXianService.endXiuXian(await this.getMemberSafe(id));
	}

	async signIn(id: string) {
		let member = await this.getMemberSafe(id);
		let now = moment();
		let yesterday = moment().subtract(1, "days");
		let signed = false;
		let combo = false;
		do {
			if (member.lastSignIn == null) {
				break;
			}
			if ((signed = now.isSame(member.lastSignIn, "date"))) {
				break;
			}
			if ((combo = yesterday.isSame(member.lastSignIn, "date"))) {
				break;
			}
		} while (false);
		if (!signed) {
			member.lastSignIn = now.toISOString();
			member.continueSignIn = combo ? member.continueSignIn + 1 : 1;
			await member.save();
			return true;
		}
		return false;
	}

	async m_signIn(id: string) {
		let member = await this.getMemberSafe(id);
		let now = moment();
		let yesterday = moment().subtract(1, "days");
		let signed = false;
		let combo = false;
		do {
			if (member.m_lastSignIn == null) {
				break;
			}
			if ((signed = now.isSame(member.m_lastSignIn, "date"))) {
				break;
			}
			if ((combo = yesterday.isSame(member.m_lastSignIn, "date"))) {
				break;
			}
		} while (false);
		if (!signed) {
			member.m_lastSignIn = now.toISOString();
			member.m_continueSignIn = combo ? member.m_continueSignIn + 1 : 1;
			await member.save();
			return true;
		}
		return false;
	}

	async endDay() {
		let memberList = await this.getAll();
		const yesterday = moment().subtract(1, "days");
		for (let member of memberList) {
			let isOnline = this.online.has(member.memberID);
			let tmp = await this.endXiuXian(member.memberID);
			if (tmp != null) {
				member = tmp;
			}
			member.yesterdayStudiedTime = member.todayStudiedTime;
			member.totalStudiedTime += member.todayStudiedTime;
			member.todayStudiedTime = 0;
			if (member.todayStudiedSection.length > 0) {
				member.totalStudiedSection.push({
					studiedSection: member.todayStudiedSection,
					totalSecond: member.todayStudiedTime,
					year: yesterday.year(),
					month: yesterday.month() + 1,
					day: yesterday.date(),
				});
				member.todayStudiedSection = [];
			} else {
				member.yesterdayStudiedTime = 0;
			}
			await member.save();
			if (isOnline) {
				await this.startXiuXian(member.memberID);
			}
		}
	}
}
