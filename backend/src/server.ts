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
        origin: 'http://localhost:5173',
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

    app.listen({ port: 4000 }, () =>
        console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
    );
};

startServer();