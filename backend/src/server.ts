import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { typeDefs } from './schemas';
import { resolvers } from './resolvers';
import { context } from './context';
import cors from 'cors';
import { createServer } from 'http';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';


const startServer = async () => {
    const app = express();

    // Configure CORS
    app.use(cors({
        origin: process.env.CORS_ORIGIN,
        methods: ['GET', 'POST'],
        credentials: true,
    }));

    const schema = makeExecutableSchema({ typeDefs, resolvers });

    const server = new ApolloServer({
        schema,
        context: () => context,
    });

    await server.start();
    server.applyMiddleware({ app });

    const httpServer = createServer(app);

    const wsServer = new WebSocketServer({
        server: httpServer,
        path: '/graphql', // Ensure this matches your subscription path
    });

    useServer({ schema }, wsServer);

    wsServer.on('listening', () => {
        console.log('WebSocket server is listening on port 4000');
    });

    wsServer.on('error', (error) => {
        console.error('WebSocket server error:', error);
    });

    const port = process.env.PORT || 4000;

    httpServer.listen(port, () => {
        console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`);
        console.log(`🚀 Subscriptions ready at ws://localhost:${port}${server.graphqlPath}`);
    });
};

startServer();
