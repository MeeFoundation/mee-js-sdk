/* eslint-disable max-classes-per-file */
export enum MeeConsentDuration {
  ephemeral = 'ephemeral',
  whileUsingApp = 'while_using_app',
  untilConnectionDeletion = 'until_connection_deletion',
}

export type ClaimType = 'string' | 'date' | 'boolean' | 'email' | 'address' | 'card';

export type ClaimData = {
  attribute_type: string, // 'https://schema.org/email'
  name: string,
  typ: ClaimType,
  essential: boolean,
  retention_duration: MeeConsentDuration,
  business_purpose: string,
  is_sensitive: boolean,
};

export type MeeClaim = {
  id_token?: {
    [name: string]: ClaimData
  }
};

type MeeResponseMeta = {
  iss: string
  sub: string
  sub_jwk: string
  aud: string
  exp: string
  iat: string
  nonce: string
  error: undefined
};

export type MeeResponsePositive = {
  [name: string]: ClaimData & { value: string }
} & MeeResponseMeta;

export type MeeResponse = MeeResponsePositive | MeeError;

export type MeeClient = {
  client_name: string,
  logo_uri: string,
  display_url: string,
  contacts: string[]
};

export interface MeeConfiguration {
  client_id?: string;
  claims?: MeeClaim;
  client_metadata?: MeeClient;
  container_id?: string;
  redirect_uri: string;
}

export enum MeeErrorTypes {
  invalid_scope = 'invalid_scope',
  unauthorized_client = 'unauthorized_client',
  access_denied = 'access_denied',
  unsupported_response_type = 'unsupported_response_type',
  server_error = 'server_error',
  temporarily_unavailable = 'temporarily_unavailable',
  interaction_required = 'interaction_required',
  login_required = 'login_required',
  account_selection_required = 'account_selection_required',
  consent_required = 'consent_required',
  invalid_request_uri = 'invalid_request_uri',
  invalid_request_object = 'invalid_request_object',
  request_not_supported = 'request_not_supported',
  request_uri_not_supported = 'request_uri_not_supported',
  registration_not_supported = 'registration_not_supported',
  user_cancelled = 'user_cancelled',
  registration_value_not_supported = 'registration_value_not_supported',
  subject_syntax_types_not_supported = 'subject_syntax_types_not_supported',
  invalid_registration_uri = 'invalid_registration_uri',
  invalid_registration_object = 'invalid_registration_object',
  validation_failed = 'validation_failed', // SIOP 10.3: Other error codes MAY be used.
  request_malformed = 'request_malformed',
}
export class MeeError extends Error {
  error: MeeErrorTypes;

  error_description: string;

  constructor(description: string, type?: MeeErrorTypes) {
    super();
    this.error = type || MeeErrorTypes.validation_failed;
    this.error_description = description;
  }
}
