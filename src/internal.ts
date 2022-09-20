import meeLogo from '../assets/meeLogo.svg';

export const goToMee = async (partnerId?: string) => {
  window.location.href = partnerId ? `https://getmee.org/#/consent/${partnerId}` : 'https://getmee.org/#/app';
};

const textColor = '#111827';

export const createButton = (config: {
  partnerId?: string,
  containerId: string,
  classNames?: { text?: string, logo?: string, button?: string }
}) => {
  const container = document.getElementById(config.containerId);
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
  button.addEventListener('click', () => goToMee(config.partnerId));

  button.appendChild(logo);
  button.appendChild(text);
  container?.appendChild(button);
};
