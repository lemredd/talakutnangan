<!--
	General tasks for other members:
	TODO(others): Refactor all WindiCSS inline classes using @apply directive
	TODO(others): Refactor HTML to Vue Components if applicable
	TODO(others): Make use of mixins if applicable
-->
<template>
	<div class="consultations-container">
		<section class="consultations-picker relative">
			<slot name="list"></slot>
		</section>

		<slot name="chat-window"></slot>
	</div>
</template>

<style scoped lang="scss">
@import "@styles/variables.scss";
@import "@styles/mixins.scss";

.add {
	@apply material-icons absolute bottom-5 right-5 text-lg rounded-full border border-gray-600 p-3
}

.consultations-container, .consultations-list-header {
	@apply flex;
}

.consultation {
	@apply
		p-2
		grid grid-rows-2 grid-cols-[repeat(2,minmax(0,max-content))]
		justify-between
		hover:bg-gray-300;
}

.selected-consultation-header {
	@apply
		border-b
		p-3
		grid grid-rows-2 grid-cols-[repeat(2,minmax(0,max-content))]
		justify-between;
}

.consultations-container {
	section {
		@include useContentBaseHeight;
	}
}

@screen md {
	.expand-or-collapse {
		display: inline !important;
	}
}
</style>

<script setup lang="ts">
</script>
