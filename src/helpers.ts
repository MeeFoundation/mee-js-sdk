import { MeeLSData } from './internalTypes';
import { MeeError } from './types';

/** @internal */
export const makeHash = async (str: string): Promise<string> => {
  const msgUint8 = new TextEncoder().encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
};

/** @internal */
export const didUriVerification = /^did:web:.{1,}:dids:.{1,}/g;

/** @internal */
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

/** @internal */
export const meeLSDataToString = (data: MeeLSData): string => {
  const str = JSON.stringify(data);
  const b64 = window.btoa(str);
  return b64;
};

/** @internal */
export const stringToMeeLSData = (inputString: string | null): MeeLSData | undefined => {
  if (inputString === null) return undefined;
  const str = window.atob(inputString);
  const data = JSON.parse(str);
  return data;
};

/** @internal */
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

/** @internal */
export const clearSavedData = () => {
  localStorage.removeItem('meeData');
};

/** @internal */
export const getMeeDataFromLocalStorage = (): MeeLSData | MeeError => {
  try {
    const savedMeeLSData = localStorage.getItem('meeData');

    const savedMeeLSDataParsed = stringToMeeLSData(savedMeeLSData);
    if (typeof savedMeeLSDataParsed === 'undefined'
      || typeof savedMeeLSDataParsed.encrypt === 'undefined') {
      return new MeeError('Internal error');
    }
    const expDate = new Date(savedMeeLSDataParsed.exp);
    const nowDate = new Date();
    if (expDate < nowDate) {
      return new MeeError('Session expired');
    }
    return savedMeeLSDataParsed;
  } catch {
    return new MeeError('Error getting the Local Storage data');
  }
};

/** @internal */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isMeeError = (data: MeeLSData | MeeError):data is MeeError => typeof (<MeeError>data).error !== 'undefined';

/** @internal */
export const setLocalStorageExpireCheck = () => {
  const interval = import.meta.env.VITE_LOCAL_STORAGE_CHECK_TIMEOUT;
  const checkExpiration = () => {
    const data = getMeeDataFromLocalStorage();
    if (isMeeError(data) && data.error_description === 'Session expired') {
      clearSavedData();
    }
  };
  checkExpiration();
  setInterval(() => {
    checkExpiration();
  }, interval);
};

export const isJson = (str: string): unknown | undefined => {
  try {
    return JSON.parse(str);
  } catch (e) {
    return undefined;
  }
};
