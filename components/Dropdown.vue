<template>
	<div :class="purpose">
		<div class="invisible-closer" v-if="isDropdownShown" @click="toggleDropdown"></div>
		<div class="toggler">
			<a id="dropdown-btn" role="button" @click="toggleDropdown">
				<slot name="toggler"></slot>
			</a>
		</div>
		<div class="dropdown-container dark:bg-dark-400" v-if="isDropdownShown">
			<slot></slot>
		</div>
	</div>
</template>

<style scoped lang="scss">
.invisible-closer {
	position: fixed;
	inset: 0;
}
.dropdown-container {
	border-top: 1px solid #888;
	box-shadow: 4px 4px 10px rgba(0,0,0,0.5);
}
</style>

<script setup lang="ts">
import { ref } from "vue"

const { purpose } = defineProps<{
	purpose: string
}>()
const emit = defineEmits(["close"])
const isDropdownShown = ref(false)

function emitClose() {
	emit("close")
}

function toggleDropdown() {
	isDropdownShown.value = !isDropdownShown.value
}
</script>
