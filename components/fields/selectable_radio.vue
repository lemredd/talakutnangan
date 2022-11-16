<template>
	<div class="selectable-radio">
		<h6 class="title">
			{{ title }}
		</h6>
		<div>
			<label
				v-for="option in options"
				:key="option.value"
				:for="`label_${option.label ?? option.value}`">
				<input
					:id="`label_${option.label ?? option.value}`"
					v-model="value"
					:value="option.value"
					type="radio"/>
				{{ option.label ?? option.value }}
			</label>
		</div>
	</div>
</template>

<style scoped lang="scss">
	.selectable-radio {
		@apply flex flex-col flex-nowrap md:flex-row justify-start items-start;

		div {
			@apply flex-1 flex flex-col justify-start items-start;
		}

		@screen md {
			div {
				@apply flex-row;
			}
		}

		label {
			@apply ml-4;
		}
	}
</style>

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

const value = computed({
	get() {
		return props.modelValue
	},
	set(newValue: string): void {
		emit("update:modelValue", newValue)
	}
})
</script>
