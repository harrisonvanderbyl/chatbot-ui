import { OPENAI_API_TYPE } from '../utils/app/const';

export interface OpenAIModel {
  id: string;
  name: string;
  maxLength: number; // maximum length of a message
  tokenLimit: number;
}

export enum OpenAIModelID {
"recursal-aitown-3B" = 'recursal-aitown-3B',
  DUMMY = 'Dummy_Model',
}

// in case the `DEFAULT_MODEL` environment variable is not set or set to an unsupported model
export const fallbackModelID = OpenAIModelID["recursal-aitown-3B"];

export const OpenAIModels: Record<OpenAIModelID, OpenAIModel> = {
 

  [OpenAIModelID["recursal-aitown-3B"]]: {
    id: OpenAIModelID["recursal-aitown-3B"],
    name: 'recursal-aitown-3B',
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
