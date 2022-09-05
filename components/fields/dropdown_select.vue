<template>
	<div class="read-scope">
		<label for="read-scope">{{ label }}</label>
		<select id="read-scope" @change="$emit('selectedOptionChanged', $event)">
			<option
				v-if="hasDisabledValue"
				value=""
				:selected="!initialValue"
				disabled>
				Select a value
			</option>

			<option
				v-for="option in options"
				:key="option"
				:value="option"
				:selected="initialValue === option">
				{{
					isOptionString(option)
						? convertForSentence(option).toLocaleLowerCase()
						: option
				}}
			</option>
		</select>
	</div>
</template>

<style scoped lang="scss">
</style>

<script setup lang="ts">
import convertForSentence from "$/string/convert_for_sentence"

const {
	options,
	initialValue,
	label
} = defineProps<{
	options: any[],
	hasDisabledValue?: boolean
	initialValue?: any
	label?: string
}>()

function isOptionString(option: any): option is string {
	return typeof option === "string"
}

defineEmits<{(e: "selectedOptionChanged", event: Event): void}>()
</script>
