import { JWTPayload, JWK } from 'jose';
import { didUriVerification } from '../helpers';
import { DidKey } from '../internalTypes';

/** @internal */
export const getKeyFromDidWeb = async (payload: JWTPayload): Promise<JWK | null> => {
  try {
    if (typeof payload.sub === 'undefined'
    || !didUriVerification.test(payload.sub)) {
      return null;
    }
    const didPath = payload.sub?.split('did:web:');
    if (typeof didPath === 'undefined' || didPath.length !== 2) {
      return null;
    }
    const schema = 'https://';
    const didUrl = `${schema}${didPath[1].replaceAll(':', '/')}/did.json`;
    const didKey: DidKey = await fetch(didUrl).then((r) => r.json());
    const es256key = didKey.verificationMethod.find((key) => key.type === 'JsonWebKey2020');
    if (typeof es256key === 'undefined') return null;
    if (didKey.id !== payload.sub) {
      return null;
    }
    return es256key.publicKeyJwk;
  } catch {
    return null;
  }
};
