<template>
<div class="content" :class="{ 'login-content': isLoggingIn }">
	<div class="container">
		<slot />
	</div>
</div>
</template>

<style>
</style>

<script setup lang="ts">
import { inject } from "vue"
const isLoggingIn = inject("isLoggingIn") as boolean
</script>
