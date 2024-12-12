const { ApolloServer } = require('apollo-server-express');
const express = require('express');
const { graphqlUploadExpress } = require('graphql-upload');
const path = require('path');
const fs = require('fs');
const typeDefs = fs.readFileSync(path.join(__dirname, 'graphql', 'schema.graphql'), 'utf8');
const resolvers = require('./graphql/resolvers');

// Initialize Express App
const app = express();

// Middleware to handle file uploads
app.use(
  graphqlUploadExpress({
    maxFileSize: 10 * 1024 * 1024, // 10 MB
    maxFiles: 10,
  })
);

// Initialize Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Start Apollo Server and apply middleware
async function startServer() {
  await server.start();
  server.applyMiddleware({ app });

  // Ensure uploads directory exists
  const uploadDir = path.join(__dirname, 'uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }

  // Start the server
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
  });
}

startServer();
