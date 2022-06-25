<template>
	<h1 class="">Institute Name</h1>
	<div>
		<div class="controls-bar">
			<div class="search-bar ">
				<TextualField
					type="email"
					v-model="input"
					input-classes="!py-0 pl-1 !border-none" />
				<button class="material-icons">search</button>
			</div>
			<div class="dropdown-filter grid grid-cols-2 gap-2">
				<span class="sm:justify-self-end self-center">Role: </span>
				<select v-model="selectedFilterRole" name="role-filter" id="role-filter" class="role-filter bg-gray-300">
					<option selected value="all">All</option>
					<option v-for="role in roles" :value="role">{{ role }}</option>
				</select>
			</div>
		</div>
	</div>
	<div class="user-row" v-for="user in filteredList()" :key="user.name">
		<span class="user-name">{{ user.name }}</span>
		<span class="user-email">{{ user.email }}</span>
		<span class="user-role">{{ user.role }}</span>
		<div class="btns">
			<button class="btn1">Update</button>
		</div>
	</div>

	<div class="no-results" v-if="input && !filteredList().length">
		<p>No results found!</p>
	</div>
</template>

<style lang="scss">
.btn1 {
background:white;
}
.btn1:hover{
background: gray;
}

.controls-bar {
	@apply dark:bg-dark-100 bg-light-600 p-2 grid gap-y-4 sm:grid-cols-2;

	.search-bar {
		@apply dark:bg-dark-300 bg-gray-300 flex justify-between items-center p-1;
	}
	.dropdown-filter {
		@apply sm:justify-self-end;

		.role-filter {
			position: relative;

			.dropdown-container {
				position: absolute;
				left: 0; right: 0;
			}
		}
	}
}

.img1{
	margin-top:8px;
	margin-left:-15px;
}

.user-row {
	@apply text-2xl m-2 dark:text-light-100 flex flex-col gap-2 sm:items-center sm:flex-row sm:justify-between border-b p-b-2;

	.user-name {
		@apply text-lg w-50;
	}
	.user-email, .user-role {
		@apply text-xs;
	}

	.btn1 {
		@apply bg-light-600 rounded-md w-20 text-base h-7;
	}
}

</style>

<script setup lang="ts">
import { ref } from "vue";
import TextualField from "@/fields/Textual.vue"

let input = ref("");
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
function filteredList() {
	const filteredBySearchResult = users.filter((user) =>
		user.name.toLowerCase().includes(input.value.toLowerCase())
	);

	const filteredByRole = filterByRole(filteredBySearchResult)
	return filteredByRole
}

const roles = ["student", "professor", "secretary"]
const selectedFilterRole = ref("all")
function filterByRole(usersList: {[key:string]: any}[]) {
	if (selectedFilterRole.value === "all") return usersList
	return usersList.filter(user => user.role === selectedFilterRole.value)
}

import SearchIcon from "./search_icon.png"
</script>
