<template>
	<div :class="{ 'default': !editable }" class="input-container">
		<label v-if="label" class="input-header">
			{{ label }}
		</label>
		<div class="input-and-controls">
			<input
				v-model="modelValue"
				class="bg-transparent"
				:class="inputClasses"
				:type="type"
				:required="required"
				:disabled="isCurrentlyDisabled"
				@keyup.enter.exact="saveImplicitly"/>
			<button
				v-if="editable"
				type="button"
				class="material-icons"
				@click="toggleEditableField">
				{{
					isCurrentlyDisabled
						? "edit"
						: "save"
				}}
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
import { ref, computed } from "vue"

import type { Textual } from "@/fields/types"

const props = defineProps<{
	label?: string
	type: Textual
	modelValue: string
	required?: boolean
	maySaveImplicitly?: boolean
	disabled?: boolean
	editable?: boolean
	inputClasses?: string
}>()

const {
	label,
	type,
	required = true,
	editable,
	inputClasses
} = props

interface CustomEvents {
	(event: "update:modelValue", newModelValue: string): void
	(event: "saveImplicitly"): void
	(event: "save"): void
}
const emit = defineEmits<CustomEvents>()

const modelValue = computed<string>({
	"get": () => props.modelValue,
	set(newValue: string): void {
		emit("update:modelValue", newValue)
	}
})
const isCurrentlyDisabled = ref<boolean>(props.disabled as boolean || props.editable as boolean)

function toggleEditableField() {
	isCurrentlyDisabled.value = !isCurrentlyDisabled.value

	if (isCurrentlyDisabled.value) {
		emit("save")
	}
}

function saveImplicitly() {
	if (props.maySaveImplicitly) {
		emit("saveImplicitly")
	}
}
</script>
