<template>
	<section class="container" @focusout="close">
		<button class="material-icons" @click="open">
			more_vert
		</button>
		<div v-if="modelValue" class="overlay"></div>
		<div v-if="modelValue" class="dropdown-container">
			<slot name="dropdown-contents"></slot>
		</div>
	</section>
</template>

<style scoped lang="scss">
	@import "@styles/variables.scss";

	.container {
		@apply flex flex-row flex-nowrap justify-center align-middle relative;

		> button:first {
			@apply flex-1;
		}

		> .overlay {
			@apply  dark:bg-white fixed bg-dark-400 z-500 opacity-60 block;
			inset: $navHeight 0 0 0;

			content: " "
		}

		> .dropdown-container {
			@apply dark:bg-dark-400 fixed bg-white h-full z-501 flex;

			inset: calc($navHeight + 60%) 0 0 0;
		}
	}

	@screen md {
		.container {
			> .overlay { display: none }

			> .dropdown-container {
				@apply absolute dark:bg-dark-400 bg-white h-max w-max p-1;

				inset: unset;
				transform: translatex(-50%) translateY(125%);
			}
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
