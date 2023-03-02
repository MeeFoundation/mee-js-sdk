import './style.css'
import { setupCounter } from './counter.js'
import { init, MeeConsentDuration } from 'mee-js-sdk'

document.querySelector('#app').innerHTML = `
  <div>
    <h1>Hello Mee!</h1>
    <div id="meeContainer">
    </div>
  </div>
`

init({
  client_metadata: {
    client_name: 'Mee Foundation',
    logo_uri: 'http://mee.foundation/favicon.png',
    display_url: 'mee.foundation',
    contacts: [],
  },
  redirect_uri: 'http://localhost:5173',
  container_id: 'meeContainer',
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
  console.log(data)
});
setupCounter(document.querySelector('#counter'))
