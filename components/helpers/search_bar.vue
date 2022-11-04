<template>
	<div class="search-bar">
		<button class="material-icons">
			search
		</button>
		<input
			v-model="searchFilterText"
			type="text"
			class="search-filter"/>
	</div>
</template>

<style scoped lang="scss">
	.search-bar {
		@apply flex flex-row flex-wrap;

		button {
			@apply flex-none;
		}

		.search-filter {
			@apply flex-1 border-b-gray-900;

			width: 100%;
			background-color: transparent;

			&:focus {
				outline: none;
			}
		}
	}
</style>

<script setup lang = ts>
import { computed } from "vue"

interface CustomEvents {
	(e: "update:modelValue", slug: string): void
}
const emit = defineEmits<CustomEvents>()

const props = defineProps<{
	modelValue: string
}>()
const searchFilterText = computed<string>({
	get(): string {
		return props.modelValue
	},
	set(newValue: string): void {
		emit("update:modelValue", newValue)
	}
})
</script>
