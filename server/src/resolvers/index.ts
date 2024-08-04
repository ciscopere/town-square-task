import { postResolver } from './postResolver';

export const resolvers = {
    Query: {
        ...postResolver.Query,
    },
    Mutation: {
        ...postResolver.Mutation,
    },
};