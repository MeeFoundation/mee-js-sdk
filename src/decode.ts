/* eslint-disable no-console */
import {
  decodeJwt, importJWK, JWTPayload, jwtVerify,
} from 'jose';
import { didUriVerification, makeHash } from './helpers';
import { meeInitData } from './internal';
import { DidKey } from './internalTypes';
import {
  MeeError, MeeResponse, MeeResponsePositive,
} from './types';

function removeServiceData(data: JWTPayload): MeeResponsePositive {
  const {
    aud, exp, iat, iss, jti, nbf, sub, nonce, ...rest
  } = data;

  return rest as unknown as MeeResponsePositive;
}

export async function validateResponse(jwt: string):Promise<MeeResponse> {
  try {
    const payloadNotVerified = decodeJwt(jwt);
    if (typeof payloadNotVerified.sub === 'undefined'
    || !didUriVerification.test(payloadNotVerified.sub)) {
      return { error: new MeeError('Did uri invalid') };
    }
    console.log('payload: ', payloadNotVerified);
    const didPath = payloadNotVerified.sub?.split('did:web:');
    if (typeof didPath === 'undefined' || didPath.length !== 2) {
      return { error: new MeeError('Can not parse DID path') };
    }
    const didUrl = `http://${didPath[1].replaceAll(':', '/')}/did.json`;
    console.log('didUrl: ', didUrl);
    const didKey: DidKey = await fetch(didUrl).then((r) => r.json());
    console.log('didKey: ', didKey);
    const es256key = didKey.verificationMethod.find((key) => key.type === 'Ed25519VerificationKey2018');
    if (typeof es256key === 'undefined') return { error: new MeeError('Valid key not found') };
    if (didKey.id !== payloadNotVerified.sub) {
      return { error: new MeeError('DID key id is not equal to sub') };
    }
    console.log('es256key: ', es256key);
    const key = await importJWK(es256key.publicKeyJwk, 'ES256');
    console.log('key: ', key);
    const result = await jwtVerify(jwt, key, {
      audience: meeInitData?.client_id,
    });
    console.log('result: ', result);
    const { payload } = result;
    if (typeof payload.error !== 'undefined') {
      return { error: new MeeError(payload.error as string) };
    }
    if (!(payload.iss === payload.sub)) {
      return { error: new MeeError('iss should be equal to sub') };
    }
    console.log('No errors. Iss and sub verified');
    const savedNonce = localStorage.getItem('meeNonce');
    if (savedNonce === null) return { error: new MeeError('No nonce found') };
    const hashLocalNonce = await makeHash(savedNonce);
    console.log('nonce:', savedNonce, hashLocalNonce, payload.nonce);
    if (hashLocalNonce !== payload.nonce) return { error: new MeeError('Nonce is not valid') };
    return { data: removeServiceData(payload) };
  } catch (e) {
    if (typeof e === 'string') return { error: new MeeError(e) };
    return { error: new MeeError(`unknown error ${e}`) };
  }
}
