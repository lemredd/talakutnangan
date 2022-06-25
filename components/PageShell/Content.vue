<template>
<div class="content" :class="{ 'login-content': isLoggingIn }">
	<div class="container">
		<slot />
	</div>
</div>
</template>

<style scoped lang="scss">
@import "@styles/variables.scss";

.content {
		margin-top: $nav-height;
		padding: 20px;
		min-height: calc(100vh - $nav-height);

		&.login-content {
			margin-top: 0;
			padding: 0;
			.container {
				max-width: none;
			}

			footer {
				display: none;
			}
		}
	}
</style>

<script setup lang="ts">
import { inject } from "vue"
const isLoggingIn = inject("isLoggingIn") as boolean
</script>
