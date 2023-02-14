/* eslint-disable no-console */
import {
  compactDecrypt,
  decodeJwt,
  importJWK, importPKCS8, JWK, JWTPayload, jwtVerify,
} from 'jose';
import {
  clearSavedData, didUriVerification, makeHash, stringToMeeLSData,
} from './helpers';
import { DidKey } from './internalTypes';
import {
  MeeError, MeeResponse, MeeResponsePositive,
} from './types';

function removeServiceData(data: JWTPayload): MeeResponsePositive {
  const {
    aud, exp, iat, jti, nbf, sub, nonce, ...rest
  } = data;

  return rest as unknown as MeeResponsePositive;
}

const getKeyFromDidWeb = async (payload: JWTPayload): Promise<JWK | null> => {
  try {
    if (typeof payload.sub === 'undefined'
    || !didUriVerification.test(payload.sub)) {
      return null;
    }
    const didPath = payload.sub?.split('did:web:');
    if (typeof didPath === 'undefined' || didPath.length !== 2) {
      return null;
    }
    const schema = 'http://';
    const didUrl = `${schema}${didPath[1].replaceAll(':', '/')}/did.json`;
    const didKey: DidKey = await fetch(didUrl).then((r) => r.json());
    const es256key = didKey.verificationMethod.find((key) => key.type === 'Ed25519VerificationKey2018');
    if (typeof es256key === 'undefined') return null;
    if (didKey.id !== payload.sub) {
      return null;
    }
    return es256key.publicKeyJwk;
  } catch {
    return null;
  }
};

export async function validateResponse(jwtEncrypted: string, clientId?: string):Promise<MeeResponse> {
  try {
    const savedMeeLSData = localStorage.getItem('meeData');
    clearSavedData();
    const savedMeeLSDataParsed = stringToMeeLSData(savedMeeLSData);
    if (typeof savedMeeLSDataParsed === 'undefined'
    || typeof savedMeeLSDataParsed.encrypt === 'undefined') {
      return { error: new MeeError('Internal error') };
    }
    const ePriv = await importPKCS8(savedMeeLSDataParsed.encrypt, 'RSA-OAEP');
    const decrypted = await compactDecrypt(jwtEncrypted, ePriv);
    const jwt = new TextDecoder().decode(decrypted.plaintext);
    const payloadNotVerified = decodeJwt(jwt);

    const jwk = await getKeyFromDidWeb(payloadNotVerified);
    if (jwk === null) return { error: new MeeError('Can not get jwk from payload') };

    const key = await importJWK(jwk, 'ES256');
    console.log('jwt: ', jwt);
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
    return { data: removeServiceData(payload) };
  } catch (e) {
    return { error: new MeeError(e as string) };
  }
}
