import { createButton, goToMee } from './internal';
import { MeeAuthorizeConfiguration, MeeInitConfiguration } from './types';

export const authorize = (config: MeeAuthorizeConfiguration) => {
  goToMee(config);
};

export const init = (config: MeeInitConfiguration) => {
  createButton(config);
};

export const check = (token: string): boolean => token.length > 0;
