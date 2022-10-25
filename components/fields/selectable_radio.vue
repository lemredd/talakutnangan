<template>
	<div class="selectable-radio">
		{{ title }}
		<label
			v-for="option in options"
			:key="option.value"
			for="exists">
			<input
				:id="option.label"
				v-model="value"
				:value="option.value"
				type="radio"/>
			{{ option.label ?? option.value }}
		</label>
	</div>
</template>

<script setup lang="ts">
import { computed } from "vue"

import type { OptionInfo } from "$@/types/component"

type ComponentProps = {
	title: string,
	modelValue: string,
	options: OptionInfo[]
}

const props = defineProps<ComponentProps>()

const emit = defineEmits<{(e: "update:modelValue", value: string): void}>()

const selectID = computed(() => props.options.map(info => info.value).join(" ").replace(" ", "_"))
const value = computed({
	get() {
		return props.modelValue
	},
	set(newValue: string): void {
		emit("update:modelValue", newValue)
	}
})
</script>
