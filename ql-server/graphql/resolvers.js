const qdaszx = {
  name: "IL-KYO",
  age: 26,
  gender: "male"
}

const resolvers = {
  Query: {
    person: () => qdaszx
  }
}

export default resolvers