import {AppDataSource} from "../data-source";
import {Post} from "../entities/Post";
import {LexoRank} from "lexorank";
import { PubSub } from 'graphql-subscriptions';

const pubsub = new PubSub();
const POST_REORDERED = 'POST_REORDERED';

export const postResolver = {
    Query: {
        posts: async (_: any, { offset = 0, limit = 20 }) => {
            try {
                console.log(`Getting posts from ${offset} to ${limit}`)
                const postRepository = AppDataSource.getRepository(Post);
                return await postRepository.find({
                    skip: offset,
                    take: limit,
                    order: { order: "ASC" },
                });
            } catch (error) {
                console.error('Error fetching posts:', error);
                throw new Error('Failed to fetch posts');
            }
        },
    },
    Mutation: {
        reorderPost: async (_: any, { id, prevId, nextId, index }: { id: number; prevId?: number; nextId?: number; index?: number }) => {
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

            // Update the post with new order
            const post = await postRepository.findOneBy({ id });
            if (post) {
                post.order = newOrder;
                await postRepository.save(post);
                console.log(`Post order updated. ID: ${post.id}`);

                pubsub.publish(POST_REORDERED, { postReordered: {
                    id: post.id,
                    index: index
                }});

                return post;
            }

            throw new Error("Post not found");
        },
    },
    Subscription: {
        postReordered: {
            subscribe: () => pubsub.asyncIterator([POST_REORDERED])
        },
    },
};
