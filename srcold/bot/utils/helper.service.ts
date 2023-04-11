import {Injectable} from "@nestjs/common";
import {
	Channel,
	Guild,
	GuildMember,
	Role,
	TextChannel,
	VoiceChannel,
} from "discord.js";
import {Client} from "discord-nestjs-xzyv";
import {InjectModel} from "@nestjs/mongoose";
import {
	Quotation,
	QuotationDocument,
} from "../../database/schemas/quotation.schema";
import {FilterQuery, Model} from "mongoose";
import {forEach, remove, sample} from "lodash";
import moment from "moment";
import {BotClient} from "../../interfaces/bot.client";

@Injectable()
export class HelperService {
	async getGuildById(id: string): Promise<Guild> | null {
		return this.client.guilds.cache.get(id);
	}

	async getChannel(
		predicate: (v: Channel) => boolean
	): Promise<IterableIterator<Channel>> {
		return (await this.client.defaultGuild.fetch()).channels.cache
			.filter(predicate)
			.values();
	}

	async getChannelWithCategoryId(
		id: string
	): Promise<IterableIterator<Channel>> {
		return await this.getChannel((c) => {
			if (c.type == 2) {
				// 2 = GUILD_VOICE: a voice channel
				return (c as VoiceChannel).parentId == id;
			}
			return false;
		});
	}

	async getChannelByName(name: string): Promise<Channel | null> {
		return (await this.client.defaultGuild.fetch()).channels.cache.find(
			(cl) => cl.name == name
		);
	}

	async getChannelById(id: string): Promise<Channel | null> {
		return (await this.client.defaultGuild.fetch()).channels.cache.get(id);
	}

	async getChannelByNameWithType(
		name: string,
		type: string
	): Promise<Channel | null> {
		let channel = await this.getChannelByName(name);
		if (!channel) {
			return null;
		}
		return channel;
	}

	async getChannelByIdWithType(
		id: string,
		type: string
	): Promise<Channel | null> {
		let channel = await this.getChannelById(id);
		if (!channel) {
			return null;
		}
		return channel;
	}

	async getTextChannelByName(name: string): Promise<TextChannel | null> {
		let channel = await this.getChannelByNameWithType(name, "text");
		if (channel == null) {
			return null;
		}
		return channel as TextChannel;
	}

	async getTextChannelById(id: string): Promise<TextChannel | null> {
		let channel = await this.getChannelByIdWithType(id, "text");
		if (channel == null) {
			return null;
		}
		return channel as TextChannel;
	}

	async getVoiceChannelByName(name: string): Promise<VoiceChannel | null> {
		let channel = await this.getChannelByNameWithType(name, "voice");
		if (channel == null) {
			return null;
		}
		return channel as VoiceChannel;
	}

	async getVoiceChannelById(id: string): Promise<VoiceChannel | null> {
		let channel = await this.getChannelByIdWithType(id, "voice");
		if (channel == null) {
			return null;
		}
		return channel as VoiceChannel;
	}

	async getVoiceChannelMembers(
		channel: VoiceChannel
	): Promise<IterableIterator<GuildMember> | null> {
		if (channel == null) {
			return null;
		}
		return ((await channel.fetch()) as VoiceChannel).members.values();
	}

	async getRoleByName(name: string): Promise<Role> {
		return (await this.client.defaultGuild.roles.fetch()).find(
			(r) => r.name == name
		);
	}

	async getRoleById(id: string) {
		return await this.client.defaultGuild.roles.fetch(id);
	}

	async getMemberById(id: string): Promise<GuildMember | null> {
		if (id != null) {
			try {
				return await this.client.defaultGuild.members.fetch(id);
			} catch (ex) {}
		}
		return null;
	}

	async checkMemberHasRole(member: GuildMember, role: Role) {
		if (member == null) {
			return false;
		}
		return member.roles.cache.find((r) => r.id == role.id);
	}

	async checkMemberHasRoleWithId(id: string, role: Role) {
		let user = await this.getMemberById(id);
		return this.checkMemberHasRole(user, role);
	}

	async getChannelOnlineMemberWithId(id: string) {
		let channel = await this.getVoiceChannelById(id);
		return await this.getChannelOnlineMember(channel);
	}

	async getChannelOnlineMember(channel: Channel): Promise<GuildMember[]> {
		if (channel != null && (channel as VoiceChannel).members.size > 0) {
			//return (channel as VoiceChannel).members;
			let GuildMembers = (channel as VoiceChannel).members;

			let GuildMembersArray = new Array<GuildMember>();
			GuildMembers.forEach(function (guild) {
				GuildMembersArray.push(guild);
			});
			return GuildMembersArray;
		}
		return [];
	}

	async getCategoryOnlineMember(id: string): Promise<GuildMember[]> {
		let result: Array<GuildMember> = [];
		let targetsChannels = await this.getChannelWithCategoryId(id);
		for (let channel of targetsChannels) {
			result.push(...(await this.getChannelOnlineMember(channel)));
		}
		return result;
	}

	// async kickAllMemberFromChannel(channel: VoiceChannel) {
	//   if (channel != null && channel.members.size > 0) {
	//     for (let member of channel.members.values()) {
	//       await member.voice.kick();
	//     }
	//   }
	// }

	// async kickAllMemberFromCategoryChannel(category: string) {
	//   let onlineMembers = await this.getCategoryOnlineMember(category);
	//   for (let member of onlineMembers) {
	//     await member.voice.kick();
	//   }
	// }

	@Client() private client: BotClient;
	private quotations: QuotationDocument[];

	constructor(
		@InjectModel(Quotation.name)
		private quotationModel: Model<QuotationDocument>
	) {
		quotationModel.find().then(async (result) => {
			this.quotations = result;
		});
	}

	getQuotation(): QuotationDocument {
		return sample(this.quotations);
	}

	async pickQuotation(conditions: FilterQuery<QuotationDocument>) {
		return this.quotationModel.find(conditions);
	}

	async deleteQuotation(id?: string, quotation?: QuotationDocument) {
		if (quotation) {
			id = quotation.short_id;
		}
		let result = remove(this.quotations, (q) => q.short_id == id);
		if (result != null && quotation == null) {
			result.forEach((r) => {
				r.delete();
			});
			return true;
		}
		return false;
	}

	async newQuotation(
		author: string,
		content: string
	): Promise<QuotationDocument> {
		const quotation = new Quotation();
		quotation.author = author;
		quotation.content = content;
		quotation.date = moment().toISOString();
		const quotationDoc: QuotationDocument = await new this.quotationModel(
			quotation
		).save();
		quotationDoc.short_id = quotationDoc.id.substr(-5);
		await quotationDoc.save();
		this.quotations.push(quotationDoc);
		return quotationDoc;
	}

	async getChannelMessageByID(channelID: string, messageID: string) {
		const channel = this.client.defaultGuild.channels.cache.get(
			channelID
		) as TextChannel;
		return await channel.messages.fetch(messageID);
	}

	getEmoji(name: string) {
		return this.client.defaultGuild.emojis.cache.find(
			(e) => e.name == name
		);
	}
}
