<template>
    <h1 class="text-2xl m-2 ">Employees</h1>
        <UsersManager :users="users" />
</template>

<style>
</style>

<script setup lang="ts">
import { ManagerKind } from "@/user_management/types";
import UsersManager from "@/user_management/UsersManager.vue";
import { provide } from "vue";
import { users } from "./data"

const managerKind = "service" as ManagerKind
provide("managerKind", managerKind)
</script>


