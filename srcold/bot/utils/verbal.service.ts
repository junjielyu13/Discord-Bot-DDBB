import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {
	VerbalConfig,
	VerbalConfigDocument,
} from "../../database/schemas/verbal.schema";
import {Injectable} from "@nestjs/common";
import MintFilter from "mint-filter";
import {FilterValue} from "mint-filter/src/index";
import {readFileSync} from "fs";

@Injectable()
export class VerbalService {
	private mintFilter: MintFilter;
	private config: VerbalConfig;
	private keywordMap: Map<string, void> = new Map<string, void>();
	constructor(
		@InjectModel("VerbalConfig")
		private verbalConfigModel: Model<VerbalConfigDocument>
	) {
		this.verbalConfigModel
			.findOne({})
			.then(async (verbalConfig: VerbalConfig) => {
				if (!verbalConfig) {
					verbalConfig = new VerbalConfig();
					verbalConfig.keyword =
						VerbalService.defaultSensitiveKeyword();
					const model = new this.verbalConfigModel(verbalConfig);
					verbalConfig = await model.save();
				}
				this.config = verbalConfig;
				this.mintFilter = new MintFilter(verbalConfig.keyword);
				verbalConfig.keyword.forEach((val) => {
					this.keywordMap.set(val);
				});
			});
	}
	filter(string: string): FilterValue {
		let content = string
			.toLowerCase()
			.replace(/[&|\\*^%$ #@\-]/g, "")
			.replace(/\s+/g, "");
		return this.mintFilter.filterSync(content);
	}
	private async sync() {
		this.config.keyword = Array.from(this.keywordMap.keys());
		const model = new this.verbalConfigModel(this.config);
		await model.save();
		this.mintFilter = new MintFilter(this.config.keyword);
	}
	private static defaultSensitiveKeyword(): string[] {
		let content = readFileSync("src/statics/sensitive.json").toString();
		return JSON.parse(content) as Array<string>;
	}

	async insertSensitive(sensitive: string): Promise<boolean> {
		if (!this.keywordMap.has(sensitive)) {
			this.keywordMap.set(sensitive);
			await this.sync();
			return true;
		}
		return false;
	}

	async removeSensitive(sensitive: string): Promise<boolean> {
		if (this.keywordMap.has(sensitive)) {
			this.keywordMap.delete(sensitive);
			await this.sync();
			return true;
		}
		return false;
	}
}
