import { MeeClient, MeeConfiguration } from './types';

export enum MeeEnvType {
  DEV = 'DEV',
  INT = 'INT',
  PROD = 'PROD',
}

export interface MeeClientInternal extends MeeClient {
  type: 'web' | 'mobile'
}

export interface MeeConfigurationInternal extends Omit<MeeConfiguration, 'container_id'> {
  env: MeeEnvType;
  scope: 'openid';
  response_type: 'id_token' | 'id_token token';
  client_metadata?: MeeClientInternal;
  client_id?: string;
  id_token_hint?: string;
  client_metadata_uri?: string;
  request?: string;
  request_uri?: string;
  id_token_type?: string;
}
