/* eslint-disable import/no-mutable-exports */
import {
  exportJWK,
} from 'jose';
import meeLogo from '../assets/meeLogo.svg';
import { validateResponse } from './decode';
import { encodeRequest } from './encode';
import {
  generateKeys, keyToJwk, keyToPem,
} from './generateKeys';
import {
  makeHash, makeRandomString, meeLSDataToString, removeURLParameter,
} from './helpers';
import { MeeConfigurationInternal } from './internalTypes';
import {
  MeeConfiguration, MeeError, MeeErrorTypes, MeeResponse,
} from './types';

const MEE_URL = 'https://auth-dev.mee.foundation/#/';
const CONSENT = 'consent';

let meeInitData: MeeConfigurationInternal | null = null;
let meeEncodedData: string | null = null;
let savedContainerId: string | null = null;
let privateKeys: { encrypt: string, sign: string } | null = null;

export const nonce: string = makeRandomString(50);

export const getQueryParameters = (parameterName: string): string | undefined => {
  const query = window.location.search.substring(1);
  const items = query.split('&');
  const result = items.find((item) => item.split('=')[0] === parameterName);
  return result?.split('=')[1];
};

export const goToMee = () => {
  try {
    if (nonce !== null && privateKeys !== null) {
      const meeLSData = meeLSDataToString({ nonce, ...privateKeys });
      localStorage.setItem('meeData', meeLSData);
    }
  } finally {
    if (meeInitData !== null && meeEncodedData !== null) {
      window.open(meeInitData.client_id
        ? `${MEE_URL}${CONSENT}/${meeEncodedData}`
        : `${MEE_URL}app`, '_blank');
    }
  }
};

const textColor = '#111827';

export const createButton = async (containerId: string) => {
  const container = document.getElementById(containerId);
  const button = document.createElement('button');
  const logo = document.createElement('img');
  logo.src = meeLogo;
  logo.alt = 'Mee';
  logo.style.width = '18px';
  logo.style.height = '18px';
  const text = document.createElement('p');
  logo.className = 'meeLogo';
  text.className = 'meeText';
  button.className = 'meeButton';
  text.innerHTML = 'Connect with Mee';
  text.style.fontWeight = '700';
  text.style.margin = '0px';
  text.style.fontSize = '14px';
  text.style.color = textColor;
  button.style.display = 'flex';
  button.style.flexDirection = 'row';
  button.style.alignItems = 'center';
  button.style.justifyContent = 'center';
  button.style.width = '100%';
  button.style.gap = '8px';
  button.style.paddingLeft = '8px';
  button.style.paddingRight = '16px';
  button.style.borderRadius = '3px';
  button.style.border = '0px solid #808080';
  button.style.backgroundColor = '#FFF';
  button.style.paddingTop = '9px';
  button.style.paddingBottom = '9px';
  button.addEventListener('mouseover', () => {
    button.style.boxShadow = '0px 4px 6px -2px #0000000D, 0px 10px 15px -3px #0000001A';
    return undefined;
  });
  button.addEventListener('mouseleave', () => {
    button.style.boxShadow = '';
    return undefined;
  });

  button.addEventListener('click', () => goToMee());
  button.appendChild(logo);
  button.appendChild(text);
  container?.appendChild(button);
};

export const initButtonInternal = () => {
  if (savedContainerId !== null) createButton(savedContainerId);
};

export const initInternal = async (
  config: MeeConfiguration,
  callback: (data: MeeResponse) => void,
) => {
  if (typeof config.container_id !== 'undefined') {
    createButton(config.container_id);
  }

  const keys = await generateKeys();

  const ePub = await keyToJwk(keys.encrypt.publicKey);
  const { container_id: containerId, ...omitContainerId } = config;
  savedContainerId = containerId ?? null;
  meeInitData = {
    ...omitContainerId,
    client_id: config.client_id || config.redirect_uri,
    client_metadata: typeof config.client_metadata !== 'undefined'
      ? {
        ...config.client_metadata,
        application_type: 'web',
        jwks: [{
          ...ePub,
          alg: 'RSA-OAEP',
          key_ops: [
            'encrypt',
            'wrapKey',
          ],
        }],
      }
      : undefined,
    scope: 'openid',
    response_type: 'id_token',
    nonce: await makeHash(nonce),
  };
  const pJWK = await exportJWK(keys.sign.publicKey);
  meeEncodedData = await encodeRequest(meeInitData, meeInitData, keys.sign.privateKey, pJWK);
  const sPriv = await keyToPem(keys.sign.privateKey);
  const ePriv = await keyToPem(keys.encrypt.privateKey);
  privateKeys = { encrypt: ePriv, sign: sPriv };

  const token = getQueryParameters('meeAuthToken');
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
      validateResponse(token, meeInitData.client_id).then((data) => callback(data));
      window.history.replaceState(
        {},
        document.title,
        removeURLParameter(window.location.href, 'meeAuthToken'),

      );
    }
  }
};
