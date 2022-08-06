<template>
	<div class="read-scope">
		<label for="read-scope">{{ label }}</label>
		<select id="read-scope" @change="$emit('selectedOptionChanged', $event)">
			<option value="" selected disabled>Select a scope</option>
			<option
				v-for="option in options" :value="option">
					{{
						isOptionString(option)
						? camelToSentence(option).toLocaleLowerCase()
						: option
					}}
			</option>
		</select>
	</div>
</template>

<style>
</style>

<script setup lang="ts">
import camelToSentence from "$@/helpers/camel_to_sentence"

const {
	options,
	label
} = defineProps<{
	options: any[]
	label: string
}>()

function isOptionString(option: any): option is string {
	return typeof option === "string"
}

defineEmits<{
	(e: "selectedOptionChanged", event: Event): void
}>()
</script>
