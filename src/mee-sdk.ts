/* eslint-disable no-console */
import {
  getQueryParameters, goToMee, initInternal,
} from './internal';
import {
  MeeConfiguration, MeeConsentDuration, MeeResponse,
} from './types';
import { decodeString } from './decode';

export const authorize = () => {
  goToMee();
};

export const init = (config: MeeConfiguration, callback: (data: MeeResponse) => void) => {
  initInternal(config);
  const token = getQueryParameters('token');
  if (typeof token !== 'undefined') decodeString(token).then((data) => callback(data));
};

export const check = (token: string): boolean => token.length > 0;

export const test = async () => {
  init({
    client_id: 'did:web:localhost:dids:15619329-53f1-4cf5-ba63-e4505772a175',
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
        name: {
          attribute_type: 'https://schema.org/name',
          name: 'Last Name',
          typ: 'string',
          essential: true,
          retention_duration: MeeConsentDuration.EPHEMERAL,
          business_purpose: '',
          is_sensitive: true,
        },
      },
    },
  }, (data) => {
    console.log('data: ', data);
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
