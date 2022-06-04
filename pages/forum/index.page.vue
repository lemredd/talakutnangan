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
                        </h2>
                    </div>
                    <div class="right">
                        <label class="switch">
                            <input type="checkbox">
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
import { getPosts } from "./data";

var posts = getPosts();

var userVotes = 0;

</script>
