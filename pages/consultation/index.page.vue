<template>
<div class="left">
    <div class="justify-between">
        <div class="p-3 md:justify-end md:flex" >
                <p class="r">Consultations</p>
                <button class="material-icons flex">arrow_back_ios</button>
                <button class="material-icons flex">search</button>
                <button class="material-icons flex">add</button>
        </div>
        <img class="img" :src="SadIcon" />
        <p>Click add button to create a consultation</p>
        <br><p>The overflow property controls what happens to content that is too big to fit into an area.</p>
                <br><p>The overflow property controls what happens to content that is too big to fit into an area.</p>
                <br><p>The overflow property controls what happens to content that is too big to fit into an area.</p>
                <br><p>The overflow property controls what happens to content that is too big to fit into an area.</p>
                <br><p>The overflow property controls what happens to content that is too big to fit into an area.</p>
                <br><p>The overflow property controls what happens to content that is too big to fit into an area.</p>
                <br><p>The overflow property controls what happens to content that is too big to fit into an area.</p>
                <br><p>The overflow property controls what happens to content that is too big to fit into an area.</p>
                <br><p>The overflow property controls what happens to content that is too big to fit into an area.</p>
                <br><p>The overflow property controls what happens to content that is too big to fit into an area.</p>
                <br><p>The overflow property controls what happens to content that is too big to fit into an area.</p>
                <br><p>The overflow property controls what happens to content that is too big to fit into an area.</p>
                <br><p>The overflow property controls what happens to content that is too big to fit into an area.</p>
                <br><p>The overflow property controls what happens to content that is too big to fit into an area.</p>
                <br><p>The overflow property controls what happens to content that is too big to fit into an area.</p>
    </div>
</div>

<div class="right">
<p>Sample</p>
<br><p>The overflow property controls what happens to content that is too big to fit into an area.</p>
                <br><p>The overflow property controls what happens to content that is too big to fit into an area.</p>
                <br><p>The overflow property controls what happens to content that is too big to fit into an area.</p>
                <br><p>The overflow property controls what happens to content that is too big to fit into an area.</p>
                <br><p>The overflow property controls what happens to content that is too big to fit into an area.</p>
                <br><p>The overflow property controls what happens to content that is too big to fit into an area.</p>
                <br><p>The overflow property controls what happens to content that is too big to fit into an area.</p>
                <br><p>The overflow property controls what happens to content that is too big to fit into an area.</p>
                <br><p>The overflow property controls what happens to content that is too big to fit into an area.</p>
                <br><p>The overflow property controls what happens to content that is too big to fit into an area.</p>
                <br><p>The overflow property controls what happens to content that is too big to fit into an area.</p>
                <br><p>The overflow property controls what happens to content that is too big to fit into an area.</p>
                <br><p>The overflow property controls what happens to content that is too big to fit into an area.</p>
                <br><p>The overflow property controls what happens to content that is too big to fit into an area.</p>
                <br><p>The overflow property controls what happens to content that is too big to fit into an area.</p>
                <br><p>The overflow property controls what happens to content that is too big to fit into an area.</p>
</div>
</template>

<style scoped>

body{
  margin: 0; 
  height: 100%; 
  overflow: hidden;
  }
.left{
width: 40%; 
float:left;
overflow-y: scroll;
height:1000px;
border-right: 3px solid #bbb;

}
.right{
width: 60%; 
float:right;
height:1000px;
overflow: auto;
}

.r{
  margin-right:130px;
}

.img{

  position:relative;
  margin-top: 200px;;

}


</style>

<script setup lang="ts">
import { ref } from "vue";
let input = ref("");
const consult = [
    {
       
    }
];
function data() {
    return consult;
}
import SadIcon from "./sadicon.png"
</script>