/* eslint-disable no-console */
import {
  decodeJwt, importJWK, jwtVerify,
} from 'jose';
import { didUriVerification, makeHash } from './helpers';
import { meeInitData } from './internal';
import { DidKey } from './internalTypes';
import {
  MeeError, MeeResponse, MeeResponsePositive,
} from './types';

export async function decodeString(jwt: string):Promise<MeeResponse> {
  try {
    const payloadNotVerified = decodeJwt(jwt);
    if (typeof payloadNotVerified.sub === 'undefined'
    || !didUriVerification.test(payloadNotVerified.sub)) {
      return new MeeError('Did uri invalid');
    }
    console.log('payload: ', payloadNotVerified);
    const didPath = payloadNotVerified.sub?.split('did:web:');
    if (typeof didPath === 'undefined' || didPath.length !== 2) {
      return new MeeError('Can not parse DID path');
    }
    const didUrl = `http://${didPath[1].replaceAll(':', '/')}/did.json`;
    console.log('didUrl: ', didUrl);
    const didKey: DidKey = await fetch(didUrl).then((r) => r.json());
    console.log('didKey: ', didKey);
    const es256key = didKey.verificationMethod.find((key) => key.type === 'Ed25519VerificationKey2018');
    if (typeof es256key === 'undefined') return new MeeError('Valid key not found');
    if (didKey.id !== payloadNotVerified.sub) return new MeeError('DID key id is not equal to sub');
    console.log('es256key: ', es256key);
    const key = await importJWK(es256key.publicKeyJwk, 'ES256');
    console.log('key: ', key);
    const result = await jwtVerify(jwt, key, {
      audience: meeInitData?.client_id,
    });
    console.log('result: ', result);
    const { payload } = result;
    if (typeof payload.error !== 'undefined') return new MeeError(payload.error as string);
    if (!(payload.iss === payload.sub)) {
      return new MeeError('iss should be equal to sub');
    }
    console.log('No errors. Iss and sub verified');
    const savedNonce = localStorage.getItem('meeNonce');
    if (savedNonce === null) return new MeeError('No nonce found');
    const hashLocalNonce = await makeHash(savedNonce);
    console.log('nonce:', savedNonce, hashLocalNonce, payload.nonce);
    if (hashLocalNonce !== payload.nonce) return new MeeError('Nonce is not valid');
    return payload as unknown as MeeResponsePositive;
  } catch (e) {
    if (typeof e === 'string') return new MeeError(e);
    return new MeeError(`unknown error ${e}`);
  }
}
