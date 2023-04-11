import {Module} from "@nestjs/common";
import {MongooseModule} from "@nestjs/mongoose";

@Module({
	imports: [
		MongooseModule.forRootAsync({
			useFactory() {
				return {
					uri: process.env.uri,
					useCreateIndex: true,
					useNewUrlParser: true,
					useFindAndModify: false,
				};
			},
		}),
	],
})
export class DbModule {}
