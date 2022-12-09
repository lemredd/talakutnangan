<template>
	<div class="login-container">
		<div class="image"></div>
		<LogInForm :received-error-from-page-context="receivedError"/>
	</div>
</template>

<style>
body {
	overflow-y: hidden;
}
</style>

<style scoped lang="scss">
	@import "@styles/variables.scss";

	.login-container {
		@apply flex items-center justify-center;
		height: 100vh;

		.image {
			$imageURL: url("/api/user/log_in/image");
			$redTint: hue-rotate(300deg);

			content: '';
			position: fixed;
			inset: 0;

			background-image: $imageURL;
			background-repeat: no-repeat;
			background-size: cover;
			filter:
				sepia(100%)
				saturate(100%)
				brightness(80%)
				$redTint;
		}
	}

	@media (min-width: $mobileViewportMaximum) {
		.login-container {
			display: grid;
			align-items: initial;
			justify-content: initial;
			height: 100vh;
			grid-template-columns: 2fr 400px;
			.image {
				position: initial;
				width: 100%;
			}
		}
	}
</style>

<script setup lang="ts">
import { inject } from "vue"

import type { PageContext } from "$/types/renderer"

import LogInForm from "@/authentication/log_in_form.vue"

const pageContext = inject("pageContext") as PageContext<"deserialized">
const receivedError = pageContext.pageProps.parsedUnitError
</script>
