import { getMovies, getById, addMovie, deleteMovie } from "./db"

const resolvers = {
  Query: {
    movies: () => getMovies(),
    movie: (root, { id }, context, info) => getById(id)
  },
  Mutation: {
    addMovie: (root, { name, score }) => addMovie(name, score),
    deleteMovie: (root, { id }) => deleteMovie(id)
  }
}

export default resolvers