<template>
	<Overlay :is-shown="mustConfirm">
		<template #header>
			<h1>Enter your current password to confirm the update</h1>
		</template>
		<template #default>
			<SensitiveTextField
				v-model="value"
				label="Current password"
				placeholder="Enter your current password"/>
		</template>
		<template #footer>
			<button
				class="btn btn-back"
				type="button"
				@click="cancel">
				Cancel
			</button>
			<button
				class="confirm-btn btn btn-primary"
				type="button"
				@click="confirm">
				Update
			</button>
		</template>
	</Overlay>
</template>
<style scope lang="scss">

</style>
<script setup lang="ts">
import { computed } from "vue"

import Overlay from "@/helpers/overlay.vue"
import SensitiveTextField from "@/fields/sensitive_text.vue"

const props = defineProps<{
	mustConfirm: boolean
	modelValue: string
}>()

interface CustomEvents {
	(event: "update:modelValue", value: string): void
	(event: "confirm"): void
	(event: "cancel"): void
}
const emit = defineEmits<CustomEvents>()

const value = computed<string>({
	get(): string {
		return props.modelValue
	},
	set(newValue: string): void {
		emit("update:modelValue", newValue)
	}
})

function confirm() {
	emit("confirm")
}

function cancel() {
	emit("cancel")
}
</script>
