/* eslint-disable no-console */
import {
  compactDecrypt,
  decodeJwt,
  importJWK, importPKCS8, JWK, JWTPayload, jwtVerify,
} from 'jose';
import {
  clearSavedData,
  getMeeDataFromLocalStorage, isJson, isMeeError, makeHash,
} from './helpers';
import { MeeResponsePositiveInternal } from './internalTypes';
import { getKeyFromDidKey } from './resolvers/key';
import { getKeyFromDidWeb } from './resolvers/web';
import {
  MeeError, MeeResponse, MeeResponsePositive,
} from './types';

function removeServiceDataAndParse(data: JWTPayload): MeeResponsePositive {
  const {
    aud, exp, iat, jti, nbf, sub, nonce, ...rest
  } = data;
  const claims = rest as unknown as MeeResponsePositiveInternal;
  const claimsParsed: MeeResponsePositive = { ...claims };
  Object.keys(claims).forEach((key) => {
    const value = isJson(claims[key]);
    if (typeof (value) !== 'undefined') {
      claimsParsed[key] = value;
    }
  });
  return claimsParsed;
}

const getKeyFromDid = async (payload: JWTPayload): Promise<JWK | null> => {
  switch (true) {
    case payload.sub?.startsWith('did:web'): return (getKeyFromDidWeb(payload));
    case payload.sub?.startsWith('did:key'): return (getKeyFromDidKey(payload));
    default: return null;
  }
};

/** @internal */
export async function validateResponse(jwtEncrypted: string, clientId?: string):Promise<MeeResponse> {
  try {
    const savedMeeLSDataParsed = getMeeDataFromLocalStorage();
    clearSavedData();
    if (isMeeError(savedMeeLSDataParsed)) return { error: savedMeeLSDataParsed };
    const ePriv = await importPKCS8(savedMeeLSDataParsed.encrypt, 'RSA-OAEP');
    const decrypted = await compactDecrypt(jwtEncrypted, ePriv);
    const jwt = new TextDecoder().decode(decrypted.plaintext);
    const payloadNotVerified = decodeJwt(jwt);
    const jwk = await getKeyFromDid(payloadNotVerified);
    if (jwk === null) return { error: new MeeError('Can not get jwk from payload') };

    const key = await importJWK(jwk, 'ES256');
    const result = await jwtVerify(jwt, key, {
      audience: clientId,
    });
    const { payload } = result;
    if (typeof payload.error !== 'undefined') {
      return { error: new MeeError(payload.error as string) };
    }
    if (!(payload.iss === payload.sub)) {
      return { error: new MeeError('iss should be equal to sub') };
    }

    if (typeof savedMeeLSDataParsed === 'undefined'
     || savedMeeLSDataParsed?.nonce === null) return { error: new MeeError('No nonce found') };
    const hashLocalNonce = await makeHash(savedMeeLSDataParsed.nonce);
    if (hashLocalNonce !== payload.nonce) return { error: new MeeError('Nonce is not valid') };
    return { data: removeServiceDataAndParse(payload) };
  } catch (e) {
    return { error: new MeeError(e as string) };
  }
}
