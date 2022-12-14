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
  }
};

export type MeeClient = {
  id: string,
  name: string,
  acceptUrl: string,
  rejectUrl: string,
  logoUrl: string,
  displayUrl: string,
};

export type MeeButtonClassnames = { text?: string, logo?: string, button?: string };

export interface MeeConfiguration {
  client_id?: string;
  client?: MeeClient;
  env: MeeEnvType;
  scope: string;
  claim?: MeeClaim;
  container_id?: string
  class_names?: MeeButtonClassnames
}
