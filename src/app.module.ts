import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AiAgentController } from '../ai_agent/ai_agent.controller';
import { AiAgentService } from '../ai_agent/ai_agent.service';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AiAgentController],
  providers: [AiAgentService],
})
export class AppModule {}
