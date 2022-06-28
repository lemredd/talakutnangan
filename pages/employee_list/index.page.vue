<template>
    <h1 class="text-2xl m-2 ">Employees</h1>
        <UsersManager :users="users" />
</template>

<style>
</style>

<script setup lang="ts">
import { ManagerKind } from "@/user_management/types";
import UsersManager from "@/user_management/UsersManager.vue";
import { onBeforeMount, provide, ref } from "vue";
import { users } from "./data"

const managerKind = "service" as ManagerKind
provide("managerKind", managerKind)

const jobTitles = ref<string[]>([])

onBeforeMount(function() {
    const jobTitlesNoDuplicate = new Set([...jobTitles.value])
    users.forEach(user => jobTitlesNoDuplicate.add(user.jobTitle))

    jobTitles.value = [...jobTitlesNoDuplicate]
})
provide("filterList", jobTitles)

</script>


