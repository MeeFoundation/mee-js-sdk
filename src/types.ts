export enum MeeEnvType {
  DEV = 'DEV',
  INT = 'INT',
  PROD = 'PROD',
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
  [name: string]: {
    essential: boolean,
    field_type: MeeFieldType,
  }
};

export type MeeResponse = {
  [name: string]: {
    field_type: MeeFieldType,
    value: string
    duration: MeeConsentDuration
  }
};

export type MeeClient = {
  client_id: string,
  name: string,
  acceptUrl: string,
  rejectUrl: string,
  logoUrl: string,
  displayUrl: string,
  type: 'web' | 'mobile'
};

export interface MeeConfiguration {
  client_id?: string;
  client?: MeeClient;
  env: MeeEnvType;
  scope: string;
  claim?: MeeClaim;
  container_id?: string
}
