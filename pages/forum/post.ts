import { ref, Ref } from "vue";
import { getPosts } from "./data";
import { getSecludedPosts } from "./data";

export var posts = ref(getPosts());
export var secludedPosts = ref(getSecludedPosts());

export var dummyUser = "User 2";
var dummyUserDownVote = "User 3";

export function secludePostDiv(post: any)
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

//Post seclusion push start
export function getSecludedPost(post: any ,secludedPost: any, i: any)
{

    if(post.badWordExist()==true)
    {
        if(secludedPost[i]===post)
        {
			console.log("this post has already been secluded");
        }
        else
        {
            secludedPost.push(post);
        }

    }
}

posts.value.forEach(function(post, i) {
	getSecludedPost(post, secludedPosts.value, i)
})
//Post seclusion push end

//Upvote start
export function totalVotes(post: any)
{
   return post.voters.length-post.downVoters.length;
}

export function voteCountUpdate(post: any)
{
    return post.voteCount();
}

export function downVoteCountUpdate(post: any)
{
    return post.downVoters.length;
}

export function determineUserVoted(post: any) {
	if (post.voters.includes(dummyUser)) return true;
}

function removeBothVotes(post: any)
{
    post.voters=post.voters.filter(function(voter: any){
        
        return voter!=dummyUser;
    });
    post.downVoters=post.downVoters.filter(function(downVote: any) {
        
        return downVote!=dummyUserDownVote;
    });
}

export function upVote(e: any, post: any)
{
    removeBothVotes(post)
    if(e.target.checked)
    {
        post.voters.push(dummyUser);
    }
    else
    {
        post.voters=post.voters.filter(function(voter: any)
        {
            
            return voter!=dummyUser;
        });
    }
    if(determineUserDownVoted(post)==true)
    {
        
    }
}
//Upvote end

//Downvote start
export function determineUserDownVoted(post: any) {
	if (post.downVoters.includes(dummyUserDownVote)) return true;
}

export function downVote(e: any, post: any)
{

    removeBothVotes(post)
    if(e.target.checked)
    {
        post.downVoters.push(dummyUserDownVote);
    }
    else
    {
        post.downVoters=post.downVoters.filter(function(downVote: any)
        {
            
            return downVote!=dummyUserDownVote;
        });
    }
}
//Upvote end