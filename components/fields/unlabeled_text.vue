<template>
	<div class="field-container">
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
		<button
			v-if="isUnlocked"
			type="button"
			class="cancel-button material-icons"
			@click="load">
			cancel
		</button>
	</div>
</template>
<style scoped lang="scss">
	.field-container {
		@apply flex flex-row justify-center justify-items-stretch items-center;

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
</style>
<script setup lang="ts">
import { computed } from "vue"

import type { Textual, FieldStatus } from "@/fields/types"

const props = defineProps<{
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
	const disabledStatuses: FieldStatus[] = [ "disabled", "locked", "processing", "loaded" ]
	return disabledStatuses.includes(status)
})
const isLocked = computed<boolean>(() => {
	const status = derivedStatus.value
	const lockedStatuses: FieldStatus[] = [ "locked", "loaded" ]
	return lockedStatuses.includes(status)
})
const isUnlocked = computed<boolean>(() => {
	const status = derivedStatus.value
	const unlockedStatuses: FieldStatus[] = [ "unlocked", "prepared" ]
	return unlockedStatuses.includes(status)
})

function lock() {
	switch (derivedStatus.value) {
		case "unlocked":
			emit("update:status", "locked")
			emit("save")
			break
		case "prepared":
			emit("update:status", "processing")
			emit("save")
			break
		default:
			break
	}
}

function unlock() {
	switch (derivedStatus.value) {
		case "locked":
			emit("update:status", "unlocked")
			break
		case "loaded":
			emit("update:status", "prepared")
			break
		default:
			break
	}
}

function load() {
	switch (derivedStatus.value) {
		case "prepared":
			emit("update:status", "loaded")
			break
		default:
			break
	}
}

function saveImplicitly() {
	if (props.maySaveImplicitly) {
		emit("saveImplicitly")
	}
}
</script>
