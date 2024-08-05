import { gql } from '@apollo/client';

export const GET_POSTS = gql`
  query GetPosts {
    posts {
      id
      title
      order
    }
  }
`;

export const REORDER_POST = gql`
  mutation ReorderPost($id: ID!, $prevId: ID, $nextId: ID) {
    reorderPost(id: $id, prevId: $prevId, nextId: $nextId) {
      id
      title
      order
    }
  }
`;