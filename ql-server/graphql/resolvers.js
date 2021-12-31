import { people, getById } from "./db"

const resolvers = {
  Query: {
    people: () => people,
    person: (root, { id }, context, info) => getById(id)
  }
}

export default resolvers