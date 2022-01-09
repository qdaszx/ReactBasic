# Authentication

## Cookie

if your app is browser based and you are using cookies for login and session management with a backend, tell your network interface to send the cookie along with every request. Pass the credentials option e.g.

`credentials: ‘same-origin’` if your backend server is the same domain, as shown below, or else `credentials: ‘include’` if your backend is a different domain.

```jsx
const link = createHttpLink({
  uri: "/graphql",
  credentials: "same-origin",
});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link,
});
```

Reference:

[Authentication](https://www.apollographql.com/docs/react/networking/authentication/#cookie)

## Header

Another common way to identify yourself when using HTTP is to send along an authorization header. Add an `authorization` header to every HTTP request by chaining together Apollo Links.

In this example, we’ll pull the login token from `localStorage` every time a request is sent:

```jsx
import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

const httpLink = createHttpLink({
  uri: "/graphql",
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem("token");
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});
```

Reference:

[Authentication](https://www.apollographql.com/docs/react/networking/authentication/#header)
