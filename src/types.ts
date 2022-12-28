export enum ErrorType {
  user_cancelled = 'user_cancelled',
  registration_value_not_supported = 'registration_value_not_supported',
  subject_syntax_types_not_supported = 'subject_syntax_types_not_supported',
  invalid_registration_uri = 'invalid_registration_uri',
  invalid_registration_object = 'invalid_registration_object',
}

export enum MeeFieldType {
  NAME = 'name',
  DATE = 'date',
  EMAIL = 'email',
}

export enum MeeConsentDuration {
  TEMPORARY = 'temporary',
  APP_LIFETIME = 'appLifetime',
  MANUAL_REMOVE = 'manualRemove',
}

export type MeeClaim = {
  user_info?: {
    [name: string]: {
      essential: boolean,
      field_type: MeeFieldType,
    }
  }
  id_token?: {
    [name: string]: {
      essential: boolean,
      field_type: MeeFieldType,
    }
  }

};

export type MeeResponse = {
  access_token: string
  token_type: string
  expires_in: string
  id_token: {
    iss: string
    sub: string
    aud: string
    exp: string
    iat: string
    auth_time?: string
    nonce?: string
    acr?: string
    amr?: string
    azp?: string
  }
  user_info: {
    [name: string]: {
      field_type: MeeFieldType,
      value: string
      duration: MeeConsentDuration
    }
  }

};

export type MeeClient = {
  client_id: string,
  name: string,
  logo_url: string,
  display_url: string,
};

export interface MeeConfiguration {
  client_id?: string;
  client_metadata?: MeeClient;
  claims?: MeeClaim;
  container_id?: string;
  redirect_uri: string;
}
