import React from 'react';
import ReactDOM from 'react-dom/client';
import {ApolloProvider, ApolloClient, InMemoryCache, split, HttpLink} from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import App from './App';
import './index.css';
import theme from "./theme.ts";
import { ThemeProvider } from "@mui/material";

// Create an HTTP link
const httpLink = new HttpLink({
    uri: import.meta.env.VITE_GRAPHQL_URL,
});

// Create a WebSocket link
const wsLink = new GraphQLWsLink(
    createClient({
        url: import.meta.env.VITE_GRAPHQL_SUBSCRIPTION_URL,
    }),
);

// Use the split function to route between HTTP and WebSocket links
const splitLink = split(
    ({ query }) => {
        const definition = getMainDefinition(query);
        return (
            definition.kind === 'OperationDefinition' &&
            definition.operation === 'subscription'
        );
    },
    wsLink,
    httpLink,
);

// Initialize Apollo Client
const client = new ApolloClient({
    link: splitLink,
    cache: new InMemoryCache(),
});

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <ApolloProvider client={client}>
                <App />
            </ApolloProvider>
        </ThemeProvider>
    </React.StrictMode>
);
