import { ref, Ref } from "vue";
import { getPosts } from "./data";
import { getSecludedPosts } from "./data";

export var posts = ref(getPosts());
export var secludedPosts = ref(getSecludedPosts());

var dummyUser = "User 1";
var dummyUserDownVote = "User 2";

export function secludePostDiv(post)
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
export function getSecludedPost(post,secludedPost, i)
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
export function totalVotes(post)
{
   return post.voters.length-post.downVoters.length;
}

export function voteCountUpdate(post)
{
    return post.voteCount();
}

export function downVoteCountUpdate(post)
{
    return post.downVoters.length;
}

export function determineUserVoted(post) {
	if (post.voters.includes(dummyUser)) return true;
}

function removeBothVotes(post)
{
    post.voters=post.voters.filter(function(voter){
        
        return voter!=dummyUser;
    });
    post.downVoters=post.downVoters.filter(function(downVote) {
        
        return downVote!=dummyUserDownVote;
    });
}

export function upVote(e, post)
{
    removeBothVotes(post)
    if(e.target.checked)
    {
        post.voters.push(dummyUser);
    }
    else
    {
        post.voters=post.voters.filter(function(voter)
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
export function determineUserDownVoted(post) {
	if (post.downVoters.includes(dummyUserDownVote)) return true;
}

export function downVote(e, post)
{

    removeBothVotes(post)
    if(e.target.checked)
    {
        post.downVoters.push(dummyUserDownVote);
    }
    else
    {
        post.downVoters=post.downVoters.filter(function(downVote)
        {
            
            return downVote!=dummyUserDownVote;
        });
    }
}
//Upvote end