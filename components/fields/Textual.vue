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
			<button
				v-if="editable"
				class="material-icons"
				@click="verify ? verifyBeforeSubmit() : editField($event)"
				>
				edit
			</button>
	</div>

	<div class="overlay">
		<div class="content bg-white text-black">
			<header>Header</header>
			<main>
				123
				456
			</main>
		</div>
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

.overlay {
	position:fixed;
	inset: 0;
	height: 100vh;
	width: 100%;

	background-color: rgba(0,0,0,0.3);

	.content {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		padding: 1em;
		width: max-content;
		height: max-content;
	}
}
</style>

<script setup lang="ts">
import type { Textual } from "@/fields/types"
import { ref } from "vue"

const {
	label,
	type,
	modelValue,
	required = true,
	disabled,
	editable,
	verify
	} = defineProps<{
	label: string
	type: Textual
	modelValue: string
	required?: boolean
	disabled?: boolean
	editable?: boolean
	verify?: boolean
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

function verifyBeforeSubmit() {
	console.log(verify)
}
</script>
