<template>
	<div class="multi-select">
		<div class="select">
			<h3>{{ label }}</h3>
			<SelectableOptionsField
				v-model="currentOption"
				:disabled="disabled"
				:options="remainingOptions"
				:placeholder="placeholder">
				<template #after-dropdown>
					<button
						type="button"
						class="add-btn material-icons"
						@click="addCurrentOption">
						add
					</button>
				</template>
			</SelectableOptionsField>
		</div>
		<ul class="selected-options">
			<li
				v-for="option in selectedOptions"
				:key="option.value"
				class="selected-option">
				{{
					option.label || option.value
				}}
				<button
					v-if="!disabled"
					type="button"
					class="close material-icons-outlined"
					@click="removeOption(option.value)">
					close
				</button>
			</li>
			<li v-if="!selectedOptions.length" class="no-options">
				<small>There are no options selected</small>
			</li>
		</ul>
	</div>
</template>

<style scoped lang ="scss">
.selected-options{
	@apply border-t border-opacity-50;
	margin: 1em 0 3em;
	padding-top: 1em;
	display:block;

	.selected-option{
		@apply flex justify-between;
	}

	.no-options{
		@apply text-gray-500;
		text-align: center;
	}
}
@screen md {
	.multi-select .select, .selected-options {
		max-width: 70%;
	}
	.multi-select .select {
		@apply flex-row flex justify-between;
	}
}
</style>

<script setup lang="ts">
import { computed, ref } from "vue"
import type { OptionInfo } from "$@/types/component"

import subtract from "$/array/subtract"

import SelectableOptionsField from "@/fields/selectable_options.vue"

const props = defineProps<{
	disabled?: boolean
	options: readonly OptionInfo[]
	modelValue: string[]
	label: string
	placeholder?: string
}>()

const selectedOptions = computed<OptionInfo[]>(() => {
	const chosenOptions = props.options.filter(
		option => props.modelValue.includes(option.value)
	) as OptionInfo[]
	return chosenOptions
})


const remainingOptions = computed<OptionInfo[]>(
	() => subtract(props.options, selectedOptions.value)
)

const currentOption = ref<string>(remainingOptions.value[0].value)

interface CustomEvents {
	(eventName: "update:modelValue", data: string[]): void
}
const emit = defineEmits<CustomEvents>()

function addCurrentOption() {
	emit("update:modelValue", [
		...props.modelValue,
		currentOption.value
	])
}

function removeOption(removedValue: string) {
	emit("update:modelValue", props.modelValue.filter(value => value !== removedValue))
}
</script>
