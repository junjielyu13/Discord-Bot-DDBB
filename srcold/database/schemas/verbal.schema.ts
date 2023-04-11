import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {Document} from "mongoose";

export type VerbalConfigDocument = VerbalConfig & Document;

@Schema()
export class VerbalConfig {
	@Prop()
	keyword: string[];
}

export const VerbalConfigSchema = SchemaFactory.createForClass(VerbalConfig);
