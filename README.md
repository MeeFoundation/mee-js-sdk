# Mee JS SDK

## What is the Mee identity agent

The Mee identity agent is an app that offers privacy and convenience by giving the user more control over their own personal information as they interact with websites, mobile apps, and other user's agents.

The agent runs on the user's edge devices (mobile phone, laptop, etc.) where it holds, entirely under the user's control, a local, private database of the user's personal information. When an app/site wants to know something about the user, the agent shares as much or as little as the user chooses.

You can find more at our [Docs](https://docs.mee.foundation/Identity_agent.html)

## What is Mee JS SDK

Mee JS SDK provides all nessisary interfaces and methods to easily add "Connect with Mee" button to your web app and get the data back from the Mee identity agent.

## How does it work

Mee is using [SIOP](https://openid.net/specs/openid-connect-self-issued-v2-1_0.html) to get identity information about the user.

Mee JS SDK helps you to add "Connect with Mee" button to your web app easily.

Mee JS SDK is generating an [OIDC Request](https://openid.net/specs/openid-connect-core-1_0.html#SelfIssuedRequest), based on the data you provided to Mee JS SDK init function.

When user clicks "Connect with Mee", OIDC Request data is passing to the Mee identity agent and generating a user interface, requesting the data claims you asked for.

When user approves the data, the Mee identity agent is generating an [OIDC Response](https://openid.net/specs/openid-connect-core-1_0.html#SelfIssuedResponse), encoding and signing the data, and pass it back to your web app.

After that Mee JS SDK will decode the data for you, validate it and pass it to a callback function you provided.

![Diagram](https://docs-dev.mee.foundation/images/mee-js-sdk.svg)

Please see to the [Docs](https://docs-dev.mee.foundation/Connect_with_Mee.html) for more information.

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

## 1. If you want Mee JS SDK to automatically create "Connect with Mee" button

1.1 You need to create a html block container and assign an id to it.

1.2 Add that id to a container_id property inside configuration.

1.3 Call the init method and provide a configuration and a callback to it.
```
import { init } from 'mee-js-sdk';

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
    container_id: 'mee',
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

## 2. If you want Mee JS SDK to automatically create "Connect with Mee" button, but the container for the button is on the separate page

2.1 Go over steps 1.1 - 1.3

2.2 Call initButton() method from the page with a button container.
```
import { init, initButton } from 'mee-js-sdk';

init(configuration, callback)
...
initButton()
```

## 3. If you want to make you own custom "Connect with Mee" button

3.1 Go over step 1.3. Don't provide container_id argument to configuration property.

3.2 Make your own button

3.3 Add authorize() method to onClick event of the button.

```
import { init, authorize } from 'mee-js-sdk';

init(configuration, callback)
...
authorize()
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
    JSON
  </summary>
  
```
  {
      "claims": {
        "id_token": {
          "first_name": {
              "attribute_type": "https://schema.org/name",
              "name": "Last Name",
              "typ": "string",
              "essential": true,
              "retention_duration": "while_using_app",
              "business_purpose": "Greet the user using his name",
              "is_sensitive": true,
          },
          "birthdate": {
              "attribute_type": "https://schema.org/birthDate",
              "name": "Date of Birth",
              "typ": "date",
              "essential": true,
              "retention_duration": "ephemeral",
              "business_purpose": "Check if user can use our services",
              "is_sensitive": true,
          },
          "email": {
              "attribute_type": "https://schema.org/email",
              "name": "Email",
              "typ": "email",
              "essential": false,
              "retention_duration": "until_connection_deletion",
              "business_purpose": "Send updates to the user if he wants",
              "is_sensitive": false,
          }
        }
      },
      "client_metadata": {
          "client_name": "Mee Foundation",
          "logo_uri": "https://mee.foundation/favicon.png,
          "display_url": "mee.foundation,
          "contacts": ["contact@mee.foundation"],
      }
      "container_id": "meeButtonContainerId",
      "redirect_uri": "https://mee.foundation/"
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
  How to receive the data from the Mee Identity Agent response
  When Mee JS SDK will receive the response, the callback you provided will be called. The callback argument will contain an object with either data or an error.
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
    JSON
  </summary>

response can contain either data
```
  {
    "data": {
      "did": "did:key:z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doK",
      "first_name": "John",
      "email": "john@gmail.com",
      "birthdate": "01/01/1991"
    },
  }
```
or an error 
```
  {
    "error": {
      error: "user_cancelled"
      error_description: "User cancelled";
    }
  }
```

</details>

## Additional info
This sdk has typescrypt types included.

This sdk is using external dependencies: 'big-integer', 'jose' and 'multiformats' libraries.

