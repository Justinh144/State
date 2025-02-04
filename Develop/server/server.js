// const express = require('express');
// const routes = require('./routes');
import express from 'express'
// const { ApolloServer } = require('@apollo/server');
import { ApolloServer } from '@apollo/server';
// const { expressMiddleware } = require('@apollo/server/express4');
import { expressMiddleware } from '@apollo/server/express4'
// const path = require('path');
import path from 'path';

// const { typeDefs, resolvers } = require('./schemas')
// const db = require('./config/connection');
import { typeDefs, resolvers } from './schemas/index.js';
import  db  from './config/connection.js';

const PORT = process.env.PORT || 3001;
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const app = express();

const startApolloServer = async () => {
  await server.start();


app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}


app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

// app.use(routes);
app.use('/graphql', expressMiddleware(server, {

}));


db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}.`);
    console.log(`Use GraphQL at http://localhost:${PORT}/graphql`)
  });
});

startApolloServer();

}