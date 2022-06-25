<template>
	<div :class="{ 'default': !editable }" class="input-container">
		<label v-if="label" class="input-header">
			{{ label }}
		</label>
		<input
			class="bg-transparent"
			:class=inputClasses
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
			<div v-if="type === 'email' || type === 'password'" class="verification">
				<label for="password-confirm" class="text-black">
					<input type="password" placeholder="enter your password" id="password-confirm">
				</label>
				<label :for="`new-${type}`">
					<input :type="type" :placeholder="`enter your new ${type}`" :id="`new-${type}`">
				</label>
			</div>
			<div class="password"></div>
		</template>
		<template #footer>
			<button type="button">Save {{ type }}</button>
		</template>
	</Overlay>
</template>

<style scoped lang="scss">
.input-container {
	@apply grid gap-4 grid-cols-2 grid-rows-2;

	label {
		@apply col-span-full;
	}

	&.default {
		display: block;
	}

	input {
		border: 1px solid #444;
		padding-bottom: .25em;
		width: 100%;
	}
	.material-icons {
		@apply justify-self-end;
	}
}

.verification {
	@apply flex flex-col;

	label {
		padding: .5em 1em;

		input {
			padding: .25em .5em;
		}
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
	verify,
	inputClasses
	} = defineProps<{
	label?: string
	type: Textual
	modelValue: string
	required?: boolean
	disabled?: boolean
	editable?: boolean
	verify?: boolean
	inputClasses?: string
}>()
const emit = defineEmits<{
	(e: "update:modelValue", modelValue: string ): void
}>()

const inputField = ref<HTMLInputElement | null>(null)
const isOverlayShown = ref(false)

function emitUpdate(event: Event) {
	emit("update:modelValue", (event.target as HTMLInputElement).value)
}

function editField(e: Event) {
	inputField.value!.disabled = !inputField.value!.disabled
}

function verifyBeforeSubmit() {
	toggleOverlay()
}

function toggleOverlay() {
	isOverlayShown.value = !isOverlayShown.value
}
</script>
