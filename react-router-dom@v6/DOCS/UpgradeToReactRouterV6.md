# React Router v6

## Upgrade all `<Switch>` elements to `<Routes>`

The main advantages of `Routes` over `Switch` are:

- All `<Route>` s and `<Link>` s inside a `<Routes>` are relative. This leads to leaner and more predictable code in `<Route path>` and `<Link to>`
- Routes are chosen based on the best match instead of being traversed in order. This avoids bugs due to unreachable routes because they were defined later in your `<Switch>`
- Routes may be nested in one place instead of being spread out in different components. In small to medium-sized apps, this lets you easily see all your routes at once. In large apps, you can still nest routes in bundles that you load dynamically via `React.lazy`

  Reference:

  [React Router](https://reactrouter.com/docs/en/v6/upgrading/v5#upgrade-all-switch-elements-to-routes)

## Relative Routes and Links

if you wanted nested routes and links you had to build the `<Route path>` and `<Link to>` props from the parent route’s `match.url` and `match.path` properties. Additionally, if you wanted to nest routes, you had to put them in the child route’s component.

- v5

  ```jsx
  // This is a React Router v5 app
  import {
    BrowserRouter,
    Switch,
    Route,
    Link,
    useRouteMatch,
  } from "react-router-dom";

  function App() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/users">
            <Users />
          </Route>
        </Switch>
      </BrowserRouter>
    );
  }

  function Users() {
    // In v5, nested routes are rendered by the child component, so
    // you have <Switch> elements all over your app for nested UI.
    // You build nested routes and links using match.url and match.path.
    let match = useRouteMatch();

    return (
      <div>
        <nav>
          <Link to={`${match.url}/me`}>My Profile</Link>
        </nav>

        <Switch>
          <Route path={`${match.path}/me`}>
            <OwnUserProfile />
          </Route>
          <Route path={`${match.path}/:id`}>
            <UserProfile />
          </Route>
        </Switch>
      </div>
    );
  }
  ```

- v6

  ```jsx
  // This is a React Router v6 app
  import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

  function App() {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="users/*" element={<Users />} />
        </Routes>
      </BrowserRouter>
    );
  }

  function Users() {
    return (
      <div>
        <nav>
          <Link to="me">My Profile</Link>
        </nav>

        <Routes>
          <Route path=":id" element={<UserProfile />} />
          <Route path="me" element={<OwnUserProfile />} />
        </Routes>
      </div>
    );
  }
  ```

A few important things to notice about v6 in this example:

- `<Route path>` and `<Link to>` are relative. This means that they automatically build on the parent route’s path and URL so you don’t have to manually interpolate `match.url` or `match.path`
- `<Route exact>` is gone. Instead, routes with descendant routes (defined in other components) use a trailing `*` in their path to indicate they match deeply
- You may put your routes in whatever order you wish and the router will automatically detect the best route for the current URL. This prevents bugs due to manually putting routes in the wrong order in a `<Switch>`

You may have also noticed that all `<Route children>` from the v5 app changed to `<Route element>` in v6. Assuming you followed the upgrade steps to v5.1, this should be as simple as moving your route element from the child position to a named `element` prop.

Reference:

[React Router](https://reactrouter.com/docs/en/v6/upgrading/v5#relative-routes-and-links)
