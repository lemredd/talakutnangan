<template>
	<div :class="purpose">
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
			<slot></slot>
		</div>
	</div>
</template>

<style scoped lang="scss">
@import "@styles/variables.scss";

.invisible-closer {
	position: fixed;
	inset: 0;
	z-index: 1000;
}
.dropdown-container {
	@apply dark:bg-dark-400;

	background-color: white;
	border-top: 1px solid #888;
	box-shadow: 0px 4px 10px rgba(0,0,0,0.5);
	z-index: 1001;
}
</style>

<script setup lang="ts">
import { onUpdated, ref } from "vue"

const { purpose } = defineProps<{
	purpose: string
}>()
const emit = defineEmits([ "toggle", "resize" ])
const isDropdownShown = ref(false)

function toggleDropdown() {
	emit("toggle")
	isDropdownShown.value = !isDropdownShown.value
}

onUpdated(() => {
	if (typeof window !== "undefined") {
		window.onresize = () => {
			if (isDropdownShown.value) {
				emit("resize")
				isDropdownShown.value = false
			}
		}
	}
})
</script>
