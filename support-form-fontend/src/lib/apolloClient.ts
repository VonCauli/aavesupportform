import { ApolloClient, InMemoryCache } from '@apollo/client';
import { createUploadLink } from 'apollo-upload-client';

// Create an upload link using apollo-upload-client
const uploadLink = createUploadLink({
  uri: 'https://api.plain.com/graphql', // Replace with actual GraphQL endpoint
  headers: {
    // Example: Authorization header
    // Authorization: `Bearer ${yourAuthToken}`,
  },
});

// Initialize Apollo Client with the upload link
const client = new ApolloClient({
  link: uploadLink,
  cache: new InMemoryCache(),
});

export default client;
