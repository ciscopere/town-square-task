import { gql } from '@apollo/client';

export const GET_POSTS = gql`
  query GetPosts($offset: Int, $limit: Int) {
    posts(offset: $offset, limit: $limit) {
      id
      title
      order
    }
  }
`;

export const REORDER_POST = gql`
  mutation ReorderPost($id: ID!, $prevId: ID, $nextId: ID, $index: Int) {
    reorderPost(id: $id, prevId: $prevId, nextId: $nextId, index: $index) {
      id
      title
      order
    }
  }
`;

export const POST_REORDERED_SUBSCRIPTION = gql`
  subscription PostReordered {
    postReordered {
      id
      index
    }
  }
`;