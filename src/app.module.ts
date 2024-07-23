import { Module } from '@nestjs/common';
import { InfraModule } from './infra/infra.module';
import { DomainModule } from './domain/domain.module';
import { Profile } from './infra/config/profile';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: Profile.getEnvFilePath(),
    }),
    InfraModule,
    DomainModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
