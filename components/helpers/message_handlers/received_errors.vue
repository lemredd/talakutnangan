<template>
	<ul class="error">
		<h3>The following errors have occured:</h3>
		<li
			v-for="error in receivedErrors"
			:key="receivedErrors.indexOf(error)">
			{{ error }}
		</li>
	</ul>
</template>

<style scoped lang="scss">
@import "@styles/status_messages.scss";
</style>

<script setup lang="ts">

defineProps<{
	receivedErrors: string[]
}>()

</script>
