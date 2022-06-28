<template>
	<h1 class="">Institute Name</h1>
	<UsersTable :users="users" :manager-kind="managerKind" />

</template>

<script setup lang="ts">
import UsersTable from "@/user_management/UsersTable.vue";
import { ManagerKind } from "@/user_management/types";
import { users } from "./data"
import { provide } from "vue";

const managerKind = "dean" as ManagerKind
provide("managerKind", managerKind)
</script>
