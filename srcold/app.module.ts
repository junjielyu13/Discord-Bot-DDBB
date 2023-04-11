import {Module} from "@nestjs/common";
import {BotModule} from "srcold/bot/bot.module";
import {ConfigModule} from "@nestjs/config";
import {ScheduleModule} from "@nestjs/schedule";

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		ScheduleModule.forRoot(),
		BotModule,
	],
	providers: [],
})
export class AppModule {}
