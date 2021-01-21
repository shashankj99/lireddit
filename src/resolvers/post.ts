import {Arg, Ctx, Mutation, Query, Resolver} from "type-graphql";
import {Post} from "../entities/Post";
import {MyContext} from "../types";

@Resolver()
export class PostResolver {
    /**
     * Method to list all the posts
     * @param em
     */
    @Query(() => [Post])
    posts(@Ctx() {em}: MyContext) : Promise<Post[]> {
        return em.find(Post, {});
    }

    /**
     * Method to get post by id
     * @param id
     * @param em
     */
    @Query(() => Post, {nullable: true})
    post(
        @Arg("id") id: number,
        @Ctx() {em}: MyContext
    ) : Promise<Post | null> {
        return em.findOne(Post, {id});
    }

    /**
     * Method to create a new post
     * @param title
     * @param em
     */
    @Mutation(() => Post)
    async createPost(
        @Arg("title") title: string,
        @Ctx() {em}: MyContext
    ) : Promise<Post> {
        // create a new post
        const post = em.create(Post, {title});
        await em.persistAndFlush(post);

        // return post
        return post;
    }

    /**
     * Method to Update a post
     * @param id
     * @param title
     * @param em
     */
    @Mutation(() => Post, {nullable: true})
    async updatePost(
        @Arg("id") id: number,
        @Arg("title", () => String, {nullable: true}) title: string,
        @Ctx() {em}: MyContext
    ) : Promise<Post | null> {
        // fetch the post by id
        const post = await em.findOne(Post, {id});

        // return  null if unable to find the post
        if (!post)
            return null;

        // update the title if title is not empty
        if (typeof title !== undefined) {
            // update the changes
            post.title = title;
            await em.persistAndFlush(post);
        }

        // return the post
        return post;
    }

    /**
     * Method to delete the post
     * @param id
     * @param em
     */
    @Mutation(() => Boolean)
    async deletePost(
        @Arg("id") id: number,
        @Ctx() {em}: MyContext
    ) : Promise<boolean> {
        await em.nativeDelete(Post, {id});
        return true;
    }
}
