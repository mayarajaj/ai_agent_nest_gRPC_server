import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.GRPC,
    options: {
      package: 'aiagent',
      protoPath: 'G:\\NEST_projects\\g-rpc_ai_server\\ai_agent\\ai_agent.proto',
      url: '0.0.0.0:50051',
    },
  });

  await app.listen();
  console.log('gRPC NestJS server is running at 0.0.0.0:50051');
}
bootstrap();
