<template>
<div class="content" :class="{ 'login-content': isLoggingIn }">
	<div class="container">
		<slot />
	</div>
</div>
</template>

<style scoped lang="scss">
@import "@styles/variables.scss";
@import "@styles/mixins.scss";

.content {
	@include useContentBaseHeight;
	margin-top: $navHeight;
	padding: 20px;

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
