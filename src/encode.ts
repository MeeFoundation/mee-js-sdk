import { JWK, KeyLike, SignJWT } from 'jose';
import { MeeConfigurationInternal } from './internalTypes';
import { MeeError, MeeErrorTypes } from './types';

export async function encodeRequest(
  request: MeeConfigurationInternal,
  meeInitData: MeeConfigurationInternal,
  signPrivateKey: KeyLike,
  signPublicKey: JWK,
): Promise<string> {
  if (meeInitData === null || typeof meeInitData.redirect_uri === 'undefined') {
    throw new MeeError('Please provide valid redirect url', MeeErrorTypes.request_malformed);
  }
  const response = await new SignJWT({ ...request })
    .setProtectedHeader({ alg: 'ES256', jwk: signPublicKey })
    .setIssuedAt()
    .setAudience(meeInitData?.redirect_uri)
    .sign(signPrivateKey);
  return response;
}
