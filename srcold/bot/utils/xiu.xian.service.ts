import {Injectable} from "@nestjs/common";
import {LeftTime} from "../../interfaces/left.time";
import {
	DailyStudyPeriod,
	Member,
	MemberDocument,
	StudyPeriod,
} from "../../database/schemas/member.schema";
import {XiuXian} from "../../interfaces/xiu.xian";
import moment from "moment";

const MajorLevel = [
	"筑基",
	"开光",
	"融合",
	"心动",
	"灵寂",
	"金丹",
	"元婴",
	"出窍",
	"分神",
	"合体",
	"渡劫",
	"大乘",
	"炼虚",
	"真仙",
	"金仙",
	"天醒",
	"真神",
	"祖仙",
	"返璞归真",
	"超凡入圣",
	"因果不沾",
	"圣人不死",
	"天道不灭",
];
const MinorLevel = ["前期", "中期", "后期"];

const Experiences = [
	0,
	36000 * 2,
	97200 * 2,
	194400 * 2,
	327600 * 2,
	496800 * 2,
	702000 * 2,
	943200 * 2,
	1220400 * 2,
	1533600 * 2,
	1882800 * 2,
	2268000 * 2,
	2689200 * 2,
	3146400 * 2,
	3639600 * 2,
	4168799 * 2,
	4794118 * 2,
	5561176 * 2,
	6506576 * 2,
	7677759 * 2,
	9136533 * 2,
	10963839 * 2,
	13266246 * 2,
	16184820 * 2,
];

const LevelColors = [
	"#caf0f8",
	"#90e0ef",
	"#48bfe3",
	"#efea5a",
	"#f1c453",
	"#f29e4c",
	"#b9e769",
	"#83e377",
	"#16db93",
	"#ffcad4",
	"#ffacc5",
	"#ff5d8f",
	"#a480cf",
	"#9d4edd",
	"#7b2cbf",
	"#f9906f",
	"#f05654",
	"#dc3023",
	"#a1afc9",
	"#ecf7f1",
	"#92b6d0",
	"#f2f9f2",
	"#c3e2e7",
];

@Injectable()
export class XiuXianService {
	constructor() {}

	getLeftTime(second: number): LeftTime {
		let s = second;
		let m = Math.floor(s / 60);
		let h = Math.floor(m / 60);
		m = m % 60;
		s = s % 60;
		return {
			second: s,
			minute: m,
			hour: h,
		};
	}

	async updateXiuXianData(member: MemberDocument): Promise<XiuXian | null> {
		if (member != null) {
			//获取用户全部的经验值
			let exp = this.getTotalExperience(member);
			if (exp > 0) {
				//如果是第一次
				if (member.xiuXian == null) {
					member.xiuXian = this.calculateXiuXianData(exp);
				} else {
					//moment().isAfter(moment(member.xiuXian.expire))
					if (!member.xiuXian.isMaxLevel) {
						member.xiuXian = this.calculateXiuXianData(exp);
					}
				}
				await member.save();
			}
			return member.xiuXian;
		}
		return null;
	}

	getTotalExperience(member: Member): number {
		let totalExperience = 0;
		totalExperience += member.totalStudiedTime;
		totalExperience += member.todayStudiedTime;
		totalExperience += this.getNowExperience(member);
		return totalExperience;
	}

	getNowExperience(member: Member) {
		let nowStudiedTime = 0;
		if (member.previousStartTime != null) {
			nowStudiedTime = moment().diff(member.previousStartTime, "seconds");
		}
		return nowStudiedTime;
	}

