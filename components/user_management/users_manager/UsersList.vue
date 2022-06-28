<template>
	<div class="user-row" v-for="user in filteredList" :key="user.name">
		<span class="user-name">{{ user.name }}</span>
		<span class="user-email">{{ user.email }}</span>
		<span :class="`user-${roleOrJobTitleClasses}`">{{ isListForServiceEmployees ? user.jobTitle : user.role }}</span>
		<div class="btns">
			<button class="btn1">Update</button>
		</div>
	</div>

	<div class="no-results" v-if="searchFilter && !filteredList.length">
		<p>No results found!</p>
	</div>
</template>

<style scoped lang="scss">
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
	.user-email, .user-role, .user-job-title {
		font-size: 0.75rem;
	}

	.btn1 {
		@apply dark:bg-dark-300 bg-light-600 rounded-md w-20 text-base h-7;
	}
}
</style>

<script setup lang="ts">
import { computed, inject } from "vue"
import { ManagerKind, User } from "../types";

const { searchFilter, filteredList } = defineProps<{
	searchFilter: string,
	filteredList: {[key: string]: any}[]
}>()

const managerKind = inject("managerKind") as ManagerKind
const isListForServiceEmployees =  managerKind === "service"
const roleOrJobTitleClasses = computed(() =>( isListForServiceEmployees ? "job-title" : "role"))
</script>