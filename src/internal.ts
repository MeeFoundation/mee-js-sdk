import meeLogo from '../assets/meeLogo.svg';
import { MeeButtonClassnames, MeeConfiguration } from './types';

const MEE_URL = 'https://auth-dev.mee.foundation/#/';
const CONSENT = 'consent';

// eslint-disable-next-line import/no-mutable-exports
export let meeInitData: MeeConfiguration | null = null;

export const encodeString = (data: unknown): string => btoa(JSON.stringify(data));
export function decodeString<T>(data: string):T {
  return JSON.parse(atob(data));
}

export const getQueryParameters = (parameterName: string): string | undefined => {
  const query = window.location.search.substring(1);
  const items = query.split('&');
  const result = items.find((item) => item.split('=')[0] === parameterName);
  return result?.split('=')[1];
};

export const goToMee = async () => {
  if (meeInitData !== null) {
    const encodedData = encodeString(meeInitData);
    window.open(meeInitData.client_id || meeInitData.client?.id
      ? `${MEE_URL}${CONSENT}/${encodedData}`
      : `${MEE_URL}app`, '_blank');
  }
};

const textColor = '#111827';

export const createButton = (containerId: string, classNames?: MeeButtonClassnames) => {
  const container = document.getElementById(containerId);
  const button = document.createElement('button');
  const logo = document.createElement('img');
  logo.src = meeLogo;
  logo.alt = 'Mee';
  logo.style.width = '18px';
  logo.style.height = '18px';
  const text = document.createElement('p');
  logo.className = classNames?.logo || 'meeLogo';
  text.className = classNames?.text || 'meeText';
  button.className = classNames?.button || 'meeButton';
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

export const initInternal = (config: MeeConfiguration) => {
  if (typeof config.container_id !== 'undefined') {
    createButton(config.container_id, config.class_names);
  }
  meeInitData = config;
};
