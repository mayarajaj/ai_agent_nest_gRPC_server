import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { AiAgentService } from './ai_agent.service';

@Controller()
export class AiAgentController {
  constructor(private readonly aiAgentService: AiAgentService) {}

  @GrpcMethod('AiAgentService', 'ClassifyConversation')
  async classifyConversation(data: { conversation: string }) {
    return await this.aiAgentService.classifyConversation(data.conversation);
  }

  @GrpcMethod('AiAgentService', 'EvolveConversation')
  async evolveConversation(data: { conversation: string, json: string }) {
    return await this.aiAgentService.evolveConversation(data.conversation, data.json);
  }
}
