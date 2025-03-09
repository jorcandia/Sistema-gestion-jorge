import * as morgan from "morgan";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "src/app.module";
import { ConfigService } from "@nestjs/config";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(morgan("dev"));
  app.setGlobalPrefix("api");
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transformOptions: { enableImplicitConversion: true },
    })
  );
  const configService = app.get(ConfigService);
  await app.listen(configService.get("PORT"));
}
bootstrap();
