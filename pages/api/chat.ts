import { DEFAULT_SYSTEM_PROMPT, DEFAULT_TEMPERATURE } from '@/utils/app/const';
import { OpenAIError, OpenAIStream } from '@/utils/server';

import { ChatBody, Message } from '@/types/chat';


import tiktokenModel from '@dqbd/tiktoken/encoders/cl100k_base.json';
import { Tiktoken, init } from '@dqbd/tiktoken/lite/init';

export const config = {
  runtime: 'nodejs',
};

const handler = async (req: any, res: any) => {
  try {
    const { model, messages, key, prompt, temperature } = req.body

  

    let promptToSend = prompt;
    if (!promptToSend) {
      promptToSend = DEFAULT_SYSTEM_PROMPT;
    }

    let temperatureToUse = temperature;
    if (temperatureToUse == null) {
      temperatureToUse = DEFAULT_TEMPERATURE;
    }

   
    let messagesToSend: Message[] = [];

    for (let i = messages.length - 1; i >= 0; i--) {
      const message = messages[i];
    
      messagesToSend = [message, ...messagesToSend];
    }


    const stream = await OpenAIStream(model, promptToSend, temperatureToUse, key, messagesToSend);

    var bufferHolder: string = '';


    // let res know its a stream
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');


    stream.on('data', (data: Buffer) => {
      bufferHolder = bufferHolder + data.toString('utf-8');

      const text = bufferHolder.slice(0, bufferHolder.lastIndexOf('data: '));

      if (text === '') {
        return;
      }

      bufferHolder = bufferHolder.slice(bufferHolder.lastIndexOf('data: '));
      console.log('text');
      console.log(text);

      const texts = text.split('\n\n');

      for (let i = 0; i < texts.length - 1; i++) {
        const text = texts[i];
        console.log('text');
        console.log(text);
        
      if (!text.includes('data: [DONE]')) {


        const datajson = JSON.parse(text.replace('data: ', ''));

        console.log(datajson);
        
        if (datajson.choices.length === 0) {
          return;
        }

        const choices = datajson.choices;
        const choice = choices[0];

        if (choice.finish_reason === 'length') {
          return;
        }

        if (choice.finish_reason === 'stop') {
          return;
        }

        console.log(choice);
        res.write(choice.delta.content);
      }
    }}
    );

    return new Promise<void>((resolve, reject) => {

    stream.on('error', (error: any) => {
      console.error(error);
      // res.status(500).json({ error: 'Internal Server Error' });
      res.end();
      resolve();
    });

    stream.on('end', () => {
      res.end();
      resolve();
    });
    
  }
  );
    
  } catch (error) {
    console.error(error);
    if (error instanceof OpenAIError) {
      res.status(401).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

};

export default handler;
