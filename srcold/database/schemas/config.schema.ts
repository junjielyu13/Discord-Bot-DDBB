import {Schema, SchemaFactory} from "@nestjs/mongoose";
import {Document} from "mongoose";

export type ConfigDocument = Config & Document;

@Schema()
export class Config {
	//点歌黑名单
	MusicBlackList: string[];

	//修仙黑名单
	XiuXianIgnoredList: string[];

	//服务器黑名单
	ServerBlackList: string[];

	//敏感词
	VerbalFilterWhiteList: string[];
}

export const ConfigSchema = SchemaFactory.createForClass(Config);
