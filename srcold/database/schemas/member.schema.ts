import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {Document} from "mongoose";
import {XiuXian} from "../../interfaces/xiu.xian";

export type MemberDocument = Member & Document;

export interface DailyStudyPeriod {
	year: number;
	day: number;
	month: number;
	studiedSection: Array<StudyPeriod>;
	totalSecond: number;
}

export interface StudyPeriod {
	start: string;
	end: string;
	totalSecond: number;
}

@Schema()
export class Member {
	constructor(id: string) {
		this.memberID = id;
	}

	//用户ID
	@Prop({
		unique: true,
	})
	memberID: string;

	//上次签到时间
	@Prop()
	lastSignIn: string = null;

	//连续签到次数
	@Prop()
	continueSignIn: number = 0;

	//上次签到时间
	@Prop()
	m_lastSignIn: string = null;

	//连续签到次数
	@Prop()
	m_continueSignIn: number = 0;

	//累积的学习时间
	@Prop()
	totalStudiedTime: number = 0;

	//今日学习的时间
	@Prop()
	todayStudiedTime: number = 0;

	//昨日学习的时间
	@Prop()
	yesterdayStudiedTime: number = 0;

	//上次开始学习的时间
	@Prop()
	previousStartTime: string = null;

	//学习时间段
	@Prop()
	todayStudiedSection: Array<StudyPeriod> = new Array<StudyPeriod>();

	//全部时间段
	@Prop()
	totalStudiedSection: Array<DailyStudyPeriod> = new Array<DailyStudyPeriod>();

	//修行信息
	@Prop()
	xiuXian: XiuXian = null;

	//灵石
	@Prop()
	gem: number;
}

export const MemberSchema = SchemaFactory.createForClass(Member);
