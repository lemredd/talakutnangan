<template>
	<!-- TODO(lead): generalize data properties. Current setup only reads type `User` properties -->
	<div class="data-row" v-for="data in filteredList" :key="data.name">
		<span class="data-name">{{ data.name }}</span>
		<span class="data-email">{{ data.email }}</span>
		<span :class="`data-${roleOrJobTitleClasses}`">{{ isListForServiceEmployees ? data.jobTitle : data.role }}</span>
		<div class="btns">
			<button class="btn1 ">Update</button>
		</div>
	</div>

	<div class="no-results" v-if="searchFilter && !filteredList.length">
		<p>No results found!</p>
	</div>
</template>

<style scoped lang="scss">
.data-row {
	@apply dark:text-light-100 flex flex-col gap-2 sm:items-center sm:flex-row sm:justify-between;
	margin: .5rem;
	border-bottom-width: 1px;
	padding-bottom: .5rem;
	font-size: 1.5rem;

	.data-name { 
		@apply sm:flex sm:flex-1 justify-start;
		font-size: 1rem;
		@screen sm {
			width: 40vw
		}
	}
	.data-email, .data-role, .data-job-title {
		@apply sm:flex sm:flex-1 justify-self-start;
		font-size: 0.75rem;
	}
	.btns{
		@apply sm:flex sm:flex-1 justify-end;
		min-width: 200px;
	}
	.btn1 {
		@apply dark:bg-dark-300 bg-light-600 rounded-md w-20 text-base h-7;
	}
}
</style>

<script setup lang="ts">
import { computed, inject, onUpdated, ref } from "vue"
import { ManagerKind, User } from "../types";

const { searchFilter, filteredList } = defineProps<{
	searchFilter: string,
	filteredList: any
}>()

const managerKind = inject("managerKind") as ManagerKind
const isListForServiceEmployees =  managerKind === "service"
const roleOrJobTitleClasses = computed(() =>( isListForServiceEmployees ? "job-title" : "role"))

const dataProperties = ref<any>(null)

onUpdated(() => {
	console.log(filteredList)
})
</script>
