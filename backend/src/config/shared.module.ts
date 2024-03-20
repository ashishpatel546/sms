import { Module, Global } from '@nestjs/common';
import { ApiConfigService } from 'src/config/config.service';
import { DbConfig } from 'src/config/dbconfig';
import { JwtConfig } from 'src/config/jwtconfig';

@Global()
@Module({
  providers: [ApiConfigService, DbConfig, JwtConfig],
  exports: [ApiConfigService, DbConfig, JwtConfig],
})
export class SharedModule {}
