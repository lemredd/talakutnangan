<template>
	<ul class="error">
		<h3>The following errors have occured:</h3>
		<li
			v-for="successMessage in receivedSuccessMessages"
			:key="receivedSuccessMessages.indexOf(successMessage)">
			{{ successMessage }}
		</li>
	</ul>
</template>

<style scoped lang="scss">
@import "@styles/error.scss";
</style>

<script setup lang="ts">
defineProps<{
	receivedSuccessMessages: string[]
}>()
</script>
