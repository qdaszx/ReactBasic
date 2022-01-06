# Queries and Mutations

## Aliases

since the result object fields match the name of the field in the query but don’t include arguments, you can’t directly query for the same field with different arguments.

That’s why you need aliases - they let you rename the result of a field to anything you want.

```graphql
{
  empireHero: hero(episode: EMPIRE) {
    name
  }
  jediHero: hero(episode: JEDI) {
    name
  }
}

---

{
  "data": {
    "empireHero": {
      "name": "Luke Skywalker"
    },
    "jediHero": {
      "name": "R2-D2"
    }
  }
}
```

In the above example, the two `hero` fields would have conflicted, but since we can alias them to different, we can get both results in one request.

Reference :

[Queries and Mutations](https://graphql.org/learn/queries/#aliases)

## Fragments

reusable units called **fragments**. Fragments let you construct sets of fields, and then include them in queries where you need to.

Here’s an example of how you could solve the above situation using fragments:

- ex)

  ```graphql
  {
    leftComparison: hero(episode: EMPIRE) {
      ...comparisonFields
    }
    rightComparison: hero(episode: JEDI) {
      ...comparisonFields
    }
  }

  fragment comparisonFields on Character {
    name
    appearsIn
    friends {
      name
    }
  }

  ---

  {
    "data": {
      "leftComparison": {
        "name": "Luke Skywalker",
        "appearsIn": [
          "NEWHOPE",
          "EMPIRE",
          "JEDI"
        ],
        "friends": [
          {
            "name": "Han Solo"
          },
          {
            "name": "Leia Organa"
          },
          {
            "name": "C-3PO"
          },
          {
            "name": "R2-D2"
          }
        ]
      },
      "rightComparison": {
        "name": "R2-D2",
        "appearsIn": [
          "NEWHOPE",
          "EMPIRE",
          "JEDI"
        ],
        "friends": [
          {
            "name": "Luke Skywalker"
          },
          {
            "name": "Han Solo"
          },
          {
            "name": "Leia Organa"
          }
        ]
      }
    }
  }
  ```

The concept of fragments is frequently used to split complicated application data requirements into smaller chunks, especially when you need to combine lots of UI components with different fragments into one initial data fetch.

### Using variables inside fragments

It is possible for fragments to access variables declared in the query or mutation

```graphql
query HeroComparison($first: Int = 3) {
  leftComparison: hero(episode: EMPIRE) {
    ...comparisonFields
  }
  rightComparison: hero(episode: JEDI) {
    ...comparisonFields
  }
}

fragment comparisonFields on Character {
  name
  friendsConnection(first: $first) {
    totalCount
    edges {
      node {
        name
      }
    }
  }
}

---

{
  "errors": [
    {
      "message": "Buffer is not defined",
      "locations": [
        {
          "line": 12,
          "column": 3
        }
      ],
      "path": [
        "leftComparison",
        "friendsConnection"
      ]
    },
    {
      "message": "Buffer is not defined",
      "locations": [
        {
          "line": 12,
          "column": 3
        }
      ],
      "path": [
        "rightComparison",
        "friendsConnection"
      ]
    }
  ],
  "data": {
    "leftComparison": null,
    "rightComparison": null
  }
}
```

Reference :

[Queries and Mutations](https://graphql.org/learn/queries/#fragments)

## Operation Name

Here’s an example that includes the keyword `query` as operation type and `HeroNameAndFriends` as operation name:

```graphql
query HeroNameAndFriends {
  hero {
    name
    friends {
      name
    }
  }
}

---

{
  "data": {
    "hero": {
      "name": "R2-D2",
      "friends": [
        {
          "name": "Luke Skywalker"
        },
        {
          "name": "Han Solo"
        },
        {
          "name": "Leia Organa"
        }
      ]
    }
  }
}
```

The **operation type** is either query, mutation, or subscription and describes what type of operation you’re intending to do.

The operation type is required unless you’re using the query shorthand syntax, In which case you can’t supply a name or variable definitions for your operation

The operation name is a meaningful and explicit name for your operation. It is only required in multi-operation documents, but its use is encouraged because it is very helpful for debugging and server-side logging.

Think of this just like a function name in your favorite programming language. For example, in JavaScript we can easily work only with anonymous functions, but when we give a function a name, it’s easier to track it down, debug our code, and log when it’s called.

In the same way, GraphQL query and mutation names, along with fragment names, can be a useful debugging tool on the server side to identify different GraphQL requests.

Reference :

[Queries and Mutations](https://graphql.org/learn/queries/#operation-name)

## Variables

When we start working with variables, we need to do three things:

1. Replace the static value in the query with `$variableName`
2. Declare `$variableName` as one of the variables accepted by the query
3. Pass `variableName: value` in the separate, transport-specific (usually JSON) variables

Here’s what it looks like all together:

```graphql
query HeroNameAndFriends($episode: Episode) {
  hero(episode: $episode) {
    name
    friends {
      name
    }
  }
}

# VARIABLES
{
  "episode": "EMPIRE"
}

# Result
{
  "data": {
    "hero": {
      "name": "Luke Skywalker",
      "friends": [
        {
          "name": "Han Solo"
        },
        {
          "name": "Leia Organa"
        },
        {
          "name": "C-3PO"
        },
        {
          "name": "R2-D2"
        }
      ]
    }
  }
}
```

we should never be doing string interpolation to construct queries from user-supplied values.

### Variable definitions

The variable definitions are the part that looks like `($episode: Episode)` in the query above. It lists all of the variables, prefixed by `$`, followed by their type, in this case `Episode`.

All declared variables must be either scalars, enums, or i

### Default variables

Default values can also be assigned to the variables in the query by adding the default value after the type declaration.

```graphql
query HeroNameAndFriends($episode: Episode = JEDI) {
  hero(episode: $episode) {
    name
    friends {
      name
    }
  }
}
```

Reference :

[Queries and Mutations](https://graphql.org/learn/queries/#variables)

## Directives

we might also need a way to dynamically chang the structure and shape of our queries using variables.

For example, we can imagine a UI component that has a summarized and detailed view, where one includes more fields than the other.

Let’s construct a query for such a component:

```graphql
query Hero($episode: Episode, $withFriends: Boolean!) {
  hero(episode: $episode) {
    name
    friends @include(if: $withFriends) {
      name
    }
  }
}

# VARIABLES
{
  "episode": "JEDI",
  "withFriends": true
}

# RESULT (if (withFriends) {...
{
  "data": {
    "hero": {
      "name": "R2-D2",
      "friends": [
        {
          "name": "Luke Skywalker"
        },
        {
          "name": "Han Solo"
        },
        {
          "name": "Leia Organa"
        }
      ]
    }
  }
}
```

A directive can be attached to a field of fragment inclusion, and can affect execution of the query in any way the server desires.

The core GraphQL specification includes exactly two directives, which must be supported by any spec-compliant GraphQL server implementation:

- `@include(if: Boolean)` Only include this field in the result if the argument is `true`.
- `@skip(if: Boolean)` Skip this field if the argument is `true` .

Reference :

[Queries and Mutations](https://graphql.org/learn/queries/#directives)

## Mutations
