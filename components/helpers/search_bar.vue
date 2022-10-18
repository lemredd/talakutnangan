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
	.search-filter {
		@apply border-b-gray-900;

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

const emit = defineEmits<{
	(e: "update:modelValue", slug: string): void
}>()

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
