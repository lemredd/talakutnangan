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
@import "@styles/error.scss";
</style>

<script setup lang="ts">

const props = defineProps<{
	receivedErrors: string[]
}>()

</script>
