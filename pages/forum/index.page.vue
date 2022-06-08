<template>
	<div>
        <!--header start-->
        <div class="top-bar">
            <div><img src="./images/emptyImage.png"></div>
            <h4>
                Forum App
            </h4>
        </div>
        <!--header end-->

        <!--body start-->
        <div class="main">
            <br/>

            <div class="post" v-for="post in posts" v-bind:key="post.id">
                <div class="container">
                    <div class="left">
                        <h2 class = "title">
                        {{ post.user }}
                        </h2>
                    </div>
                    <div class="middle">
                        <h2 class = "title">
                        {{ post.title }}
                        {{ post.badWordExist() }}
                        </h2>
                    </div>
                    <div class="right">
                        <h2 class = "title">
                            {{ post.voteCount() }}
                        </h2>
                        <label class="switch">
                            <input type="checkbox" :checked="determineUserVoted(post)" class="switch" @click="upVote($event, post)" >
                            {{ updateVotes(alreadyVoted, post)}}
                            <span class="slider"></span>
                        </label>
                    </div>
                </div>
                <p v-bind:class="`${post.id}`">
                    {{ post.desc }}
                </p>
                <br/>

            </div>
        </div>
        <!--body end-->

        <!--footer start-->
        <footer>
            <p>Footer space<br>
            <a href="./forum">email@example.com</a></p>
        </footer>
        <!--footer end-->
	</div>
</template>

<style lang="scss">
@import "./index";
</style>

<script setup lang="ts">
import { ref, Ref } from "vue";
import { getPosts } from "./data";
import { getSecludedPosts } from "./data";

var posts = ref(getPosts());
var secludedPosts = ref(getSecludedPosts());
var alreadyVoted;

var dummyUser = "User 2"

function determineUserVoted(post) {
	if (post.voters.includes(dummyUser)) return true
}

function getSecludedPost(post,secludedPost, i)
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

console.log(secludedPosts.value)

function updateVotes(e, post)
{
    if(post.user.match(post.voters))
    {
        e.target.checked;
    }
}

function upVote(e, post)
{

    if(e.target.checked)
    {
        post.voters.push(post.user);
    }
    else
    {
        post.voters=post.voters.filter(function(voter)
        {
            return voter!=post.user;
        });
    }


}

</script>
