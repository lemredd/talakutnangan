<template>
	<div class="controls-bar">
		<div class="search-bar ">
			<TextualField
				type="email"
				v-model="input"
				input-classes="!py-0 pl-1 !border-none" />
			<button class="material-icons">search</button>
		</div>
		<div class="dropdown-filter">
			<label for="role-filter">Role: </label>
			<select v-model="selectedFilterRole" name="role-filter" id="role-filter" class="role-filter">
				<option selected value="all">All</option>
				<option v-for="role in roles" :value="role">{{ role }}</option>
			</select>
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
.controls-bar {
	@apply dark:bg-dark-100 bg-light-600 grid gap-y-4 sm:grid-cols-2;
	padding: .5em;

	.search-bar {
		@apply dark:bg-dark-300 bg-gray-300 flex justify-between items-center;
		padding: .25em;
	}

	.dropdown-filter {
		@apply grid grid-cols-2 gap-2 sm:justify-self-end;

		label {
			@apply sm:justify-self-end self-center;
		}

		.role-filter {
			@apply dark:bg-dark-300 bg-gray-300;
			position: relative;

			.dropdown-container {
				position: absolute;
				left: 0; right: 0;
			}
		}
	}
}

.user-row {
	@apply dark:text-light-100 flex flex-col gap-2 sm:items-center sm:flex-row sm:justify-between;
	margin: .5rem;
	border-bottom-width: 1px;
	padding-bottom: .5rem;
	font-size: 1.5rem;

	.user-name {
		font-size: 1.125rem;
		@screen sm {
			width: 20%;
		}
	}
	.user-email, .user-role {
		font-size: 0.75rem;
	}

	.btn1 {
		@apply dark:bg-dark-300 bg-light-600 rounded-md w-20 text-base h-7;
	}
}
</style>

<script setup lang="ts">
import { ref } from "vue"
import TextualField from "@/fields/Textual.vue"

const { users } = defineProps<{
	users: { [key:string]: any }[]
}>()

let input = ref("");

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
</script>
