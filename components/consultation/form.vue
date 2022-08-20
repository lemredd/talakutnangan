<template>
	<Overlay :is-shown="isShown">
		<template #header>
			<h1>Enter the consultation details</h1>
		</template>
		<template #default>
			<form>
				<SelectableOptions
					v-model="chosenReason"
					label="Kind of Reason: "
					placeholder="Choose your reason"
					:options="reasons"/>
				<Textual
					v-if="hasChosenOtherReason"
					v-model="otherReason"
					label="What are the other reasons(s)?"
					type="text"/>
			</form>
		</template>
		<template #footer>
			<button type="button">
				Set the schedule
			</button>
		</template>
	</Overlay>
</template>

<style lang="scss">

</style>

<script setup lang="ts">
import { ref, computed } from "vue"
import Overlay from "@/helpers/overlay.vue"
import SelectableOptions from "@/fields/selectable_options.vue"
import Textual from "@/fields/textual.vue"

const { isShown } = defineProps<{ isShown: boolean }>()

const reasons = [ "Grade-related", "Task-related", "Exam-related", "Others" ] as const
const chosenReason = ref<typeof reasons[number]>("Grade-related")
const hasChosenOtherReason = computed<boolean>(() => chosenReason.value === "Others")
const otherReason = ref<string>("")
const reason = computed<string>(() => {
	if (hasChosenOtherReason.value) return otherReason.value
	return chosenReason.value
})
</script>
