<template>
	<button>
		<span class="material-icons">chevron_left</span>
		Previous
	</button>
	<button
		v-for="pageCount in pageLength"
		:key="pageCount"
		class="page-count-btn">
		{{ pageCount }}
	</button>
	<button>
		<span class="material-icons">chevron_right</span>
		Previous
	</button>
</template>

<style>
</style>

<script setup lang="ts">
import { computed } from "vue"

import { DEFAULT_LIST_LIMIT } from "$/constants/numerical"

type DefinedProps = {
	maxCount: number
}
const props = defineProps<DefinedProps>()

const pageLength = computed(
	() => Math.ceil(props.maxCount / DEFAULT_LIST_LIMIT)
)
</script>
