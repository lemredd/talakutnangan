<template>
	<ul class="status-messages success">
		<li
			v-for="successMessage in receivedSuccessMessages"
			:key="receivedSuccessMessages.indexOf(successMessage)">
			{{ successMessage }}
		</li>
	</ul>
</template>

<style scoped lang="scss">
@import "@styles/status_messages.scss";
</style>

<script setup lang="ts">
defineProps<{
	receivedSuccessMessages: string[]
}>()
</script>
