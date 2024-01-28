import { OPENAI_API_TYPE } from '../utils/app/const';

export interface OpenAIModel {
  id: string;
  name: string;
  maxLength: number; // maximum length of a message
  tokenLimit: number;
}

export enum OpenAIModelID {
"RWKV-7B" = 'RWKV-7B',
  DUMMY = 'Dummy_Model',
}

// in case the `DEFAULT_MODEL` environment variable is not set or set to an unsupported model
export const fallbackModelID = OpenAIModelID["RWKV-7B"];

export const OpenAIModels: Record<OpenAIModelID, OpenAIModel> = {
 

  [OpenAIModelID["RWKV-7B"]]: {
    id: OpenAIModelID["RWKV-7B"],
    name: 'RWKV-7B',
    maxLength: 96000000,
    tokenLimit: 32000000,
  },
  [OpenAIModelID.DUMMY]: {
    id: OpenAIModelID.DUMMY,
    name: 'Dummy',
    maxLength: 1000,
    tokenLimit: 1000,
  },
  
};
