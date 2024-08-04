import { gql } from "apollo-server-express";

export const postSchema = gql`
  type Post {
    id: ID!
    title: String!
    order: String!
  }

  type Query {
    posts: [Post]
  }

  type Mutation {
    addPost(title: String!, order: String!): Post
  }
`;