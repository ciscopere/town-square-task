import {AppDataSource} from "../data-source";
import {Post} from "../entities/Post";
import {LexoRank} from "lexorank"
import LexoRankBucket from "lexorank/lib/lexoRank/lexoRankBucket";

export const postResolver = {
    Query: {
        posts: async () => {
            try {
                const postRepository = AppDataSource.getRepository(Post);
                return await postRepository.find({ order: { order: "ASC" } });
            } catch (error) {
                console.error('Error fetching posts:', error);
                throw new Error('Failed to fetch posts');
            }
        },
    },
    Mutation: {
        reorderPost: async (_: any, { id, prevId, nextId }: { id: number; prevId?: number; nextId?: number }) => {
            const postRepository = AppDataSource.getRepository(Post);

            // Find the prev and next posts
            const prevPost = prevId ? await postRepository.findOneBy({ id: prevId }) : null;
            const nextPost = nextId ? await postRepository.findOneBy({ id: nextId }) : null;

            // Calculate new order
            let newOrder;
            if (prevPost && nextPost) {
                newOrder = LexoRank.parse(nextPost.order).between(LexoRank.parse(prevPost.order)).format();
            } else if (prevPost) {
                newOrder = LexoRank.parse(prevPost.order).genNext().toString();
            } else if (nextPost) {
                newOrder = LexoRank.parse(nextPost.order).genPrev().toString();
            } else {
                newOrder = LexoRank.middle().toString();
            }
console.log(newOrder);
            // Update the post with new order
            const post = await postRepository.findOneBy({ id });
            if (post) {
                post.order = newOrder;
                await postRepository.save(post);
                return post;
            }

            throw new Error("Post not found");
        },
    },
};