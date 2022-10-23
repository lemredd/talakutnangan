<template>
	<IconButton
		class="container"
		icon-name="more_vert"
		@blur="close"
		@icon-click="open">
		<template #associated-pop-outs>
			<div v-if="modelValue" class="overlay"></div>
			<div v-if="modelValue" class="dropdown-container">
				<slot name="dropdown-contents"></slot>
			</div>
		</template>
	</IconButton>
</template>

<style scoped lang="scss">
	@import "@styles/variables.scss";

	.container {
		@apply flex-col relative;

		.overlay {
			@apply dark:bg-white fixed bg-dark-400 z-500 opacity-60 block;
			inset: $navHeight 0 0 0;

			content: " "
		}

		.dropdown-container {
			@apply dark:bg-dark-400 fixed bg-white h-full z-501;
			@apply flex flex-col flex-nowrap;

			inset: calc($navHeight + 60%) 0 0 0;
		}
	}

	@screen md {
		.container {
			.overlay { display: none }

			.dropdown-container {
				@apply absolute dark:bg-dark-400 bg-gray-100 h-max w-max py-1 px-2;

				inset: unset;
				transform: translatex(-50%) translateY(125%);
			}
		}
	}
</style>

<script setup lang="ts">
import isUndefined from "$/type_guards/is_undefined"
import { onUpdated } from "vue"

import IconButton from "@/helpers/icon_button.vue"

interface CustomEvents {
	(event: "update:modelValue", isShown: boolean): void
}
const emit = defineEmits<CustomEvents>()
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
