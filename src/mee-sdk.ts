/* eslint-disable no-console */

import { goToMee, initButtonInternal, initInternal } from './internal';
import {
  MeeConfiguration, MeeConsentDuration, MeeError, MeeErrorTypes, MeeResponse,
} from './types';

export const authorize = () => {
  goToMee();
};

export {
  MeeError, MeeErrorTypes, MeeConsentDuration,
};

export type {
  MeeConfiguration, MeeResponse,
};

export const init = (config: MeeConfiguration, callback: (data: MeeResponse) => void) => {
  initInternal(config, callback);
};

export const initButton = () => {
  initButtonInternal();
};

const test = async () => {
  init({
    client_metadata: {
      client_name: 'The New York Times',
      logo_uri: 'https://nytimes.com/favicon.ico',
      display_url: 'nytimes.com',
      contacts: [],
    },
    redirect_uri: 'http://localhost:3000',
    container_id: 'mee',
    claims: {
      id_token: {
        last_name: {
          attribute_type: 'https://schema.org/name',
          name: 'Last Name',
          typ: 'string',
          essential: true,
          retention_duration: MeeConsentDuration.whileUsingApp,
          business_purpose: '',
          is_sensitive: true,
        },
        first_name: {
          attribute_type: 'https://schema.org/name',
          name: 'First Name',
          typ: 'string',
          essential: false,
          retention_duration: MeeConsentDuration.ephemeral,
          business_purpose: '',
          is_sensitive: true,
        },
      },
    },
  }, (data) => {
    const resultDiv = document.getElementById('result');
    const resultMark = document.getElementById('resultMark');
    if (resultDiv && resultMark) {
      if (typeof data.error !== 'undefined') {
        resultMark.style.color = 'red';
        resultMark.innerText = 'Error:';
        resultDiv.innerText = `${JSON.stringify(data, null, 2)}`;
      } else {
        resultMark.style.color = 'rgb(78, 133, 142)';
        resultMark.innerText = 'Success:';
        resultDiv.innerText = `${JSON.stringify(data, null, '\t')}`;
      }
    }
  });
};

if (import.meta.env.MODE === 'development') {
  test();
}
