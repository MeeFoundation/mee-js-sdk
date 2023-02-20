import bigInt from 'big-integer';
import { JWTPayload, JWK, exportJWK } from 'jose';
import { base58btc } from 'multiformats/bases/base58';

// const DID_KEY_ED25519_PREFIX = [0xed, 0x01];
// const DID_KEY_SECP256K1_PREFIX = [0xe7, 0x01];
// const DID_KEY_BLS12381_G2_PREFIX = [0xeb, 0x01];
const DID_KEY_P256_PREFIX = [0x80, 0x24];
// const DID_KEY_P384_PREFIX = [0x81, 0x24];
// const DID_KEY_RSA_PREFIX = [0x85, 0x24];

// Consts for P256 curve. Adjust accordingly
const two = bigInt(2);
// 115792089210356248762697446949407573530086143415290314195533631308867097853951
const prime = two.pow(256).subtract(two.pow(224)).add(two.pow(192)).add(two.pow(96))
  .subtract(1);
const b = bigInt('41058363725152142129326129780047268409114441015993725554835256314039467401291');
// Pre-computed value, or literal
// 28948022302589062190674361737351893382521535853822578548883407827216774463488
const pIdent = prime.add(1).divide(4);

function padWithZeroes(number: string, length: number): string {
  let retval = `${number}`;
  while (retval.length < length) {
    retval = `0${retval}`;
  }
  return retval;
}

function toHexString(buffer: Uint8Array): string {
  return [...new Uint8Array(buffer)]
    .map((x) => x.toString(16).padStart(2, '0'))
    .join('');
}

const fromHexString = (hexString: string):Uint8Array => {
  const match = hexString.match(/.{1,2}/g)?.map((byte) => parseInt(byte, 16));
  if (typeof match === 'undefined') throw new Error('Hex string invalid');
  const result = Uint8Array.from(match);
  return result;
};

function ECPointDecompress(comp: string) {
  const signY = Number(comp[1]) - 2;
  const x = bigInt(comp.substring(2), 16);
  let y = x.pow(3).subtract(x.multiply(3)).add(b).modPow(pIdent, prime);
  if (y.mod(2).toJSNumber() !== signY) {
    y = prime.subtract(y);
  }
  return `04${padWithZeroes(x.toString(16), 64)}${padWithZeroes(y.toString(16), 64)}`;
}

/** @internal */
export const getKeyFromDidKey = async (jwt: JWTPayload): Promise<JWK | null> => {
  try {
    if (typeof jwt.sub === 'undefined') return null;
    const did = jwt.sub;
    if (!did.startsWith('did:key')) return null;
    const b58EncodedData = did.split(':')[2];
    const data = base58btc.decode(b58EncodedData);

    if (data[0] === DID_KEY_P256_PREFIX[0] && data[1] === DID_KEY_P256_PREFIX[1]) {
      const payload = data.slice(2, data.length);
      if (payload.length === 33 || payload.length === 64 || payload.length === 65) {
        const unwrapped: string = ECPointDecompress(toHexString(payload));
        const k = await crypto.subtle.importKey(
          'raw',
          fromHexString(unwrapped),
          { name: 'ECDSA', namedCurve: 'P-256' },
          true,
          ['verify'],
        );
        const jwk = await exportJWK(k);
        return jwk;
      }
    }
    return null;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
    return null;
  }
};
