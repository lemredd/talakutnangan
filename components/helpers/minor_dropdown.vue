<template>
	<div class="container" @blur="close">
		<button class="material-icons" @click="open">
			more_vert
		</button>
		<div v-if="modelValue" class="dropdown-container">
			<slot name="dropdown-contents"></slot>
		</div>
	</div>
</template>

<style scoped lang="scss">
	@import "@styles/variables.scss";

	.container {
		@apply flex flex-row flex-nowrap justify-center align-middle;

		> button:first {
			@apply flex-1;
		}

		> .dropdown-container {
			@apply dark:bg-dark-400 fixed bg-white h-full z-index-[1001];

			border-top: 1px solid #888;
			box-shadow: 0px 4px 10px rgba(0,0,0,0.5);
			inset: $navHeight 0 0 0;
		}
	}

	@screen md {
		.dropdown-container {
			@apply absolute bg-white h-max w-max;

			top: $navHeight;
			transform: translateX(-50%);
		}
	}
</style>

<script setup lang="ts">
import isUndefined from "$/type_guards/is_undefined"
import { onUpdated } from "vue"

const emit = defineEmits<{
	(event: "update:modelValue", isShown: boolean): void
}>()
const props = defineProps<{
	modelValue: boolean
}>()

function open() {
	emit("update:modelValue", true)
}

function close() {
	emit("update:modelValue", false)
}

onUpdated(() => {
	if (!isUndefined(window)) {
		window.onresize = () => {
			if (props.modelValue) close()
		}
	}
})
</script>
