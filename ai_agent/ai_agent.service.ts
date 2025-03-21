import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

@Injectable()
export class AiAgentService {

  private chatModel;
  private readonly logger = new Logger(AiAgentService.name);

  constructor(private configService: ConfigService) {
    this.chatModel = new ChatOpenAI({
      modelName: "gpt-4o",
      temperature: 0,
      maxTokens: 4096,
      openAIApiKey: this.configService.get<string>('OPENAI_API_KEY'),
    });
  }

  async getCompletionFromMessages(messages: any[]): Promise<string> {
    try {
      console.log('🟢 Sending messages to OpenAI:', JSON.stringify(messages, null, 2));
      const langchainMessages = messages.map(msg => {
        if (msg.role === 'system') {
          return new SystemMessage(msg.content);
        } else {
          return new HumanMessage(msg.content);
        }
      });
  
      const response = await this.chatModel.call(langchainMessages);
      //console.log('🟢 Received response from OpenAI:', response);
  
      return response.content;
    } catch (err) {
      console.error('❌ Error calling OpenAI:', err);
      throw new Error('Failed to fetch classification from OpenAI.');
    }
  }
  

  async classifyConversation(conversation: string): Promise<{ resultJson: string }> {
    const delimiter = "&&&&";
    const message = `
you are an Ai agent helping with Multiclassification a conversation .

the classes is: "order", "discover menu", "order status", "complaint".

the conversation is between ${delimiter} characters.

make sure the output will be a JSON format (only) without any more words.

the conversation is between a customer and AI agent customer support.

Process (only) the last message and ignore every messages before, based on it only add the category it belongs to.

Give an analysis of why this category was chosen in the JSON format.
`;

    const messages = [
      { role: 'system', content: message },
      { role: 'user', content: `${delimiter}${conversation}${delimiter}` },
    ];

    const result = await this.getCompletionFromMessages(messages);
    console.log("the result is ..........................")
    console.log(result)
    return { resultJson : `hi${result}` }  ;
  }

  async evolveConversation(conversation: string, json: string): Promise<{ evolutionResult: string }> {
    const delimiter1 = "&&&&";
    const delimiter2 = "###";
    const message = `
You are a model for evaluating the validity of the classification and giving it a rating out of 100 according to its validity and for analysis

the classes is: "order", "discover menu", "order status", "complaint".

The income will be the classified conversation with its classification which will be in JSON format.

the conversation will be between ${delimiter1} characters and JSON format is in ${delimiter2} characters.

Answer these questions with Y for yes and N for no for evaluation.

Start from the first question to the last question in order.

1 . Can a conversation tolerate more than one classification? ( Y or N only )
2 . Could the conversation belong to an unmentioned class? ( Y or N only )
3 . If he belongs to more than one class, is the relative distribution correct for him? ( Y or N only )
4 . Was the last message enough for analysis?  ( Y or N only )
5 . Can we adopt this classification?  ( Y or N only )
6 . Does the classification model need development?  ( Y or N only )

make sure the output in JSON format without any more word .
`;

    const messages = [
      { role: 'system', content: message },
      { role: 'user', content: `${delimiter1}${conversation}${delimiter1}` },
      { role: 'user', content: `${delimiter2} ${json} ${delimiter2}` },
    ];

    const result = await this.getCompletionFromMessages(messages);
    console.log("the result is ..........................")
    console.log(result)
    return { evolutionResult : `hi${result}` };
;
  }
  
}
