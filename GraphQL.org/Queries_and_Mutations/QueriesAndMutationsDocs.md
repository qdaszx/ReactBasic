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

It’s useful to establish a convention that any operations that cause writes should be sent explicitly via a mutation

This can be useful for fetching the new state of an object after an update.

simple example mutation:

```graphql
mutation CreateReviewForEpisode($ep: Episode!, $review: ReviewInput!) {
  createReview(episode: $ep, review: $review) {
    stars
    commentary
  }
}

# VARIABLES
{
  "ep": "JEDI",
  "review": {
    "stars": 5,
    "commentary": "This is a great movie!"
  }
}

# RESULT
{
  "data": {
    "createReview": {
      "stars": 5,
      "commentary": "This is a great movie!"
    }
  }
}
```

Note how `createReview` field returns the `stars` and `commentary` fields of the newly created review. This is especially useful when mutating existing data, for example, when incrementing a field, since we can mutate and query the new value of the field with on request

You might also notice that, in this example, the `review` variable we passed in is not a scalar. it’s an **input object type**, a special kind of object type that can be passed in as an argument.

### Multiple fields in mutations

A mutation can contain multiple fields, just like a query. There’s one important distinction between queries and mutations, other than the name:

**While query fields are executed in parallel, mutation fields run in series, one after the other.**

This means that if we send two `incrementCredits` mutations in one request, the first is guaranteed to finish before the second begins, ensuring that we don’t end up with a race condition with ourselves.

Reference :

[Queries and Mutations](https://graphql.org/learn/queries/#mutations)

## Inline Fragments

if you are querying a field that returns an interface or a union type, you will need to use **inline fragments** to access data on the underlying concrete type.

It’s easiest to see with an example:

```graphql
query HeroForEpisode($ep: Episode!) {
  hero(episode: $ep) {
    name
    ... on Droid {
      primaryFunction
    }
    ... on Human {
      height
    }
  }
}

# VARUABLES
{
  "ep": "JEDI"
}

# RESULT
{
  "data": {
    "hero": {
      "name": "R2-D2",
      "primaryFunction": "Astromech"
    }
  }
}
```

In this query, the `hero` field returns the type `Character` ,which might be either a `Human` or a `Droid` depending on the `episode` argument. In the direct selection, you can only ask for fields that exist on the `Character` interface, such as `name` .

To ask for a field on the concrete type, you need to use an **inline fragment** with a type condition. Because the first fragment is labeled as `... on Droid` , the `primaryFunction` field will only be executed if the `Character` returned from `hero` is of the `Droid` type.

### Meta fields

GraphQL allows you to request `__typename` , a meta field, at any point in a query to get the name of the object type at that point.

```graphql
{
  search(text: "an") {
    __typename
    ... on Human {
      name
    }
    ... on Droid {
      name
    }
    ... on Starship {
      name
    }
  }
}

# Result

{
  "data": {
    "search": [
      {
        "__typename": "Human",
        "name": "Han Solo"
      },
      {
        "__typename": "Human",
        "name": "Leia Organa"
      },
      {
        "__typename": "Starship",
        "name": "TIE Advanced x1"
      }
    ]
  }
}
```

In the above query, `search` returns a union type that can be one of three options.

It would be impossible to tell aprat the different types from the client without the `__typename` field.

Reference :

[Queries and Mutations](https://graphql.org/learn/queries/#inline-fragments)
