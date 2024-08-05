export interface Post {
    id: number;
    title: string;
    order: string;
}

export interface GetPostsData {
    posts: Post[];
}

export interface ReorderPostVariables {
    id: number;
    prevId: number | null;
    nextId: number | null;
    index: number | null;
}