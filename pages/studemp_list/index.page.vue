<template>
	<h1 class="">Institute Name</h1>
	<UsersTable :users="users" />

</template>

<script setup lang="ts">
import { ref } from "vue";
import UsersTable from "@/user_management/UsersTable.vue";

const users = [
	{
		name: "Juan Dela Cruz",
		email: "Email@email.com",
		role: "student"
	},
	{
		name: "Alice Dela Cruz",
		email: "Email@email.com",
		role: "professor"
	},
	{
		name: "Jun Dela Cruz",
		email: "Email@email.com",
		role: "professor"
	},
	{
		name: "Jay Dela Cruz",
		email: "Email@email.com",
		role: "professor"
	},
	{
		name: "Jose Dela Cruz",
		email: "Email@email.com",
		role: "secretary"
	},
	{
		name: "Marie Dela Cruz",
		email: "Email@email.com",
		role: "student"
	},
];
</script>
