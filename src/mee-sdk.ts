/* eslint-disable no-console */
import {
  getQueryParameters, goToMee, initButtonInternal, initInternal,
} from './internal';
import {
  MeeConfiguration, MeeConsentDuration, MeeError, MeeErrorTypes, MeeResponse,
} from './types';
import { validateResponse } from './decode';

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
  initInternal(config);
  const token = getQueryParameters('token');
  if (typeof token !== 'undefined') {
    if (token.startsWith('error:')) {
      const errorParts = token.split(',error_description:');
      const errorDescription = errorParts.length === 2 ? errorParts[1].replace(/%20/g, ' ') : '';
      const errorCodePart = errorParts[0].split('error:');
      const errorCode = errorCodePart.length === 2 ? errorCodePart[1] : '';
      const isErrorCodeValid = errorCode in MeeErrorTypes;

      const error = new MeeError(
        errorDescription,
        isErrorCodeValid ? errorCode as MeeErrorTypes : MeeErrorTypes.unknown_error,
      );
      callback({ error, data: undefined });
    } else {
      validateResponse(token).then((data) => callback(data));
    }
  }
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
