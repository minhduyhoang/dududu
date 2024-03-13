import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { Transport } from "@nestjs/microservices";
import { AppModule } from "./app.module";
import { RedisIoAdapter } from "./utils/adapter/redis.adapter";
import { Logger, LoggerErrorInterceptor } from "nestjs-pino";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { NODE_ENV } from "./utils/constant/constant";
import { NestExpressApplication } from "@nestjs/platform-express";
import { join } from "path";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get("PORT");

  // app.useStaticAssets(join(__dirname, "..", "public"), {
  //   prefix: "/public/",
  // });

  app.enableCors();
  app.useGlobalInterceptors(new LoggerErrorInterceptor());
  app.useLogger(app.get(Logger));

  app.useWebSocketAdapter(new RedisIoAdapter(app));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  app.setGlobalPrefix("api");
  app.setBaseViewsDir(join(__dirname, "views"));
  app.setViewEngine("hbs");

  app.use("/app", async (req, res) => {
    try {
      // res.redirect(`diggin://app${req.url}`);
      res.render("app", {});
    } catch (err) {
      console.log("err app", err);
    }
  });

  app.use("/policy", async (req, res) => {
    try {
      res.render("policy");
    } catch (err) {
      console.log("err policy", err);
    }
  });

  // if (process.env.NODE_ENV !== NODE_ENV.PRODUCTION) {
  const config = new DocumentBuilder()
    .setTitle("DIGGIN APIs")
    .setDescription("DIGGIN APIs")
    .setVersion("1.0")
    .addBearerAuth(
      {
        description: `Please enter token`,
        name: "Authorization",
        bearerFormat: "Bearer",
        scheme: "Bearer",
        type: "http",
        in: "Header",
      },
      "accessToken",
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/docs", app, document);
  // }

  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [configService.get("RABBIT_HOST")],
      queue: configService.get("RABBIT_QUEUE"),
      noAck: false,
      queueOptions: {
        durable: true,
      },
    },
  });

  await Promise.all([app.startAllMicroservices(), app.listen(port)]);
}
bootstrap();
