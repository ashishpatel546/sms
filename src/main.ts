import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setUpSwagger } from './setUpSwagger';
import { ApiConfigService } from './config/config.service';
import { VersioningType } from '@nestjs/common';
import { SharedModule } from './config/shared.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.select(SharedModule).get(ApiConfigService);
  app.enableVersioning({
    type: VersioningType.URI,
    //defaultVersion: apiVersion,
  });
  setUpSwagger(app);
  const port = configService.appConfig.port;
  await app.listen(port);
}
bootstrap();
