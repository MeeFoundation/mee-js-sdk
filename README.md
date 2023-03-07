# Mee JS SDK

## What is Mee Identity Agent

The Mee Identity Agent is an app that offers privacy and convenience by giving the user more control over their own personal information as they interact with websites, mobile apps, and other user's agents.

The Mee Identity Agent runs on the user's edge devices (a mobile phone, laptop, etc.) where it holds, entirely under the user's control, a local, private database where the user's personal information is stored. When an app/site wants to know something about the user, the agent shares as much or as little as the user prefers.

You can find more at our [Docs](https://docs-dev.mee.foundation/Identity_agent.html)

## What is Mee JS SDK

Mee JS SDK provides all the needed interfaces and methods to easily add the "Connect with Mee" button to your web app and get data back from the Mee Identity Agent.

## How does it work

Mee is using [OIDC SIOP](https://openid.net/specs/openid-connect-self-issued-v2-1_0.html) to get identity information about the user.

Mee JS SDK helps you to add the "Connect with Mee" button to your web app easily.

Mee JS SDK generates an [OIDC Request](https://openid.net/specs/openid-connect-core-1_0.html#SelfIssuedRequest), based on the data you provided to the Mee JS SDK init function.

When the user clicks "Connect with Mee", OIDC Request data is passed to the Mee Identity Agent and a user interface is generated, requesting the data claims you asked for.

When the user approves the requested data to be shared, the Mee Identity Agent generates an [OIDC Response](https://openid.net/specs/openid-connect-core-1_0.html#SelfIssuedResponse), encoding and signing the data, and passes it back to your web app.

After that, the Mee JS SDK will decode the data for you, validate it and pass it to a callback function you provided.

![Diagram](https://docs-dev.mee.foundation/images/mee-siop-same-device-flow.svg)

Please see the [Docs](https://docs-dev.mee.foundation/Connect_with_Mee.html) for more information.

## How to add Mee JS SDK to your project

If you are using npm:
```
npm install mee-js-sdk
```
If you are using yarn:
```
yarn add mee-js-sdk
```
Import: 
```
import { init } from 'mee-js-sdk';
```
or
```
import Mee from 'mee-js-sdk';
```

# How to use Mee JS SDK

## 1. "Connect with Mee" Button is created automatically by Mee JS SDK and the callback handler is located on the same page as the "Connect with Mee" button


1.1 You need to create an html block container and assign an id to it.
```
<div id="mee_button_container"></div>
```

1.2 Add the id to a container_id property inside configuration.
```
{
    ...
    container_id: 'mee_button_container',
    ...
}
```

1.3 Call the init method and provide a configuration and callback to it.
```
import { init } from 'mee-js-sdk';
...
init(configuration, callback)
```
<details>
  <summary>
    Example
  </summary>

```
    init({
    client_metadata: {
      client_name: 'Mee Foundation',
      logo_uri: 'https://mee.foundation/favicon.png',
      display_url: 'mee.foundation',
      contacts: [],
    },
    redirect_uri: 'https://mee.foundation',
    container_id: 'mee_button_container',
    claims: {
      id_token: {
        last_name: {
          attribute_type: 'https://schema.org/name',
          name: 'Last Name',
          typ: 'string',
          essential: true,
          retention_duration: "",
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
      console.log(data);
    }
  });
```
</details>

## 2. "Connect with Mee" Button is created automatically by Mee JS SDK but the callback handler is on the different page.

2.1 You need to create an html block container and assign an id to it.
```
<div id="mee_button_container"></div>
```

2.2 Add the id to a container_id property inside configuration.
```
{
    ...
    container_id: 'mee_button_container',
    ...
}
```

2.3 Call the init method and provide a configuration and callback to it.
```
import { init } from 'mee-js-sdk';

...

init(configuration, callback)
```

2.4 Call initButton() method from the page with a button container.
```
import { initButton } from 'mee-js-sdk';

...

initButton()
```

## 3. "Connect with Mee" Button is created manually by you (for example you want to customize it)

1.3 Call the init method and provide a configuration and callback to it.
```
import { init } from 'mee-js-sdk';
...
init(configuration, callback)
```

3.2 Make your own button
```
<button onclick="clickHandler()">Connect</button>
```

3.3 Add authorize() method to onClick event of the button.

```
import { authorize } from 'mee-js-sdk';

...

function clickHandler() {
	authorize();
}

```

### Configuration: 
<details>
  <summary>
    Typescript
  </summary>
  
```
  interface MeeConfiguration {
      claims?: {
        id_token?: {
          [name: string]: {
              attribute_type: string;
              name: string;
              typ: 'string' | 'date' | 'email' | 'address';
              essential: boolean;
              retention_duration: "ephemeral" | "while_using_app" | "until_connection_deletion"
              business_purpose: string;
              is_sensitive: boolean;
          }
        }
      };
      client_metadata: {
          client_name: string;
          logo_uri: string;
          display_url: string;
          contacts: string[];
      }
      container_id?: string; 
      redirect_uri: string;
  }
```
</details>

<details>
  <summary>
    JSON Schema
  </summary>
  
```
 {
  "$schema": "http://json-schema.org/draft-04/schema#",
  "type": "object",
  "properties": {
    "client_metadata": {
      "type": "object",
      "properties": {
        "client_name": {
          "type": "string"
        },
        "logo_uri": {
          "type": "string",
          "format": "uri"
        },
        "display_url": {
          "type": "string",
          "format": "uri"
        },
        "contacts": {
          "type": "array",
          "items": [
            {
              "type": "string"
            }
          ]
        }
      },
      "required": [
        "client_name",
        "logo_uri",
        "display_url",
        "contacts"
      ]
    },
    "redirect_uri": {
      "type": "string"
    },
    "container_id": {
      "type": "string"
    },
    "claims": {
      "type": "object",
      "properties": {
        "id_token": {
          "type": "object",
          "patternProperties": {
            "^.*$": {
              "type": "object",
              "properties": {
                "attribute_type": {
                  "type": "string",
                  "format": "uri"
                },
                "name": {
                  "type": "string"
                },
                "typ": {
                  "type": "string",
                  "enum": ["string", "date", "email"]
                },
                "essential": {
                  "type": "boolean"
                },
                "retention_duration": {
                  "type": "string",
                  "enum": ["ephemeral", "while_using_app", "until_connection_deletion"]
                },
                "business_purpose": {
                  "type": "string"
                },
                "is_sensitive": {
                  "type": "boolean"
                }
              },
              "required": [
                "attribute_type",
                "name",
                "typ",
                "essential",
                "retention_duration",
                "business_purpose",
                "is_sensitive"
              ]
            }
          }
        }
      },
      "required": [
        "id_token"
      ]
    }
  },
  "required": [
    "client_metadata",
    "redirect_uri",
    "claims"
  ]
}
```
</details>

-**redirect_uri**: what uri will be responsible for getting the response from the Mee identity agent.
In most cases it will be the same page, where you are calling the init method.
-**container_id**: if you want init method to automatically create "Connect with Mee" button, please add block element to your web app, give it some id, and provide this id here.
- **client_metadata**: some data about your web app.
You must provide:
  - **client_name**: name of your web app i.e. "Mee Foundation"
  - **logo_uri**: url to your logo i.e. "https://mee.foundation/favicon.png"
  - **display_url**: short url of your app i.e. "mee.foundation"
  - **contacts**: your contacts i.e. ["contact@mee.foundation"]

- **claims**: what data do you wang to get from the Mee identity agent.
Each entry must contain:
  - **attribute_type**: url to a data schema i.e. "https://schema.org/name"
  - **name**: attribute name i.e. "First Name"
  - **typ**: claim type. Can be 'string' or 'date' or 'email' or 'address'
  - **essential**: is this claim required?
  - **retention_duration**: how long would you like this data to be stored. Can be 'ephemeral' or 'while_using_app' or 'until_connection_deletion'
  - **business_purpose**: why do you need this data?
  - **is_sensitive**: is this data sensitive?;

## Callback 
  To receive the data from the Mee Identity Agent response: when the Mee JS SDK receives the response, the callback you provided will be called. The callback argument will contain an object with either data or an error.
<details>
  <summary>
    Typescript
  </summary>

```
  {
    data?: {
      [name: string]: string
    };
    error?: {
      error: string;
      error_description: string;
    }
  }
```
Data will contain claims you required and "did" claim - unique user identifier. 
</details>
  
<details>
  <summary>
    JSON Schema
  </summary>

response can contain either data
```
{
  "$schema": "http://json-schema.org/draft-04/schema#",
  "type": "object",
  "properties": {
    "data": {
      "type": "object",
      "patternProperties": {
        "^.*$": {
          "type": "string"
        }
      },
      "required": ["did"]
    },
    "error": {
      "type": "object",
      "properties": {
        "error": {
          "type": "string",
          "enum": [
            "invalid_scope", 
            "unauthorized_client", 
            "access_denied", 
            "unsupported_response_type", 
            "server_error",
            "temporarily_unavailable",
            "interaction_required",
            "login_required",
            "account_selection_required",
            "consent_required",
            "invalid_request_uri",
            "invalid_request_object",
            "request_not_supported",
            "request_uri_not_supported",
            "registration_not_supported",
            "user_cancelled",
            "registration_value_not_supported",
            "subject_syntax_types_not_supported",
            "invalid_registration_uri",
            "invalid_registration_object",
            "validation_failed",
            "request_malformed",
            "unknown_error"
          ]
        },
        "error_description": {
          "type": "string"
        }
      },
      "required": [
        "error",
        "error_description"
      ]
    }
  }
}
```

</details>

## Additional info
This sdk has typescrypt types included.

This sdk is using external dependencies: 'big-integer', 'jose' and 'multiformats' libraries.

