import { gql } from 'apollo-server-express';
import { mergeTypeDefs } from '@graphql-tools/merge';
import { postSchema } from './postSchema';

const baseSchema = gql`
  type Query
  type Mutation
`;


export const typeDefs = mergeTypeDefs([baseSchema, postSchema])