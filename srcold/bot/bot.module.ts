import {Module} from "@nestjs/common";
import {DiscordModule} from "discord-nestjs-xzyv";
import {MongooseModule} from "@nestjs/mongoose";
import {MainService} from "./main.service";
import {VerbalService} from "./utils/verbal.service";
import {DbModule} from "../database/db.module";
import {VerbalConfigSchema} from "../database/schemas/verbal.schema";
import {XiuXianService} from "./utils/xiu.xian.service";
import {MemberService} from "./utils/member.service";
import {MemberSchema} from "../database/schemas/member.schema";

import {HelperService} from "./utils/helper.service";
import {EmbedFactory} from "./utils/embed.factory";
import {QuotationSchema} from "../database/schemas/quotation.schema";
import {GlobalController} from "./controller/global.controller";
import {DailySignInController} from "./controller/daily.controller";
import {ConfigController} from "./controller/config.controller";
import {InteractiveController} from "./controller/interactive.controller";
import {EulaController} from "./controller/eula.controller";
import {MDailySignInController} from "./controller/m.daily.controller";

@Module({
	imports: [
		DiscordModule.forRootAsync({
			//TODO
			useFactory() {
				return {
					token: process.env.token!,
				};
			},
		}),

		DbModule,
		MongooseModule.forFeature([
			{name: "VerbalConfig", schema: VerbalConfigSchema},
			{name: "Member", schema: MemberSchema},
			{name: "Quotation", schema: QuotationSchema},
		]),
	],

	controllers: [
		EulaController,
		GlobalController,
		DailySignInController,
		InteractiveController,
		ConfigController,
		MDailySignInController,
	],

	providers: [
		MainService,
		HelperService,
		VerbalService,
		MemberService,
		XiuXianService,
		EmbedFactory,
	],
})
export class BotModule {}
