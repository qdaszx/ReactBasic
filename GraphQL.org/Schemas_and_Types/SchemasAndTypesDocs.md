# Schemas and Types

### Object types and fields

```graphql
type Character {
  name: String!
  appearsIn: [Episode!]!
}
```

`Character` is **a GraphQL Object Type**, meaning it’s a type with some fields. Most of the types in your schema will be object types.

`name` and `appearsIn` are fields on the `Character` type. That means that `name` and `appearsIn` are the only fields that can appear in any the only fields that can appear in any part of a GraphQL query that operates on the `Character` type.

`String` is one of the built-in scalar types - these are types that resolve to a single scalar object, and can’t have sub-selections in the query.

`String!` means that the field is non-nullable, meaning that the GraphQL service promises to always give you a value when you query this field. In the type language, we’ll represent those with an exclamation mark.

`[Episode!]!` represents an array of `Episode` objects. Since it is also non-nullable, you can always expect an array (with zero or more items) when you query the `appearsIn` field. And since `Episode!` is also non-nullable, you can always expect every item of the array to be an `Episode` object.

Reference :

[Schemas and Types](https://graphql.org/learn/schema/#object-types-and-fields)

### Arguments

```graphql
type Starship {
  id: ID!
  name: String!
  length(unit: LengthUnit = METER): Float
}
```

all arguments in GraphQL are passed by name specifically.

In this case, the `length` field has one defined argument, `unit`.

Arguments can be either required or optional. When an argument is optional, we can define a default value - if the `unit` argument is not passed, it will be set to `METER` by default.

Reference :

[Schemas and Types](https://graphql.org/learn/schema/#arguments)

### The Query and Mutation types

- schema:

  ```graphql
  schema {
    query: Query
    mutation: Mutation
  }
  ```

Every GraphQL service has a `query` type and may or may not have a `mutation` type.

they define the **entry point** of every GraphQL query. So if you see a query that looks like:

```graphql
query {
  hero {
    name
  }
  droid(id: "2000") {
    name
  }
}

---

{
  "data": {
    "hero": {
      "name": "R2-D2"
    },
    "droid": {
      "name": "C-3PO"
    }
  }
}
```

That means that the GraphQL service needs to have a `Query` type with `hero` and `droid` fields:

```graphql
type Query {
  hero(episode: Episode): Character
  droid(id: ID!): Droid
}
```

Mutations work in a similar way

It’s important to remember that other than the special status of being the **“entry point”** into the schema, the `Query` and `Mutation` types are the same as any other GraphQL object type, and their fields work exactly the same way.

Reference :

[Schemas and Types](https://graphql.org/learn/schema/#the-query-and-mutation-types)

### Scalar types

GraphQL comes with a set of default scalar types out of the box

`Int` : A signed 32-bit integer.

`Float` : A signed double-precision floating-point value.

`String` : A UTF-8 character sequence.

`Boolean` : `true` of `false` .

`ID` : The ID scalar type represents a unique identifier, often used to refetch an object or as the key for a cache. The ID type is serialized in the same way as a String; however, defining it as an `ID` signifies that it is **not** intended to be human-readable.

custom scalar types. For example, we could define a `Date` type:

```graphql
scalar Date
```

Then it’s up to our implementation to define how that type should be serialized, deserialized, and validated.

For example, you could specify that the `Date` type should always be serialized into an integer timestamp, and your client should know to expect that format for any date fields

Reference :

[Schemas and Types](https://graphql.org/learn/schema/#scalar-types)

### Enumeration types

This allows you to:

1. Validate that any arguments of this type are one of the allowed values
2. Communicate through the type system that a field will always be one of a finite set of values

Here’s what an enum definition might look like in the GraphQL schema language:

```graphql
enum Episode {
  NEWHOPE
  EMPIRE
  JEDI
}
```

This means that wherever we use the type `Episode` in our schema, we expect it to be exactly one of `NEWHOPE` , `EMPIRE` , or `JEDI` .

In a language like JavaScript with no enum support, these values might be internally mapped to a set of integers.

However, these details don’t leak out to the client, which can operate entirely in terms of the string names of the enum values.

Reference :

[Schemas and Types](https://graphql.org/learn/schema/#enumeration-types)

### List and Non-null

```graphql
type Character {
  name: String!
  appearsIn: [Episode]!
}
```

a `String` type and marking it as **Non-Null** by adding an exclamation mark, `!` after the type name. This means that our server always expects to return a non-null value for this field, and if it ends up getting a null value that will actually trigger a GraphQL execution error, letting the client know that something has gone wrong.

The Non-Null type modifier can also be used when defining arguments for a field, which will cause the GraphQL server to return a validation error if a null value is passed as that argument, whether in the GraphQL string or in the variables

![스크린샷_2022-01-06_오후_1 19 21](https://user-images.githubusercontent.com/81012135/148393699-b6b91c95-d04e-4ff7-97e5-893dbe9fcedc.png)

The Non-Null and List modifiers can be combined.

For example, you can have a List of Non-Null Strings:

```graphql
myField: [String!]
```

This means that the list itself can be null, but it can’t have any null members.

For example, in JSON:

```json
myField: null // valid
myField: [] // valid
myField: ['a', 'b'] // valid
myField: ['a', null, 'b'] // error
```

Now, let’s say we defined a Non-Null List of Strings:

```graphql
myField: [String]!
```

This means that the list itself cannot be null, but it can contain null values:

```json
myField: null // error
myField: [] // valid
myField: ['a', 'b'] // valid
myField: ['a', null, 'b'] // valid
```

You can arbitrarily nest any number of Non-Null and List modifiers, according to your needs.

Reference :

[Schemas and Types](https://graphql.org/learn/schema/#enumeration-types)

### Interfaces

An **Interface** is an abstract type that includes a certain set of fields that a type must include to implement the interface.

For example, you could have an interface `Character` that represents any character in the Star Wars trilogy:

```graphql
interface Character {
  id: ID!
  name: String!
  friends: [Character]
  appearsIn: [Episode]!
}
```

This means that any type that **implements** `Character` needs to have these exact fields, with these arguments and return types.

For example, here are some types that might implement `Character` :

```graphql
type Human implements Character {
  id: ID!
  name: String!
  friends: [Character]
  appearsIn: [Episode]!
  starships: [Starship]
  totalCredits: Int
}

type Droid implements Character {
  id: ID!
  name: String!
  friends: [Character]
  appearsIn: [Episode]!
  primaryFunction: String
}
```

You can see that both of these types have all of the fields from the `Character` interface, but also bring in extra fields, `totalCredits` , `starships` and `primaryFunction` , that are specific to that particular type of character.

Interfaces are useful when you want to return an object or set of objects, but those might be of several different types.

For example, note that the following query produces an error:

![스크린샷_2022-01-06_오후_2 12 46](https://user-images.githubusercontent.com/81012135/148393710-22fbe33c-f34a-4f5d-9b82-fc6295268835.png)

The `hero` field returns the type `Character` , which means it might be either a `Human` or a `Droid` depending on the `episode` argument. In the query above, you can only ask for fields that exist on the `Character` interface, which doesn’t include `primaryFunction` .

To ask for a field on a specific object type, you need to use an inline fragment:

![스크린샷_2022-01-06_오후_2 17 11](https://user-images.githubusercontent.com/81012135/148393712-f0e3d5b3-d35d-4bf6-bfbd-6aac7e510189.png)

[Schemas and Types](https://graphql.org/learn/schema/#interfaces)

### Union types

Union types are very similar to interfaces, but they don’t get to specify any common fields between the types.

```graphql
union SearchResult = Human | Droid | Starship
```

Note that members of a union type need to be concrete object types; you can’t create a union type out of interfaces or other unions.

In this case, if you query a field that returns the `SearchResult` union type, you need to use an inline fragment to be able to query any fields at all:

```graphql
{
  search(text: "an") {
    __typename
    ... on Human {
      name
      height
    }
    ... on Droid {
      name
      primaryFunction
    }
    ... on Starship {
      name
      length
    }
  }
}

---

{
  "data": {
    "search": [
      {
        "__typename": "Human",
        "name": "Han Solo",
        "height": 1.8
      },
      {
        "__typename": "Human",
        "name": "Leia Organa",
        "height": 1.5
      },
      {
        "__typename": "Starship",
        "name": "TIE Advanced x1",
        "length": 9.2
      }
    ]
  }
}
```

The `__typename` field resolves to a `String` which lets you differentiate different data types from each other on the client.

Also, in this case, since `Human` and `Droid` share a common interface ( `Character` ), you can query their common fields in one place rather than having to repeat the same fields across multiple types:

```graphql
{
  search(text: "an") {
    __typename
    ... on Character {
      name
    }
    ... on Human {
      height
    }
    ... on Droid {
      primaryFunction
    }
    ... on Starship {
      name
      length
    }
  }
}
```

Note that `name` is still specified on `Starship` because otherwise it wouldn’t show up in the results given that `Starship` is not a `Character` !

Reference :

[Schemas and Types](https://graphql.org/learn/schema/#union-types)

### Input types

This is particularly valuable in the case of **mutations**, where you might want to pass in a whole object to be created

In the GraphQL schema language, input types look exactly the same as regular object types, but with the keyword `input` instead of `type` :

```graphql
input ReviewInput {
  stars: Int!
  commentary: String
}
```

Here is how you could use the input object type in a mutation:

![스크린샷_2022-01-06_오후_2 50 46](https://user-images.githubusercontent.com/81012135/148393715-b12d7c10-b54b-4195-a602-6f08d5d7350d.png)

The fields on an input object type can themselves refer to input object types, but you can’t mix input and output types in your schema. Input object types also can’t have arguments on their fields.

Reference :

[Schemas and Types](https://graphql.org/learn/schema/#input-types)
