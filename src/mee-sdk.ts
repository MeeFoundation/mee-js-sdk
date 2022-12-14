import { getQueryParameters, goToMee, initInternal } from './internal';
import { MeeConfiguration, MeeResponse } from './types';

export const authorize = () => {
  goToMee();
};

export const init = (config: MeeConfiguration, callback: (data: MeeResponse) => void) => {
  initInternal(config);
  // FIX ME
  if (typeof getQueryParameters('token') !== 'undefined') callback({} as MeeResponse);
};

export const check = (token: string): boolean => token.length > 0;
