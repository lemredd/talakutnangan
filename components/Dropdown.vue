<template>
	<div class="dropdown-container dark:bg-dark-400">
		<slot></slot>
	</div>
</template>

<style scoped lang="scss">
.dropdown-container {
	position: absolute;
	box-shadow: 4px 4px 10px rgba(0,0,0,0.5);
	width: max-content;
	border-radius: 5px;
}
</style>

<script setup lang="ts">


</script>
