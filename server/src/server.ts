import express from "express";
import { ApolloServer } from "apollo-server-express";

const startServer = async (): Promise<void> => {
    const app = express();
    // const server = new ApolloServer({
    // });
    //
    // await server.start();
    // server.applyMiddleware({ app });

    app.listen({ port: 4000 }, () =>
        console.log(`🚀 Server ready at http://localhost:4000`)
    );
};

startServer();
