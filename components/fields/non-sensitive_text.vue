<template>
	<div :class="{ 'default': !editable }" class="input-container">
		<label v-if="label" class="input-header">
			<h2>{{ label }}</h2>
		</label>
		<div class="input-and-controls">
			<input
				class="bg-transparent"
				:class="inputClasses"
				:type="type"
				:value="modelValue"
				:required="required"
				:disabled="disabled || editable"
				@input="updateModelValue"/>
			<button
				v-if="editable"
				type="button"
				class="material-icons"
				@click="editField">
				edit
			</button>
		</div>
	</div>
</template>
<style scoped lang="scss">
.input-container {
	@apply flex flex-col;

	label {
		margin-bottom: .5em;

		h2 {
			font-size: 1.5em;
		}
	}

	&.default {
		display: block;
	}

	.input-and-controls {
		@apply flex items-center;

		input {
			@apply flex-1;
			padding-bottom: .25em;

			&:not(:disabled) {
				border-bottom: 1px solid hsl(0, 0%, 60%);
				outline: none;
			}
		}
		.material-icons {
			@apply justify-self-end;
		}
	}
}
</style>
<script setup lang="ts">
import type { Textual } from "@/fields/types"

const {
	label,
	type,
	modelValue,
	required = true,
	disabled,
	editable,
	inputClasses
} = defineProps<{
	label?: string
	type: Textual
	modelValue: string
	required?: boolean
	disabled?: boolean
	editable?: boolean
	inputClasses?: string
}>()
const emit = defineEmits<{(e: "update:modelValue", newModelValue: string): void}>()

function updateModelValue(event: Event) {
	const castTarget = event.target as HTMLInputElement
	emit("update:modelValue", castTarget.value)
}

function editField(event: Event) {
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const castTarget = event.target as HTMLButtonElement
	const inputSibling = castTarget.previousSibling as HTMLInputElement

	inputSibling.disabled = !inputSibling.disabled
}
</script>
