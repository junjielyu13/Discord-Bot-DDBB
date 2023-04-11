import {Client, On} from "discord-nestjs-xzyv";
import {VerbalService} from "./utils/verbal.service";
import {BotClient} from "../interfaces/bot.client";
import {BotConfig} from "./bot.config";
import {MemberService} from "./utils/member.service";
import {Inject} from "@nestjs/common";

export class MainService {
	@Client() private client: BotClient;

	constructor(
		@Inject(VerbalService) private verbalFilter: VerbalService,
		@Inject(MemberService) private memberService: MemberService
	) {}

	@On({
		event: "ready",
	})
	async init() {
		this.client.verbalFilter = this.verbalFilter;
		this.client.defaultGuild = this.client.guilds.cache.get(
			BotConfig.Server
		);
		await this.memberService.fix();
	}
}
