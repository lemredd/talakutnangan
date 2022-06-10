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
import { posts } from "./post";
import { secludedPosts } from "./post";
import { voteCountUpdate } from "./post";
import { determineUserVoted } from "./post";
import { upVote } from "./post";
import { downVoteCountUpdate } from "./post";
import { determineUserDownVoted } from "./post";
import { downVote } from "./post";
import { totalVotes } from "./post";
import { secludePostDiv } from "./post";

</script>
