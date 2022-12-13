import meeLogo from '../assets/meeLogo.svg';
import { MeeAuthorizeConfiguration, MeeInitConfiguration } from './types';

const MEE_URL = 'https://www-dev.mee.foundation/#/';
const CONSENT = 'consent';

export const goToMee = async (config: MeeAuthorizeConfiguration) => {
  const encodedData = btoa(JSON.stringify(config));
  window.open(config.client_id || config.client?.id ? `${MEE_URL}${CONSENT}/${encodedData}` : `${MEE_URL}app`, '_blank');
};

const textColor = '#111827';

export const createButton = (config: MeeInitConfiguration): string | null => {
  if (typeof config.container_id === 'undefined') return 'please specify container_id';
  const container = document.getElementById(config.container_id);
  const button = document.createElement('button');
  const logo = document.createElement('img');
  logo.src = meeLogo;
  logo.alt = 'Mee';
  logo.style.width = '18px';
  logo.style.height = '18px';
  const text = document.createElement('p');
  logo.className = config.classNames?.logo || 'meeLogo';
  text.className = config.classNames?.text || 'meeText';
  button.className = config.classNames?.button || 'meeButton';
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
  button.addEventListener('click', () => goToMee(config));

  button.appendChild(logo);
  button.appendChild(text);
  container?.appendChild(button);
  return null;
};
