import express from "express";
import { ApolloServer } from "apollo-server-express";
import { typeDefs } from './schemas';
import { resolvers } from './resolvers';
import {context} from "./context";
import cors from 'cors';

const startServer = async () => {
    const app = express();

    // Configure CORS
    app.use(cors({
        origin: process.env.GRAPHQL_URL,
        methods: ['GET', 'POST'],
        credentials: true,
    }));

    const server = new ApolloServer({
        typeDefs,
        resolvers,
        context: () => context,
    });

    await server.start();
    server.applyMiddleware({ app });

    const port = process.env.PORT || 4000;

    app.listen({ port: port }, () =>
        console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`)
    );
};

startServer();