import { JWK } from 'jose';
import { MeeClient, MeeConfiguration } from './types';

/** @internal */
export enum MeeEnvType {
  DEV = 'DEV',
  INT = 'INT',
  PROD = 'PROD',
}

/** @internal */
export interface MeeClientInternal extends MeeClient {
  application_type: 'web' | 'mobile',
  jwks: JsonWebKey[],

}
/** @internal */
export interface MeeConfigurationInternal extends Omit<MeeConfiguration, 'container_id'> {
  // env: MeeEnvType;
  scope: 'openid';
  response_type: 'code' | 'id_token' | 'code id_token';
  client_metadata?: MeeClientInternal;
  client_id?: string;
  nonce: string;
}

/** @internal */
export enum InternalErrorType {
  user_cancelled = 'user_cancelled',
  registration_value_not_supported = 'registration_value_not_supported',
  subject_syntax_types_not_supported = 'subject_syntax_types_not_supported',
  invalid_registration_uri = 'invalid_registration_uri',
  invalid_registration_object = 'invalid_registration_object',
}

/** @internal */
export type MeeResponseInternalError = {
  error: InternalErrorType
};

/** @internal */
export interface DidKey {
  '@context': string;
  authentication: string[];
  id: string;
  verificationMethod: {
    controller: string;
    id: string;
    type: string;
    publicKeyJwk: JWK;
  }[]
}

/** @internal */
export interface MeeLSData {
  nonce: string;
  encrypt: string;
  sign: string;
  exp: number
}

/** @internal */
export enum DidType {
  web,
  key,
}
