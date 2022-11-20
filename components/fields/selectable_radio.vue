<template>
	<div class="selectable-radio">
		<h6 class="title">
			{{ title }}
		</h6>
		<div class="options">
			<label
				v-for="option in options"
				:key="option.value"
				:for="`label_${option.label ?? option.value}`">
				<input
					:id="`label_${option.label ?? option.value}`"
					v-model="value"
					:value="option.value"
					type="radio"/>
				<span>{{ option.label ?? option.value }}</span>
			</label>
		</div>
	</div>
</template>

<style scoped lang="scss">
	.selectable-radio {
		@apply flex flex-col flex-nowrap sm:flex-row justify-start items-start;

		.options {
			@apply flex-1 flex flex-col md:flex-row justify-start items-start;
		}

		label {
			@apply mr-4;
			@apply flex flex-row flex-nowrap;

			> * { @apply flex-none; }
			span { @apply ml-1; }
		}

		@screen md {
			.title {
				@apply mr-4;
			}
		}
	}
</style>

<script setup lang="ts">
import { computed } from "vue"

import type { OptionInfo } from "$@/types/component"

type ComponentProps = {
	label?: string,
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
