import { AppDataSource } from '../data-source';
import { Post } from '../entities/Post';
import { faker } from '@faker-js/faker';

const seedPosts = async () => {
    const postRepository = AppDataSource.getRepository(Post);
    // Generate fake posts
    const fakePosts = Array.from({ length: 10 }).map(() => ({
        title: faker.lorem.sentence(),
        order: faker.number.int().toString(),
    }));

    // Insert posts into the database
    await postRepository.save(fakePosts);

    console.log('Seed data inserted successfully');
};

// Initialize the data source and run the seed function
AppDataSource.initialize()
    .then(() => seedPosts())
    .catch((error) => console.error('Error during data source initialization:', error));