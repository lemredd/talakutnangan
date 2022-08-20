<template>
	<Overlay :is-shown="isShown">
		<template #header>
			<h1>Enter the consultation details</h1>
		</template>
		<template #default>
			<form>
				<DropdownSelect
					label="Choose your reason"
					:options="reasons"
					:initial-value="chosenReason"
					@selectedOptionChanged="updateChosenReason"/>
				<p>Sample</p>
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
import { ref } from "vue"
import Overlay from "@/helpers/overlay.vue"
import DropdownSelect from "@/fields/dropwdown_select.vue"

const { isShown } = defineProps<{ isShown: boolean }>()
const reasons = [ "Grade-related", "Task-related", "Exam-related", "Others" ] as const
const chosenReason = ref<typeof reasons[number]>("Grade-related")

function chosenReason(event: Event) {
	const
}
</script>
