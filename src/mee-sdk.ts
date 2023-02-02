/* eslint-disable no-console */
import { jwtDecrypt, importJWK } from 'jose';
import {
  getQueryParameters, goToMee, initButtonInternal, initInternal,
} from './internal';
import {
  MeeConfiguration, MeeConsentDuration, MeeError, MeeErrorTypes, MeeResponse,
} from './types';
import { validateResponse } from './decode';

export const authorize = () => {
  goToMee();
};

export {
  MeeError, MeeErrorTypes, MeeConsentDuration,
};

export type {
  MeeConfiguration, MeeResponse,
};

export const init = (config: MeeConfiguration, callback: (data: MeeResponse) => void) => {
  initInternal(config);
  const token = getQueryParameters('token');
  if (typeof token !== 'undefined') {
    if (token.startsWith('error:')) {
      const errorParts = token.split(',error_description:');
      const errorDescription = errorParts.length === 2 ? errorParts[1].replace(/%20/g, ' ') : '';
      const errorCodePart = errorParts[0].split('error:');
      const errorCode = errorCodePart.length === 2 ? errorCodePart[1] : '';
      const isErrorCodeValid = errorCode in MeeErrorTypes;

      const error = new MeeError(
        errorDescription,
        isErrorCodeValid ? errorCode as MeeErrorTypes : MeeErrorTypes.unknown_error,
      );
      callback({ error, data: undefined });
    } else {
      validateResponse(token).then((data) => callback(data));
    }
  }
};

export const initButton = () => {
  initButtonInternal();
};

