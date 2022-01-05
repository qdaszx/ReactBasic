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

Reference : [Schemas and Types](https://graphql.org/learn/schema/#object-types-and-fields)

## Arguments

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

Reference : [Schemas and Types](https://graphql.org/learn/schema/#arguments)
