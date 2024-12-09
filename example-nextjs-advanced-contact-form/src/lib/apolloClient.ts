import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: 'https://api.plain.com/graphql', // Replace with your actual endpoint
  cache: new InMemoryCache(),
});

export default client;
