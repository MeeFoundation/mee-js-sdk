import {
  exportJWK, exportPKCS8, generateKeyPair, GenerateKeyPairResult, JWK, KeyLike,
} from 'jose';

export const generateKeys = async (): Promise<{ sign: GenerateKeyPairResult, encrypt: GenerateKeyPairResult }> => {
  const signKeyPair = await generateKeyPair('ES256', { extractable: true });

  const encryptKeyPair = await generateKeyPair('RSA-OAEP', { extractable: true });
  return { sign: signKeyPair, encrypt: encryptKeyPair };
};

export const keyToJwk = async (key: KeyLike): Promise<JWK> => {
  const jwk = await exportJWK(key);
  return jwk;
};

export const keyToPem = async (key: KeyLike): Promise<string> => {
  const jwk = await exportPKCS8(key);
  return jwk;
};
