<template>
	<h1>
		<slot name="header"></slot>
	</h1>
	<p>
		<slot name="details"></slot>
	</p>
</template>

<style scoped>
h1 {
	padding: 1.25em;
	font-size: 1.5em;
}

p {
	padding: 0 1.25em;
	font-size: .75em;
}
</style>

<script setup lang="ts">
</script>
