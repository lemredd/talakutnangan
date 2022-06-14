import { ref, Ref } from "vue";
import { getPosts } from "./data";
import { getSecludedPosts } from "./data";
import { badWordExist } from "./profanityFilter";
import type { Post } from "./data";

export var posts = ref(getPosts());
export var secludedPosts = ref(getSecludedPosts());

export var dummyUserDemo =
[
    {
        userName: "Gregorio"
    }
];

//Create post start
//To create a post, the needed variables are
// - ID - 1
// - Username - 2
// - Post title - 3
// - Post description - 4
// - Empty voters object - 5
// - Empty down voters object - 6
export function createPost(id: number, user: string, title: string, desc: string, voters:[], downVoters: [])
{
    var postCreate = 
    {
        id,
        user,
        title,
        desc,
        badWordExist: function()
        {
            return badWordExist(title)||badWordExist(desc);
        },
        voters,
        downVoters,
        voteCount: function()
        {
            return voters.length;
        },
    };
    
    posts.value.push(postCreate);
}
//Create post end

//Post seclusion start
export function secludePostDiv(post: Post)
{
    if(secludedPosts.value.includes(post))
    {
        return true;
    }
    else
    {
        return false;
    }
}
//Post seclusion end

//Post seclusion push start
export function getSecludedPost(post: Post, secludedPosts: Post[], i: number)
{
    if(post.badWordExist()==true)
    {
        if(secludedPosts[i]===post)
        {
			console.log("This post has already been secluded");
        }
        else
        {
            secludedPosts.push(post);
            alert("Please correct your post!")
        }
    }
}

// posts.value.forEach(function(post: any, i: any) {
// 	getSecludedPost(post, secludedPosts.value, i)
// })
//Post seclusion push end

//Upvote start
export function totalVotes(post: Post)
{
   return post.voters.length-post.downVoters.length;
}

export function voteCountUpdate(post: Post)
{
    return post.voteCount();
}

export function downVoteCountUpdate(post: Post)
{
    return post.downVoters.length;
}

export function determineUserVoted(post: Post) {
	if (post.voters.includes(dummyUserDemo[0].userName)) return true;
}

function removeBothVotes(post: Post)
{
    post.voters=post.voters.filter(function(voter: string){
        
        return voter!=dummyUserDemo[0].userName;
    });
    post.downVoters=post.downVoters.filter(function(downVote: string) {
        
        return downVote!=dummyUserDemo[0].userName;
    });
}

export function upVote(e: Event, post: Post)
{
    const targetHTML = e.target as HTMLInputElement;
    removeBothVotes(post)
    if(targetHTML.checked)
    {
        post.voters.push(dummyUserDemo[0].userName);
    }
    else
    {
        post.voters=post.voters.filter(function(voter: string)
        {
            
            return voter!=dummyUserDemo[0].userName;
        });
    }
    if(determineUserDownVoted(post)==true)
    {
        
    }
}
//Upvote end

//Downvote start
export function determineUserDownVoted(post: Post) {
	if (post.downVoters.includes(dummyUserDemo[0].userName)) return true;
}

export function downVote(e: Event, post: Post)
{
    const targetHTML = e.target as HTMLInputElement;
    removeBothVotes(post)
    if(targetHTML.checked)
    {
        post.downVoters.push(dummyUserDemo[0].userName);
    }
    else
    {
        post.downVoters=post.downVoters.filter(function(downVote: string)
        {
            
            return downVote!=dummyUserDemo[0].userName;
        });
    }
}
//Upvote end