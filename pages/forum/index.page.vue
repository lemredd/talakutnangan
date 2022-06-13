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
                            <button v-if="dummyUser===post.user">
                                Edit
                            </button>
                            <button v-if="dummyUser===post.user">
                                Delete
                            </button>
                            <button v-if="dummyUser!==post.user">
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
    dummyUser
} from "./post";
import PostMenu from "@/Dropdown.vue";


var isPostMenuShown = ref(false);

function togglePostMenu()
{
    isPostMenuShown.value=!isPostMenuShown.value;
}
</script>
