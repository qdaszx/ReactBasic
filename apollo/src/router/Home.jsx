import { gql, useQuery } from "@apollo/client";

const GET_MOVIES = gql`
  query {
    movies {
      id
      title
      rating
      medium_cover_image
    }
  }
`;

const Home = () => {
  const { loading, error, data } = useQuery(GET_MOVIES);
  console.log(loading, error, data);
  return (
    <>
      {loading ? (
        <h1>loading...</h1>
      ) : data ? (
        data.movies.map((item) => {
          return (
            <>
              <h1>{item.title}</h1>
              <h2>{item.rating}</h2>
            </>
          );
        })
      ) : null}
    </>
  );
};

export default Home;
