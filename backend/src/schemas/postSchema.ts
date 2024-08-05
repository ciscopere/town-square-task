import { gql } from "apollo-server-express";

export const postSchema = gql`
  type Post {
    id: ID!
    title: String!
    order: String!
  }
  
  type PostReordered {
    id: ID!
    index: Int
  }

  type Query {
    posts(offset: Int, limit: Int): [Post]
  }

  type Mutation {
    reorderPost(id: ID!, prevId: ID, nextId: ID, index: Int): Post
  }
  
  type Subscription {
    postReordered: PostReordered
  }
`;
