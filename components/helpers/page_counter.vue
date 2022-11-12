<template>
	<div class="page-counter">
		<button class="movement-btn previous-btn">
			<span class="material-icons">chevron_left</span>
			<span class="text">Previous</span>
		</button>
		<button
			v-for="pageCount in pageLength"
			:key="pageCount"
			class="page-count-btn"
		</button>
		<button class="movement-btn next-btn">
			<span class="text">Next</span>
			<span class="material-icons">chevron_right</span>
		</button>
	</div>
</template>

<style scoped lang="scss">
	.page-counter {
		@apply flex;

		.movement-btn {
			@apply flex items-center;
		}

		.page-count-btn {
			@apply px-4;
		}
	}
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