const test = async () => {
  init({
    client_metadata: {
      client_name: 'The New York Times',
      logo_uri: 'https://nytimes.com/favicon.ico',
      display_url: 'nytimes.com',
      contacts: [],
    },
    redirect_uri: 'http://localhost:3000',
    container_id: 'mee',
    claims: {
      id_token: {
        last_name: {
          attribute_type: 'https://schema.org/name',
          name: 'Last Name',
          typ: 'string',
          essential: true,
          retention_duration: MeeConsentDuration.whileUsingApp,
          business_purpose: '',
          is_sensitive: true,
        },
        first_name: {
          attribute_type: 'https://schema.org/name',
          name: 'First Name',
          typ: 'string',
          essential: false,
          retention_duration: MeeConsentDuration.ephemeral,
          business_purpose: '',
          is_sensitive: true,
        },
      },
    },
  }, (data) => {
    console.log('data: ', data);
    const resultDiv = document.getElementById('result');
    const resultMark = document.getElementById('resultMark');
    if (resultDiv && resultMark) {
      if (typeof data.error !== 'undefined') {
        resultMark.style.color = 'red';
        resultMark.innerText = 'Error:';
        resultDiv.innerText = `${JSON.stringify(data, null, 2)}`;
      } else {
        resultMark.style.color = 'rgb(78, 133, 142)';
        resultMark.innerText = 'Success:';
        resultDiv.innerText = `${JSON.stringify(data, null, '\t')}`;
      }
    }
  });
  const privateKey = await importJWK({
    kty: 'RSA',
    n: 'zaO35m2Stt-oO4KvngWUPnZeVTap4qoN3ZbDFXqHZtaPKOopXinugWC97BSVXtyqxVLlmi2qcpnYUsL1_yJlWcHhNEtuDANfLD299OTM86lJJb-0NYuRX_KNiGWzZi1DDC7NMkiH4EbFqEDamWK2kH9YVklfNdmvjjGoR262MY1ZXR3qi3_JexISkG2sSjP414HX9NFRjvB2hwpIc2j81LJlYgu9agcAzCB0ImxKLBKosfoTf9G5g7TVY2id-JEqkCropFIJFcK4IHaTTamD1HPO05Lh8RlM5_ExF7TtS8xrzFnWDc9VJ4Jjc4vOTt3LlB1tkOXRZ6IRJwTyv8Yc1Q',
    e: 'AQAB',
    d: 'Q9nZO_a7iguR_tDIEWPV3iZASe2XcGqb2Jl-FQAw3QW-hsl8jM1ZHOdGwzancn1s-16204Bt1RJeBjC96kj3F_6YyCB7Vwtlw7s7iipUVbFtqT7vvxsmBHqLqI2l-_jDPqnSmtzDuIShgzqi5ilkA5mBFDdxattAybIozCkDhKV-9NpweFJEgES4eqCvzLRpmXDlZkXlDBptuDfv9fbsTVcyVC2pD43ndod9Ty0kYqCzZZGB1V7mtgXdhZo5uVL0ubg7sG81roXSnEU_4Pa7FAmhSQCgrOhMYOq7WTEmPNbc6RNG629ECB8KCaNqgo9kql5VhitJyIzleRVTsQBkAQ',
    p: '-iSZKzmurHA28rsE5l0or-nF5TiUdgPjhPII7azpUtoujaorZgwWuzIQtP1oM5HQM-BNdX0dxyqNBNndL1Devr0VrV_Ka6ZTpNCURqdtU0hGEx4vTfBXsoix-S7VcYnev2G4d21QaxaKQD_PoTdzELJ1_RYQVlkCWItm1JcOxPU',
    q: '0nRbxRBvUOnJsF5ANW4VWBuLR_vX89wgz6UJ-JYdhJzOSc2o38geyTIVMcJMsDln_BW2YSAmHjw3BVgb95AnUN8lpZ5f9DdTByoYtVMYuGxM7KRpzyGDpdFJrkAMGTBMpYDih6bEoHv0axQh2Fmw60HX7pRlWFkUzjm_32LqDGE',
    dp: 'TBab3NEj9-H-ZOFMgUIvIStr_eizCB7wszzoSFvDcWdap87uepEMzQ5SlKtMaftdqJn_FdDkIPQphyM6K61exAhCMsWjjhE--jBUGhXNpHqkjiYtX3jPREheUpzTYkD815xC_1jqEFj_3sFKSBDU2GxghYaTm6BhnUtyERKN9I0',
    dq: 'Avk96rTmvb_v55wNUDPz_UC2YRf_3yQ3Gnf8ghSs6hjFGWncfvz24mTgw8k5CCxnebpcz1aC815qcJrkGkVhKNVeVM6-EFdPxwQjQTyhVsnA9H8GN7UDhS5F2j5xbVGvY49EpCIJGTNnKrQoHkR2KXzOrkJOhEcN8jQCsAdXw0E',
    qi: 'ZK2lwoDgZ1Oo9YaSXP7Wj0vYdW7B78toXFma5rAFrTSNFQpJVfHF1e0Nj5uHgw5D4_yTwdlc58fsgPIX45aR5tkGeCX8glQP9f2sbDlJ8llwI8PrKnJ8kl97WtFspL9I9VdCEmkWakzIqq6IFVLqrIC_6FZxqKJn1-O0WtQVhfk',
  }, 'RSA-OAEP');
  console.log('decoding encrypted token');
  const result = await jwtDecrypt(
    'eyJ0eXAiOiJKV1QiLCJlbmMiOiJBMTI4Q0JDLUhTMjU2IiwiYWxnIjoiUlNBLU9BRVAifQ.zDOGX0TYX41sFs-__WyFhL56KEfJu6FsYuCYidw_5VgvAzCStEHNXts_HVfqxXEyHph-zzDGQBDtTTHVmvyag5PLOSoYMPhsJyq-eHrB0k9dT433Z8hcrJfPV6SPbUCl2wIMOJmuAsDR94WyR5gDnN9lgK-GXHYH0riVSMaBlnw7py3GNKFuUFB7QZIS_gnPmJImJQyvjGlMOqLYk3bgQ9m7_SgJ8hoTHOGAZpIua21r1OU_lueIML1QvdlV7tVLVZyw_0S6PcVSzSanjdutIGPe0slhYpD8nchZUOay0Ren9K2_jBJ7mjJzbRPQIKomc37CQaF8Nnf_YKl_grpQcQ.ZXkDk8OXCpVNNHCcHvTkYg.Pe_iicaSVfWqdeZ7E3NGLg.sZ_IkYZBrFwB8P3lrYUw8w',
    privateKey,
  );
  console.log('result: ', result);
};

if (import.meta.env.MODE === 'development') {
  test();
}
