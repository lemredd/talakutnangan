<template>
	<h1 class="">Institute Name</h1>
	<UsersTable :users="users" manager-kind="dean" />

</template>

<script setup lang="ts">
import UsersTable from "@/user_management/UsersTable.vue";
import { users } from "./data"
</script>
