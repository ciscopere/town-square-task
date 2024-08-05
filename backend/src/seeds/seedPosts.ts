import { AppDataSource } from '../data-source';
import { Post } from '../entities/Post';
import { faker } from '@faker-js/faker';
import {LexoRank} from "lexorank";

const seedPosts = async () => {
    const postRepository = AppDataSource.getRepository(Post);
    let order = LexoRank.middle();
    // Generate fake posts
    const fakePosts = Array.from({ length: 300 }).map(() => {
        order = order.genNext();

        return {
            title: faker.lorem.sentence(),
            order: order.toString(),
        };
    });

    // Insert posts into the database
    await postRepository.save(fakePosts);

    console.log('Seed data inserted successfully');
};

// Initialize the data source and run the seed function
AppDataSource.initialize()
    .then(() => seedPosts())
    .catch((error) => console.error('Error during data source initialization:', error));