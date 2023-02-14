import { MeeLSData } from './internalTypes';

export const makeHash = async (str: string): Promise<string> => {
  const msgUint8 = new TextEncoder().encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
};

export const didUriVerification = /^did:web:.{1,}:dids:.{1,}/g;

export function makeRandomString(length: number): string {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

export const meeLSDataToString = (data: MeeLSData): string => {
  const str = JSON.stringify(data);
  const b64 = window.btoa(str);
  return b64;
};

export const stringToMeeLSData = (inputString: string | null): MeeLSData | undefined => {
  if (inputString === null) return undefined;
  const str = window.atob(inputString);
  const data = JSON.parse(str);
  return data;
};

export const removeURLParameter = (url: string, parameter: string): string => {
  const urlParts = url.split('?');
  if (urlParts.length >= 2) {
    const prefix = `${encodeURIComponent(parameter)}=`;
    const pars = urlParts[1].split(/[&;]/g);

    // eslint-disable-next-line no-plusplus
    for (let i = pars.length; i-- > 0;) {
      if (pars[i].lastIndexOf(prefix, 0) !== -1) {
        pars.splice(i, 1);
      }
    }

    return urlParts[0] + (pars.length > 0 ? `?${pars.join('&')}` : '');
  }
  return url;
};

export const clearSavedData = () => {
  localStorage.removeItem('meeData');
};
