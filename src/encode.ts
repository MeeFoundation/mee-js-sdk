export async function encodeRequest(request: MeeConfigurationInternal): Promise<string> {
  if (meeInitData === null || typeof meeInitData.redirect_uri === 'undefined') {
    throw new MeeError('Please provide valid redirect url', MeeErrorTypes.request_malformed);
  }
  const secret = new TextEncoder().encode(
    'cc7e0d44fd473002f1c42167459001140ec6389b7353f8088f4d9a95f2f596f2',
  );
  const response = await new SignJWT({ ...request })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setAudience(meeInitData?.redirect_uri)
    .sign(secret);
  return response;
}
