import 'reflect-metadata';
import {MikroORM} from '@mikro-orm/core';
import microConfig from './mikro-orm.config';
import express from 'express';
import {ApolloServer} from "apollo-server-express";
import {buildSchema} from "type-graphql";
import {HelloResolver} from "./resolvers/hello";
import {PostResolver} from "./resolvers/post";

const main = async () => {
    // creating connection to the database
    const orm = await MikroORM.init(microConfig);

    // run the migration
    await orm.getMigrator().up();

    // create an express server instance
    const app = express();

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [HelloResolver, PostResolver],
            validate: false
        }),
        context: () => ({ em: orm.em })
    });

    apolloServer.applyMiddleware({ app });

    app.listen(4000, () => {
        console.log('Server started on localhost:4000')
    });

    /**
        // creating a new post instance
         const post = orm.em.create(Post, {title: 'My first post'});

         // inserting the data in the database
         await orm.em.persistAndFlush(post);
     */

    /**
         // get all the posts
         const posts = await orm.em.find(Post, {});

         console.log(posts);
     */
};

main().catch(err => {
    console.log(err);
});
