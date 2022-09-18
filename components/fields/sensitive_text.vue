<template>
	<div :class="{ 'default': !(props.editable ?? false) }" class="input-container">
		<label v-if="label" class="input-header">
			<h2>{{ props.label }}</h2>
		</label>
		<div class="input-and-controls">
			<input
				v-model="modelValue"
				class="bg-transparent"
				:class="props.inputClasses ?? []"
				type="password"
				:placeholder="props.placeholder ?? ''"
				:required="props.required"
				:disabled="props.editable ?? false"/>
			<button
				v-if="props.editable ?? false"
				type="button"
				class="material-icons"
				@click="requestForEdit">
				edit
			</button>
		</div>
		<slot name="hidden-dialog"></slot>
	</div>
</template>

<style scoped lang="scss">
.input-container {
	@apply flex flex-col;

	label {
		margin-bottom: .5em;

		h2 {
			font-size: 1.5em;
		}
	}

	&.default {
		display: block;
	}

	.input-and-controls {
		@apply flex items-center;

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
}
</style>
<script setup lang="ts">
import { computed } from "vue"

const props = defineProps<{
	label?: string,
	modelValue: string,
	placeholder?: string,
	required?: boolean,
	editable?: boolean,
	inputClasses?: string[]
}>()

interface CustomEvents {
	(event: "requestEdit"): void,
	(event: "update:modelValue", newModelValue: string): void
}
const emit = defineEmits<CustomEvents>()

const modelValue = computed<string>({
	"get": () => props.modelValue,
	set(newValue: string): void {
		emit("update:modelValue", newValue)
	}
})

function requestForEdit() {
	emit("requestEdit")
}
</script>
