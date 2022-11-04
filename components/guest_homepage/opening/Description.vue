<template>
	<div class="description">
		<div class="description-header">
			<slot name="header"></slot>
		</div>
		<div class="description-details">
			<slot name="details"></slot>
		</div>
	</div>
</template>

<style scoped>

.description-header {
	@apply text-2xl;
}
.description-details {
	@apply text-sm;
}

</style>

<script setup lang="ts">
</script>
