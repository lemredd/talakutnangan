<template>
	<div class="selectable">
		<label v-if="label" :for="selectID">{{ label }}</label>
		<select
			:id="selectID"
			:value="modelValue"
			@change="updateModelValue">
			<option
				value=""
				disabled>
				{{
					placeholder ?? "Please select"
				}}
			</option>

			<option
				v-for="option in options"
				:key="option.value"
				:value="option.value">
				{{ option.label ?? option.value }}
			</option>
		</select>
		<slot name="after-dropdown"></slot>
	</div>
</template>

<style scoped lang="scss">
@media (min-width: 640px) {
	.selectable{
		max-width: 70%;
		@apply flex-row flex justify-between;
	}
}
</style>

<script setup lang="ts">
import { computed } from "vue"
import type { OptionInfo } from "$@/types/component"

const {
	options,
	modelValue,
	label,
	placeholder
} = defineProps<{
	options: readonly OptionInfo[]
	modelValue: string
	label?: string
	placeholder?: string
}>()

const selectID = computed(() => options.map(info => info.value).join(" ").replace(" ", "_"))

const emit = defineEmits<{(e: "update:modelValue", value: string): void}>()

function updateModelValue(event: Event) {
	const element = event.target as HTMLSelectElement
	emit("update:modelValue", element.value)
}
</script>
