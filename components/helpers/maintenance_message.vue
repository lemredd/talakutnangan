<template>
	<div class="maintenance-message">
		<div class="maintenance-header">
			<i class="material-icons">
				warning
			</i>
			<h1 class="header-text">
				The site is on maintenance.
			</h1>
		</div>

		<div class="maintenance-content">
			We are currently fixing something right now. Please check back soon.
		</div>
	</div>
</template>

<style scoped lang="scss">
	@import "@styles/mixins.scss";

	.maintenance-message {
		@apply flex flex-col items-center;

		.maintenance-header {
			@apply flex flex-col items-center;
			@apply mb-4;

			i {
				@apply text-7xl text-orange-400;
			}

			.header-text {
				@apply text-true-gray-700 text-xl;
				text-align: center;
			}
		}

		.maintenance-content {
			text-align: center;
		}
	}
</style>

<script setup lang="ts"></script>
