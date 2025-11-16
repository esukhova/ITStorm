import {RequestTypeType} from './requestType.type';

export type RequestType = {
  name: string,
  phone: string,
  type: RequestTypeType,
  service?: string,
}
