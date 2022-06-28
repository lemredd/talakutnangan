<template>
	<div class="controls-bar">
		<div class="search-bar">
			<TextualField
				type="email"
				v-model="searchFilter"
				input-classes="!py-0 pl-1 !border-none !w-100" />
			<button class="material-icons">search</button>
		</div>
		<Filter :filter-list="roles" v-model:filter="selectedFilterRole"/>
	</div>
	<UsersList :search-filter="searchFilter" :filtered-list="filteredList"/>

</template>

<style lang="scss">
.controls-bar {
	@apply dark:bg-dark-100 bg-light-600 grid gap-y-4 sm:grid-cols-2;
	padding: .5em;

	.search-bar {
		@apply dark:bg-dark-300 bg-gray-300 flex justify-between items-center;
		padding: .25em;
	}
}
</style>

<script setup lang="ts">
import { computed, ref } from "vue"
import TextualField from "@/fields/Textual.vue"
import type { User } from "./types"
import Filter from "./users_manager/Filter.vue"
import UsersList from "./users_manager/UsersList.vue"

const { users } = defineProps<{
	users: User[]
}>()

let searchFilter = ref("");

const filteredList = computed(function() {
	const filteredBySearchResult = users.filter((user) =>
		user.name.toLowerCase().includes(searchFilter.value.toLowerCase())
	);

	const filteredByRole = filterByRole(filteredBySearchResult)
	return filteredByRole
})

const roles = ["student", "professor", "secretary"]
const selectedFilterRole = ref("all")
function filterByRole(usersList: {[key:string]: any}[]) {
	if (selectedFilterRole.value === "all") return usersList
	return usersList.filter(user => user.role === selectedFilterRole.value)
}
</script>
