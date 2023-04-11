import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {Document} from "mongoose";

export type QuotationDocument = Quotation & Document;

@Schema()
export class Quotation {
	//录入者的id
	@Prop()
	author: string;

	//内容
	@Prop()
	content: string;

	// 录入时间
	@Prop()
	date: string;

	@Prop()
	short_id: string;
}

export const QuotationSchema = SchemaFactory.createForClass(Quotation);
