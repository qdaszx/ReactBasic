# Basic HTTP networking

## Including credentials in requests

By default, credentials are included only if the server is hosted at the same origin as the application using Apollo Client. You can adjust this behavior by providing a value for the `credentials` parameter to the `ApolloClient` constructor:

```jsx
import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: "https://api.example.com",
  cache: new InMemoryCache(),
  // Enable sending cookies over cross-origin requests
  credentials: "include",
});
```

The following values for `credentials` are supported:

| OPTION      | DESCRIPTON                                                                                                                                            |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| same-origin | Send user credentials (cookies, basic http auth, etc.) if the server’s URL is on the same origin as the requesting client. This is the default value. |
| omit        | Never send or receive credentials                                                                                                                     |
| include     | Always send user credentials (cookies, basic http auth, etc.), even for cross-origin requests.                                                        |

Reference:

[Basic HTTP networking](https://www.apollographql.com/docs/react/networking/basic-http-networking/#including-credentials-in-requests)

## Customizing request headers

You can specify the names and values of custom headers to include in every HTTP request to a GraphQL server. To do so, provide the `headers` parameter to the `ApolloClient` constructor, like so:

```jsx
import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: "https://api.example.com",
  cache: new InMemoryCache(),
  headers: {
    authorization: localStorage.getItem("token"),
    "client-name": "WidgetX Ecom [web]",
    "client-version": "1.0.0",
  },
});
```

Reference:

[Basic HTTP networking](https://www.apollographql.com/docs/react/networking/basic-http-networking/#customizing-request-headers)
