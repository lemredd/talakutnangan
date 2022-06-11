<template>
	<div class="input-container text-light-100">
		<label class="input-header col-span-full">
			{{ label }}
		</label>
		<input
			class="bg-transparent"
			:type="type"
			:value="modelValue"
			@input="emitUpdate"
			:required="required"
			:disabled="disabled || editable"
			ref="inputField"
			/>
			<button v-if="editable" class="material-icons" @click="editField">edit</button>
	</div>
</template>

<style scoped lang="scss">
.input-container {
	display: grid;
	grid-template: repeat(2, minmax(0, 1fr)) / repeat(2, minmax(0, 1fr));
	padding: 1.5em 0;

	input {
		padding-bottom: .25em;
		width: max-content;
	}
	button.material-icons {
		justify-self: end;
	}
}

</style>

<script setup lang="ts">
import type { Textual } from "@/fields/types"
import { ref } from "vue"

const { label, type, modelValue, required = true, disabled, editable } = defineProps<{
	label: string,
	type: Textual,
	modelValue: string,
	required?: boolean
	disabled?: boolean
	editable?: boolean
}>()
const emit = defineEmits<{
	(e: "update:modelValue", modelValue: string ): void
}>()

const inputField = ref(null)

function emitUpdate(event: Event) {
	emit("update:modelValue", (event.target as HTMLInputElement).value)
}

function editField(e: Event) {
	inputField.value.disabled = !inputField.value.disabled
}
</script>
