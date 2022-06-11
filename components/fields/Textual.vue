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
				type="button"
				v-if="editable"
				class="material-icons"
				@click="verify ? verifyBeforeSubmit() : editField($event)"
				>
				edit
			</button>
	</div>

	<Overlay v-if="isOverlayShown" @close="toggleOverlay">
		<template #header>
			<h1>Update your {{ type }}</h1>
		</template>
		<template #default>
			<div v-if="type === 'email'" class="email">
				<label for="password-confirm">
					<input type="password" placeholder="enter your password" id="password-confirm">
				</label>
				<br>
				<label for="new-email">
					<input type="email" placeholder="enter your new email" id="new-email">
				</label>
			</div>
			<div class="password"></div>
		</template>
		<template #footer>
			<button type="button">Save email</button>
		</template>
	</Overlay>
</template>

<style scoped lang="scss">
.input-container {
	display: grid;
	grid-template: repeat(2, minmax(0, 1fr)) / repeat(2, minmax(0, 1fr));
	padding: 1.5em 0;

	input {
		padding-bottom: .25em;
		width: 100%;
	}
	button.material-icons {
		justify-self: end;
	}
}


</style>

<script setup lang="ts">
import type { Textual } from "@/fields/types"
import { ref } from "vue"
import Overlay from "@/Overlay.vue"

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
const isOverlayShown = ref(false)

function emitUpdate(event: Event) {
	emit("update:modelValue", (event.target as HTMLInputElement).value)
}

function editField(e: Event) {
	inputField.value.disabled = !inputField.value.disabled
}

function verifyBeforeSubmit() {
	toggleOverlay()
}

function toggleOverlay() {
	isOverlayShown.value = !isOverlayShown.value
}
</script>
