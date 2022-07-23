import { ref, Ref } from "vue";

export type Post = {
[x: string]: any;
    id: number
    user: string
    title: string
    desc: string
    badWordExist: () => boolean
    voters: string[]
    downVoters: string[]
    voteCount: () => number
    isMenuShown: boolean
    isEditShown: boolean
    isPostShown: boolean
    
};

var secludedPosts: Post[] = [];

var posts: Post[] = [];

export function getPosts(): Post[]
{
    return posts;
}

export function getSecludedPosts(): Post[]
{
    return secludedPosts;
}

// setInterval(() => {
//     console.log("done checkking post");
//     console.log(` checked ${posts.length}`);
// }, 2000)