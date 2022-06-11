<template>
    <h1 class="text-2xl m-2 text-light-200">Students of (Institute)</h1>
    <div>
        <div class="bg-dark-100 h-10">
            <div class=" flex">
            <input
                class="m-2 bg-dark-300 rounded-md w-40 text-light-200 text-xs h-6"
                type="text"
                v-model="input"
            />
            <img class="img1 bg-dark-900 rounded-md h-6 p-1.5" :src="SearchIcon"/>
            </div>
        </div>
    </div>
    <div class="text-2xl m-2 text-light-100" v-for="student in filteredList()" :key="student.name">
        <div class="user-entry flex justify-between border-b p-b-2 basis-70 place-items-center">
            <span class="user-name text-lg w-50">{{ student.name }}</span>
            <span class="user-email text-xs">{{ student.email }}</span>
            <div class="btns">
                <button class=" btn1 text-dark-100 rounded-md w-20 text-base h-7">Update</button>
            </div>
            
        </div>
    </div>
    
    <div class="text-light-200" v-if="input && !filteredList().length">
        <p>No results found!</p>
    </div>
</template>

<style>

body {
    padding: 20px;
    min-height: 100vh;
    background-color: rgb(37, 40, 46);
}

.btn1 {
background:white;
}
.btn1:hover{
background: gray;
}

.img1{

    margin-top:8px;
    margin-left:-15px;
}

</style>

<script setup lang="ts">

import { ref } from "vue";
let input = ref("");
const students = [
    {
        name: "Juan Dela Cruz",
        email: "Email@email.com",
    },
    {
        name: "Alice Dela Cruz",
        email: "Email@email.com",
    },
    {
        name: "Jun Dela Cruz",
        email: "Email@email.com",

    },
        {
        name: "Jay Dela Cruz",
        email: "Email@email.com",

    },
        {
        name: "Jose Dela Cruz",
        email: "Email@email.com",

    },
        {
        name: "Marie Dela Cruz",
        email: "Email@email.com",

    },
];
function filteredList() {
    return students.filter((student) =>
        student.name.toLowerCase().includes(input.value.toLowerCase())
    );
}

import SearchIcon from "./search_icon.png"
</script>


