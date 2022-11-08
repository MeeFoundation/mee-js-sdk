# MEE JS SDK

### Install dependencies:
```yarn install```

### Run (development mode):
```yarn dev```

### Build (production mode)
```yarn build```


### SDK Description

**init(config, on_authorize)**

Parameters:

```typescript
interface Configuration {
    client_id: string;
    env: MeeEnvType;
    scope: string;
    claim?: MeeClaim;
    container_id?: string
}
```

`client_id` - id of the client (consumer) of Mee JS SDK.<br>
`env` - the type of environment. It can be DEV, INT, PROD.<br>
`scope` - scope for authorization, “openid” by default.<br>
`claim` -  set of user attributes that should be returned. None by default.
Can be `{“auth_time”: {“essential”: true}}` for example.<br>
`container_id` - optional dom-element identifier, that will be used as container for connect with mee button (empty if you don’t want to show pre-configured connect with mee button).<br>
`on_authorize` - a callback that will be called when authorization is done. It will return the authorization data (id_token, requested claims, etc).<br>
 
**authorize(nonce)**
Authorization function that can be used in case of custom authorization (without “connect with me” button).

**check(idToken)**
Validates the previously issued  ID token and returns claims (sub).
