<template>
	<div
		class="parent-dropdown-container">
		<div
			v-if="isDropdownShown"
			class="invisible-closer"
			@click="toggleDropdown">
		</div>
		<div class="toggler">
			<a
				id="dropdown-btn"
				role="button"
				@click="toggleDropdown">
				<slot name="toggler"></slot>
			</a>
		</div>
		<div v-if="isDropdownShown" class="dropdown-container">
			<slot name="dropdown-contents"></slot>
		</div>
	</div>
</template>

<style scoped lang="scss">
@import "@styles/variables.scss";

.parent-dropdown-container {
	@apply relative px-10px h-full;
}

.invisible-closer {
	position: fixed;
	inset: 0;
	z-index: 999;
}

.dropdown-container {
	@apply dark:bg-dark-400 fixed bg-white h-full z-index-[1001];

	border-top: 1px solid #888;
	box-shadow: 0px 4px 10px rgba(0,0,0,0.5);
	inset: $navHeight 0 0 0;
}

@media screen and (min-width: $desktopViewportMinimum) {
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

const emit = defineEmits([ "toggle", "resize" ])
const props = defineProps<{
	isDropdownShown: boolean
}>()

function toggleDropdown() {
	emit("toggle")
}

onUpdated(() => {
	if (!isUndefined(window)) {
		window.onresize = () => {
			if (props.isDropdownShown) {
				emit("resize")
			}
		}
	}
})
</script>
