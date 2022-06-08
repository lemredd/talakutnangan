<template>
    <h1 class="text-2xl m-2 text-light-200">Students of (Institute)</h1>
    <div>
        <div class="bg-dark-100 h-10">
            <input
                class="m-2 bg-dark-300 rounded-md w-40 text-light-200 text-xs h-6"
                type="text"
                v-model="input"
            />
        </div>
    </div>
    <div class="text-2xl m-2 text-light-100" v-for="student in filteredList()" :key="student">
        <p>{{ student }}</p>
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
</style>

<script setup lang="ts">
import { ref } from "vue";
let input = ref("");
const students = ["Student 1", "Student 2", "Student 3", "Student 4", "Student 5", "Student 6", "Student 7"];
function filteredList() {
    return students.filter((student) =>
        student.toLowerCase().includes(input.value.toLowerCase())
    );
}
import SearchIcon from "./search_icon.png"
</script>

