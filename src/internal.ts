import { SignJWT } from 'jose';
import meeLogo from '../assets/meeLogo.svg';
import { makeHash, makeRandomString } from './helpers';
import { MeeConfigurationInternal } from './internalTypes';
import { MeeConfiguration, MeeError, MeeErrorTypes } from './types';

const MEE_URL = 'https://auth-dev.mee.foundation/#/';
const CONSENT = 'consent';

// eslint-disable-next-line import/no-mutable-exports
export let meeInitData: MeeConfigurationInternal | null = null;
// eslint-disable-next-line import/no-mutable-exports
export let meeEncodedData: string | null = null;
// eslint-disable-next-line import/no-mutable-exports
export let savedContainerId: string | null = null;

export const nonce: string = makeRandomString(50);

export async function encodeRequest(request: MeeConfigurationInternal): Promise<string> {
  if (meeInitData === null || typeof meeInitData.redirect_uri === 'undefined') {
    throw new MeeError('Please provide valid redirect url', MeeErrorTypes.request_malformed);
  }
  const secret = new TextEncoder().encode(
    'cc7e0d44fd473002f1c42167459001140ec6389b7353f8088f4d9a95f2f596f2',
  );
  const response = await new SignJWT({ ...request })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setAudience(meeInitData?.redirect_uri)
    .sign(secret);
  return response;
}

export const getQueryParameters = (parameterName: string): string | undefined => {
  const query = window.location.search.substring(1);
  const items = query.split('&');
  const result = items.find((item) => item.split('=')[0] === parameterName);
  return result?.split('=')[1];
};

export const goToMee = () => {
  try {
    localStorage.setItem('meeNonce', nonce);
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

export const initInternal = async (config: MeeConfiguration) => {
  if (typeof config.container_id !== 'undefined') {
    createButton(config.container_id);
  }

  const { container_id: containerId, ...omitContainerId } = config;
  savedContainerId = containerId ?? null;
  meeInitData = {
    ...omitContainerId,
    client_id: config.client_id || config.redirect_uri,
    client_metadata: typeof config.client_metadata !== 'undefined'
      ? { ...config.client_metadata, application_type: 'web' }
      : undefined,
    scope: 'openid',
    response_type: 'id_token',
    nonce: await makeHash(nonce),
  };
  meeEncodedData = await encodeRequest(meeInitData);
};
