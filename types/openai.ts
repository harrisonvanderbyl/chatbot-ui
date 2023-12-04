import { OPENAI_API_TYPE } from '../utils/app/const';

export interface OpenAIModel {
  id: string;
  name: string;
  maxLength: number; // maximum length of a message
  tokenLimit: number;
}

export enum OpenAIModelID {
  RWKV_3B = 'RWKV_32_2560_32_17_QUInt8-pc-norr-ext.onnx',
  DUMMY = 'Dummy_Model',
}

// in case the `DEFAULT_MODEL` environment variable is not set or set to an unsupported model
export const fallbackModelID = OpenAIModelID.RWKV_3B;

export const OpenAIModels: Record<OpenAIModelID, OpenAIModel> = {
 

  [OpenAIModelID.RWKV_3B]: {
    id: OpenAIModelID.RWKV_3B,
    name: 'RWKV-3B',
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
