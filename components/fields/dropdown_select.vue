<template>
	<div class="read-scope">
		<label for="read-scope">{{ label }}</label>
		<select id="read-scope" @change="$emit('selectedOptionChanged', $event)">
			<option
				value=""
				:selected="!initialValue"
				disabled>
				Select a scope
			</option>

			<option
				v-for="option in options"
				:key="option"
				:value="option"
				:selected="initialValue === option">
				{{
					isOptionString(option)
						? convertToSentenceCase(option).toLocaleLowerCase()
						: option
				}}
			</option>
		</select>
	</div>
</template>

<style>
</style>

<script setup lang="ts">
import convertToSentenceCase from "$/helpers/convert_to_sentence_case"

const {
	options,
	initialValue,
	label
} = defineProps<{
	options: any[]
	initialValue?: any
	label: string
}>()

function isOptionString(option: any): option is string {
	return typeof option === "string"
}

defineEmits<{(e: "selectedOptionChanged", event: Event): void}>()
</script>
