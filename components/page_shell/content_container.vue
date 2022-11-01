<template>
	<div class="content">
		<div :class="['wrapper', { 'consultation': isAtConsultationPage }]">
			<slot></slot>
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

		.wrapper:not(.consultation) {
			margin: 0 auto;
			max-width: 900px;
		}

		&.demarginalized-top {
			.wrapper {
				max-width: initial;
			}
		}
	}
</style>

<script setup lang="ts">
import { computed, inject } from "vue"

import type { PageContext } from "$/types/renderer"

const isAtConsultationPage = computed(() => {
	const { urlPathname } = inject("pageContext") as PageContext<"deserialized">
	let condition = false

	if (urlPathname?.includes("consultation")) condition = true

	return condition
})
</script>
