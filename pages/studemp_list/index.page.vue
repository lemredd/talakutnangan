<template>
    <h1 class="">Institute Name</h1>
    <div>
        <button>Student
            </button>>
            <button>
            </button>>
        </div>>
    <div>
            <div class=" flex">
            <input
                type="text"
                v-model="input"
            />
            <img class="img1 bg-dark-900 rounded-md h-6 p-1.5" :src="SearchIcon"/>
            </div>
        </div>
    </div>
    <div class="text-2xl m-2 text-light-100" v-for="student in filteredList()" :key="student.name">
        <div class="user-entry flex justify-between border-b p-b-2 place-items-center">
            <span class="user-name text-lg w-50 text-right">{{ student.name }}</span>
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

<style scoped lang="scss">
.btn1 {
background:white;
}
.btn1:hover{
background: gray;
}

.controls-bar {
	@apply dark:bg-dark-100 h-10 bg-light-200 px-2 py-6 flex items-center justify-between;

	.search-bar {
		@apply dark:bg-dark-300 inline-flex items-center p-1;
	}
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


