<template>
	<h1 class="">Institute Name</h1>
	<UsersManager :users="users"/>

</template>

<script setup lang="ts">
import UsersManager from "@/user_management/UsersManager.vue";
import { ManagerKind } from "@/user_management/types";
import { users } from "./data"
import { provide } from "vue";

const managerKind = "dean" as ManagerKind
provide("managerKind", managerKind)
</script>
