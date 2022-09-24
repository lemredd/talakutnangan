<template>
	<div class="selectable">
		<label v-if="label" :for="selectID">{{ label }}</label>
		<select
			:id="selectID"
			v-model="value"
			:disabled="disabled">
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

const props = defineProps<{
	options: readonly OptionInfo[]
	modelValue: string
	label?: string
	placeholder?: string,
	disabled?: boolean
}>()

const emit = defineEmits<{(e: "update:modelValue", value: string): void}>()

const selectID = computed(() => props.options.map(info => info.value).join(" ").replace(" ", "_"))
const value = computed({
	get() {
		return props.modelValue
	},
	set(newValue: string): void {
		emit("update:modelValue", newValue)
	}
})
</script>
