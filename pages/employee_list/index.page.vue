<template>
    <h1 class="text-2xl m-2 ">Employees</h1>
        <UsersTable :users="users" />

    <!-- <div>
        <div>
            <div class=" flex">
            <input
                class="m-2 bg-dark-300 rounded-md w-40 text-xs h-6"
                type="text"
                v-model="input"
            />
            <span class="material-icons search">search</span>
            </div>
        </div>
    </div>
    <div class="text-2xl m-2" v-for="student in filteredList()" :key="student.name">
        <div class="user-entry flex justify-between border-b p-b-2 basis-70 place-items-center">
            <span class="user-name text-lg w-50">{{ student.name }}</span>
            <span class="user-email text-xs">{{ student.email }}</span>
            <span class="user-job text-xs">{{ student.job }}</span>
            <div>
                <select class="custom-select text-xs">
                    <option value="0">Job Title</option>
                    <option value="1"></option>
                    <option value="2"></option>
                    <option value="3"></option>
                </select>
            </div>
            <div class="btns">
                <button class=" btn1 rounded-md w-20 text-base h-7">Update</button>
            </div>
            
        </div>
    </div>
    
    <div v-if="input && !filteredList().length">
        <p>No results found!</p>
    </div> -->
</template>

<style>
</style>

<script setup lang="ts">
import { ManagerKind } from "@/user_management/types";
import UsersTable from "@/user_management/UsersTable.vue";
import { provide } from "vue";
import { users } from "./data"

const managerKind = "service" as ManagerKind
provide("managerKind", managerKind)
</script>


