<template>
	<div class="invisible-closer" @click="emitClose"></div>
	<div class="dropdown-container dark:bg-dark-400">
		<slot></slot>
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
const isDropdownShown = ref(false)

const emit = defineEmits(["close"])

function emitClose() {
	emit("close")
}
</script>
