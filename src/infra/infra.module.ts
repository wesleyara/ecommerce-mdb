import { Module } from '@nestjs/common';
import { RabbitmqModule } from './rabbitmq/rabbitmq.module';
import { TokenModule } from './token/token.module';

@Module({
  imports: [RabbitmqModule, TokenModule],
})
export class InfraModule {}
