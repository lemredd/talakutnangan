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
            <div class="post-container">
                <div class="left">
                    {{ dummyUserDemo[0].userName }}
                </div>
                <div class="middle">
                    <h1>What's on your mind?</h1>
                </div>
                <div class="right">
                    <button @click="showCreate()">Create</button>
                </div>

            </div>
            <div class="post-container" :hidden="isCreateShown">
                <div class="container">
                <form @submit.prevent="sumbitPostDetails">
                    <div class="row">
                    <div class="col-25">
                        <label for="title">Title</label>
                    </div>
                    <div class="col-75">
                        <input type="text" id="title" name="title" placeholder="Your title.." v-model="title">
                    </div>
                    </div>       
                    <div class="row">
                    <div class="col-25">
                        <label for="desc">Description</label>
                    </div>
                    <div class="col-75">
                        <textarea id="desc" name="desc" placeholder="Write something.." style="height:200px" v-model="description"></textarea>
                    </div>
                    </div>
                    <div class="row">
                    <input type="submit" value="Submit">
                    </div>
                </form>
                </div>

            </div>

            <div class="post" v-for="post in posts" v-bind:key="post.id" :hidden="secludePostDiv(post)">

                 <div class="post-container flex justify-between w-[100%] pb-[5em]">
                    <div class="post-title">
						<h2 class="font-bold">
							Post 
                        </h2>
                    </div>
                    <div class="">

                    </div>
                    <div class="controls relative">
						<button class="material-icons" @click="togglePostMenu">more_vert</button>
						<PostMenu class="postmenu absolute top-[2em] right-0 flex flex-col" v-if="isPostMenuShown">
                            <button v-if="dummyUserDemo[0].userName===post.user" @click="editPost(post)">
                                Edit
                            </button>
                            <button v-if="dummyUserDemo[0].userName===post.user" @click="deletePost(post)">
                                Delete
                            </button>
                            <button v-if="dummyUserDemo[0].userName!==post.user" @click="reportPost(post)">
                                Report
                            </button>
                        </PostMenu>
                    </div>

                </div>
                <div class="post-container">
                    <div class="left">
                        <div><img src="./images/emptyUser.png"></div>
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
                            {{ voteCountUpdate(post) }}
                        </h2>
                        <label class="switch">
                            <input type="checkbox" :checked="determineUserVoted(post)" class="switch" @click="upVote($event, post)" >
                            <span class="slider"></span>
                        </label>
                        <h2 class = "title">
                            {{ downVoteCountUpdate(post) }}
                        </h2>
                        <label class="switch">
                            <input type="checkbox" :checked="determineUserDownVoted(post)" class="switch" @click="downVote($event, post)" >
                            <span class="slider"></span>
                        </label>

                        <h2 class = "title">
                            {{ totalVotes(post) }}
                        </h2>
                    </div>
                    <p v-bind:class="`${post.id}`">
                    {{ post.desc }}
                    </p>
                </div>
                
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
import { ref } from "vue"
import {
	posts,
    secludedPosts,
    voteCountUpdate,
    determineUserVoted,
    upVote,
    downVoteCountUpdate,
    determineUserDownVoted,
    downVote,
    totalVotes,
    secludePostDiv,
    dummyUserDemo,
    createPost,
    getSecludedPost
} from "./post";
import PostMenu from "@/Dropdown.vue";


var title = ref("");
var description = ref("");

var isPostMenuShown = ref(false);
var isCreateShown = ref(true);

function sumbitPostDetails()
{
    const titleText = title.value;
    //Creation
    const descriptionText = description.value;
    createPost(1, dummyUserDemo[0].userName, titleText, descriptionText, [], []);
    //Seclusion
    posts.value.forEach(function(post: any, i: any) {
	    getSecludedPost(post, secludedPosts.value, i)
    });
    //Finishing
    alert("Successfully posted!")
    console.log(secludedPosts.value);
    isCreateShown.value=true;
    
}

function showCreate()
{
    isCreateShown.value=!isCreateShown.value;
}

function togglePostMenu()
{
    isPostMenuShown.value=!isPostMenuShown.value;
}

function editPost(post: any)
{
    console.log(post);
    
}

function deletePost(post: any)
{
    
}

function reportPost(post: any)
{

}

//To create a post, the needed variables are
// - ID - 1
// - Username - 2
// - Post title - 3
// - Post description - 4
// - Empty voters object - 5
// - Empty down voters object - 6

</script>
