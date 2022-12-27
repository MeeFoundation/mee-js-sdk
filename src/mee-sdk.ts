import {
  decodeString, getQueryParameters, goToMee, initInternal,
} from './internal';
import { MeeConfiguration, MeeResponse } from './types';

export const authorize = () => {
  goToMee();
};

export const init = (config: MeeConfiguration, callback: (data: MeeResponse) => void) => {
  initInternal(config);
  const token = getQueryParameters('token');
  if (typeof token !== 'undefined') callback(decodeString(token) as MeeResponse);
};

export const check = (token: string): boolean => token.length > 0;
