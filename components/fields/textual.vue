<template>
	<div :class="{ 'default': !editable }" class="input-container">
		<label v-if="label" class="input-header">
			<h2>{{ label }}</h2>
		</label>
		<div class="input-and-controls">
			<input
				ref="inputField"
				class="bg-transparent"
				:class="inputClasses"
				:type="type"
				:value="modelValue"
				:required="required"
				:disabled="disabled || editable"
				@input="emitUpdate"/>
			<button
				v-if="editable"
				type="button"
				class="material-icons"
				@click="verify ? verifyBeforeSubmit() : editField()">
				edit
			</button>
		</div>
	</div>

	<Overlay :is-shown="isOverlayShown" @close="toggleOverlay">
		<template #header>
			<h1>Update your {{ type }}</h1>
		</template>
		<template #default>
			<div v-if="type === 'email' || type === 'password'" class="verification">
				<label for="password-confirm" class="text-black">
					<input
						id="password-confirm"
						type="password"
						placeholder="enter your password"/>
				</label>
				<label :for="`new-${type}`">
					<input
						:id="`new-${type}`"
						:type="type"
						:placeholder="`enter your new ${type}`"/>
				</label>
			</div>
			<div class="password"></div>
		</template>
		<template #footer>
			<button type="button">
				Save {{ type }}
			</button>
		</template>
	</Overlay>
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
import { ref } from "vue"
import type { Textual as BaseTextual } from "@/fields/types"
import Overlay from "@/helpers/overlay.vue"

type Textual = BaseTextual | "password"

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
const emit = defineEmits<{(e: "update:modelValue", newModelValue: string): void}>()

const inputField = ref<HTMLInputElement | null>(null)
const isOverlayShown = ref(false)

function emitUpdate(event: Event) {
	const castTarget = event.target as HTMLInputElement
	emit("update:modelValue", castTarget.value)
}

function editField() {
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	inputField.value!.disabled = !inputField.value?.disabled
}

function verifyBeforeSubmit() {
	toggleOverlay()
}

function toggleOverlay() {
	isOverlayShown.value = !isOverlayShown.value
}
</script>
