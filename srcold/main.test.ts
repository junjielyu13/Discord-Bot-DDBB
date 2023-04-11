import { NestFactory } from "@nestjs/core";
import { NestApplication } from "@nestjs/core";
import { AppModule } from "srcold/app.module";
import { join } from "path";

async function bootstrap() {
	const app = await NestFactory.create<NestApplication>(AppModule);
	app.useStaticAssets(join(__dirname, "..", "public"));
	app.enableCors();
	await app.listen(3000);
}

bootstrap().then();
