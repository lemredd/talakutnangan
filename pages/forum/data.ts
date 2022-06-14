export type Post = {
    id: number
    user: string
    title: string
    desc: string
    badWordExist: () => boolean
    voters: string[]
    downVoters: string[]
    voteCount: () => number
    
};

var secludedPosts: Post[];

var posts: Post[];

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