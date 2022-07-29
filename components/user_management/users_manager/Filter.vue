<template>
<div class="dropdown-filter-container">
			<label for="dropdown-filter">Dropdown Filter</label>
			<select name="dropdown-filter" id="dropdown-filter">
				<option v-for="filterItem in availableFilters" :value="filterItem">
					{{ filterItem }}
				</option>
			</select>
		</div>
</template>

<style scoped lang="scss">
.dropdown-filter {
	@apply grid grid-cols-2 gap-2 sm:justify-self-end;

	label {
		@apply sm:justify-self-end self-center;
	}

	.select-filter {
		@apply dark:bg-dark-300 bg-gray-300;
		position: relative;
	}
}
</style>

<script setup lang="ts">
import { computed, inject, onMounted, ref } from 'vue'
import { ManagerKind } from '../types'

const selectedFilter = ref("all")
const availableFilters = ref<string[]>(["all"])

onMounted(() => {
	fetch("/api/role/list")
	.then(res => res.json())
	.then(console.log)
})
</script>
