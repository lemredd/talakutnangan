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
				v-if="isLocked"
				type="button"
				class="edit-button material-icons"
				@click="unlock">
				edit
			</button>
			<button
				v-if="isUnlocked"
				type="button"
				class="save-button material-icons"
				@click="lock">
				save
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
import { computed } from "vue"

import type { Textual, FieldStatus } from "@/fields/types"

const props = defineProps<{
	label?: string
	type: Textual
	modelValue: string
	required?: boolean
	maySaveImplicitly?: boolean
	status?: FieldStatus
	inputClasses?: string
}>()

interface CustomEvents {
	(event: "update:modelValue", newModelValue: string): void
	(event: "update:status", status: FieldStatus): void
	(event: "save"): void
	(event: "saveImplicitly"): void
}
const emit = defineEmits<CustomEvents>()

const modelValue = computed<string>({
	"get": () => props.modelValue,
	set(newValue: string): void {
		emit("update:modelValue", newValue)
	}
})

const derivedStatus = computed<FieldStatus>(() => props.status || "enabled")
const isCurrentlyDisabled = computed<boolean>(() => {
	const status = derivedStatus.value
	return status === "disabled" || status === "locked"
})
const isLocked = computed<boolean>(() => derivedStatus.value === "locked")
const isUnlocked = computed<boolean>(() => derivedStatus.value === "unlocked")
const editable = computed<boolean>(() => isLocked.value || isUnlocked.value)

function lock() {
	if (derivedStatus.value === "unlocked") {
		emit("update:status", "locked")
		emit("save")
	}
}

function unlock() {
	if (derivedStatus.value === "locked") emit("update:status", "unlocked")
}

function saveImplicitly() {
	if (props.maySaveImplicitly) {
		emit("saveImplicitly")
	}
}
</script>
