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

    // create a new instance of Apollo Server
    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [HelloResolver, PostResolver],
            validate: false
        }),
        context: () => ({ em: orm.em })
    });

    // add express middleware to the server
    apolloServer.applyMiddleware({ app });

    // listen to the port
    // for debugging purpose
    app.listen(4000, () => {
        console.log('Server started on localhost:4000')
    });
};

// call the main function and catch error if presents
main().catch(err => {
    console.log(err);
});