	calculateXiuXianData(exp: number): XiuXian {
		let level = -1;
		let result = new XiuXian();
		result.isMaxLevel = false;
		result.isNextMaxLevel = false;
		result.totalExperience = exp;
		Experiences.some((v) => {
			let con = exp < v;
			level += con ? 0 : 1;
			return con;
		});
		//获取距离下一个大等级的经验值
		let majorLevelRequired = Experiences[level + 1] - Experiences[level];
		//获取每一个小等级需要的经验值
		let minorLevelRequired = Math.floor(majorLevelRequired / 3);
		//获取当前等级溢出的经验值
		let actualExperience = exp - Experiences[level];
		//设置当前的大等级
		result.currentMajorLevel = Math.min(level, MajorLevel.length - 1);
		result.isMaxLevel = level == MajorLevel.length;
		//设置当前的小等级
		result.currentMinorLevel = result.isMaxLevel
			? 2
			: Math.floor(Math.abs(actualExperience) / minorLevelRequired) % 3;
		//设置当前等级文本
		result.currentMajorLevelText = MajorLevel[result.currentMajorLevel];
		result.currentMinorLevelText = MinorLevel[result.currentMinorLevel];
		if (!result.isMaxLevel) {
			//设置下一个的大等级
			result.nextMajorLevel = Math.min(
				result.currentMajorLevel +
					(result.currentMinorLevel == 2 ? 1 : 0),
				MajorLevel.length - 1
			);
			//设置下一个的小等级
			result.nextMinorLevel = (result.currentMinorLevel + 1) % 3;
			//判断下一级别是不是满级
			result.isNextMaxLevel =
				result.currentMajorLevel == MajorLevel.length - 1 &&
				result.currentMinorLevel == 2;
			//设置下一个级别的文本
			result.nextMajorLevelText = MajorLevel[result.nextMajorLevel];
			result.nextMinorLevelText = MinorLevel[result.nextMinorLevel];
			if (result.currentMinorLevel == 2) {
				result.totalLeft =
					majorLevelRequired -
					result.currentMinorLevel * minorLevelRequired -
					(actualExperience -
						result.currentMinorLevel * minorLevelRequired);
			} else {
				result.totalLeft =
					minorLevelRequired -
					(actualExperience -
						result.currentMinorLevel * minorLevelRequired);
			}
			//计算时间差
			let left = this.getLeftTime(result.totalLeft);
			result.leftHour = left.hour;
			result.leftMinute = left.minute;
			result.leftSecond = left.second;

			let expireTime = moment();
			expireTime.add(result.leftHour, "hours");
			expireTime.add(result.leftMinute, "minutes");
			expireTime.add(result.leftSecond, "seconds");
			result.expire = expireTime.toISOString();
			result.levelColor = LevelColors[result.currentMajorLevel];
		}
		return result;
	}

	async startXiuXian(member: MemberDocument) {
		if (member != null) {
			member.previousStartTime = moment().toISOString();
			await member.save();
		}
	}

	async endXiuXian(member: MemberDocument): Promise<MemberDocument> {
		if (member != null && member.previousStartTime != null) {
			let now = moment();
			let prev = moment(member.previousStartTime);
			let second = now.diff(prev, "seconds");
			if (second > 600) {
				let period: StudyPeriod = {
					start: prev.toISOString(),
					end: now.toISOString(),
					totalSecond: second,
				};
				member.todayStudiedTime += second;
				member.todayStudiedSection.push(period);
			}
			member.previousStartTime = null;
			return await member.save();
		}
		return null;
	}

	async endDay(member: MemberDocument) {
		if (member != null) {
			let now = moment().subtract(1, "days");
			let studying = member.previousStartTime != null;
			await this.endXiuXian(member);
			member.yesterdayStudiedTime = member.todayStudiedTime;
			member.totalStudiedTime += member.todayStudiedTime;
			let daily: DailyStudyPeriod = {
				day: now.date(),
				month: now.month() + 1,
				year: now.year(),
				studiedSection: member.todayStudiedSection,
				totalSecond: member.todayStudiedTime,
			};
			member.todayStudiedTime = 0;
			member.totalStudiedSection.push(daily);
			if (studying) {
				await this.startXiuXian(member);
			}
			await member.save();
		}
	}
}
