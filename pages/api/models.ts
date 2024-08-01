import { OPENAI_API_HOST, OPENAI_API_TYPE, OPENAI_API_VERSION, OPENAI_ORGANIZATION } from '@/utils/app/const';

import { OpenAIModel, OpenAIModelID, OpenAIModels } from '@/types/openai';

import axios from 'axios';

// import https agent for self-signed certificate
import https from 'https';
import { OpenAIError } from '@/utils/server';


export const config = {
  // not edge
  runtime: 'nodejs',
};

const handler = async (req: Request, res:any) => {
  try {
    const { key } = req.body as any as { key: string  };

    let httpagent;
    if (OPENAI_API_HOST.includes("localhost")) {
      
      httpagent = new https.Agent({
        rejectUnauthorized: false,
      });
    }

    let url = `${OPENAI_API_HOST}/v1/models`;
    if (OPENAI_API_TYPE === 'azure') {
      url = `${OPENAI_API_HOST}/openai/deployments?api-version=${OPENAI_API_VERSION}`;
    }

    const response = await axios.request({
      url,
      headers: {
        'Content-Type': 'application/json',
        ...(OPENAI_API_TYPE === 'openai' && {
          Authorization: `Bearer ${key ? key : process.env.OPENAI_API_KEY}`
        }),
        ...(OPENAI_API_TYPE === 'azure' && {
          'api-key': `${key ? key : process.env.OPENAI_API_KEY}`
        }),
        ...((OPENAI_API_TYPE === 'openai' && OPENAI_ORGANIZATION) && {
          'OpenAI-Organization': OPENAI_ORGANIZATION,
        }),
      },
      // ignore self-signed certificate errors
      
      // agent: new (require('https')).Agent({ rejectUnauthorized: false })
      ...(OPENAI_API_HOST.includes("localhost") && { httpsAgent: httpagent })
    } );

    if (response.status === 401) {
      
    } else if (response.status !== 200) {
      console.error(
        `featherless api returned an error ${
          res.status(401).json({ error: 'featherless api returned an error' })
        }: ${JSON.stringify(response.data)}`,
      );
      throw new Error('featherless api returned an error');
    }

    const json = await response.data ;

    console.log(json);

    const models: OpenAIModel[] = json.data
      .map((model: any) => {
        const model_name = (OPENAI_API_TYPE === 'azure') ? model.model : model.id;
        return {
          id: model.id,
          name: model_name,
        };
      })
      .filter(Boolean);
    res.status(200).json( models );
  } catch (error) {
    console.error(error);
    if (error instanceof OpenAIError) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Error' });
    }
  }
};

export default handler;
