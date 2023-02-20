# Mee JS SDK

### Install local npm registry:
```
docker-compose up -d
npm adduser --registry http://localhost:4873
```

### Install dependencies:
```yarn install```

### Run (development mode):
```yarn dev```

### Add package to local npm registry:
```
npm publish --registry http://localhost:4873
```

### Build (production mode)
```yarn build```


### SDK Description

**init(config, onAuthorize)**

Parameters:

```typescript
init(config: MeeConfiguration, on_authorize: (data: MeeResponse) => void)

MeeConfiguration {
  claims?: MeeClaim;
  client_metadata?: MeeClient;
  container_id?: string;
  redirect_uri: string;
}

MeeClaim {
  id_token?: {
    [name: string]: ClaimData
  }
}

ClaimData = {
  attribute_type: string, // 'https://schema.org/email'
  name: string,
  typ: ClaimType, //'string' | 'date' | 'boolean' | 'email' | 'address' | 'card'
  essential: boolean,
  retention_duration: MeeConsentDuration, // 'ephemeral' | 'while_using_app' | 'until_connection_deletion',
  business_purpose: string,
  is_sensitive: boolean,
}

MeeClient {
  client_name: string,
  logo_uri: string,
  display_url: string,
  contacts: string[]
}

MeeResponse {
  data?: MeeResponsePositive,
  error?: MeeError
}

MeeError {
  error: MeeErrorTypes,
  error_description: string
}

MeeResponsePositive {
  [name: string]: string
}

```

`claims` -  set of user attributes that should be returned. None by default.
Can be `first_name: {
          attribute_type: 'https://schema.org/name',
          name: 'First Name',
          typ: 'string',
          essential: false,
          retention_duration: MeeConsentDuration.ephemeral,
          business_purpose: '',
          is_sensitive: true,
        },` for example.<br>
`client_metadata` - some information about the Relying Party. Can be `{
      client_name: 'Mee Foundation',
      logo_uri: 'http://localhost:3000/favicon.png',
      display_url: 'mee.foundation',
      contacts: [],
    }` for example<br>
`container_id` - optional dom-element identifier, that will be used as container for connect with mee button (empty if you don’t want to show pre-configured connect with mee button).<br>
`on_authorize` - a callback that will be called when authorization is done. It will return either error or data.<br>
 
**authorize()**
Authorization function that can be used in case of custom authorization (without “connect with me” button).

**initButton()**
If the button container is not on the same page as init() call, you can initialize the button by calling this method.