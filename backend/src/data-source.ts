import "reflect-metadata";
import { DataSource } from "typeorm";
import { Post } from "./entities/Post";

export const AppDataSource = new DataSource({
    type: "postgres",
    url: process.env.DATABASE_URL,
    synchronize: false,
    logging: false,
    entities: [Post],
    migrations: ['src/migrations/*.ts'],
    subscribers: [],
    // ssl: {
    //     rejectUnauthorized: false,
    // },
});
