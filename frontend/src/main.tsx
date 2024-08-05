import React from 'react';
import ReactDOM from 'react-dom/client';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
import App from './App';
import './index.css';
import theme from "./theme.ts";
import {ThemeProvider} from "@mui/material";

// Initialize Apollo Client
const client = new ApolloClient({
    uri: import.meta.env.VITE_GRAPHQL_URL, // Replace with your GraphQL endpoint
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