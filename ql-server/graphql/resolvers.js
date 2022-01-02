import { getMovies, getMovie, getSuggestions } from "./db";

const resolvers = {
  Query: {
    movies: (root, { rating, limit }) => getMovies(limit, rating),
    movie: (root, { id }) => getMovie(id),
    suggestions: (root, { id }) => getSuggestions(id)
  }
};

export default resolvers;