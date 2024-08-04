import {AppDataSource} from "../data-source";
import {Post} from "../entities/Post";

export const postResolver = {
    Query: {
        posts: async () => {
            try {
                const postRepository = AppDataSource.getRepository(Post);
                return await postRepository.find();
            } catch (error) {
                console.error('Error fetching posts:', error);
                throw new Error('Failed to fetch posts');
            }
        },
    },
    Mutation: {
        addPost: async (_: any, { title, order }: { title: string; order: string }) => {
            try {
                const postRepository = AppDataSource.getRepository(Post);
                const post = postRepository.create({ title, order });
                await postRepository.save(post);
                return post;
            } catch (error) {
                console.error('Error adding post:', error);
                throw new Error('Failed to add post');
            }
        },
    },
};