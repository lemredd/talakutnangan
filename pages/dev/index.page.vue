<template>
	<div class="secret-page-container">
		<header class="secret-page-header">
			<img src="@assets/logo_navbar.svg" class="logo"/>
			<h1>This is a secret page.</h1>
		</header>
		<ul class="contributors">
			<h3>
				<span>❤️🖤💚🧡</span>
				<span>Contributors</span>
				<span>🧡💚🖤❤️</span>
			</h3>
			<li>Angelo Magtoto</li>
			<li>Ardrin Gregorio</li>
			<li>Jarlem Red De Peralta</li>
			<li>John Jerome Pertez</li>
			<li>Kenneth Trecy Tobias</li>
		</ul>
		<p class="description">
			This page serves as a countermeasure for plagiarism
			if ever this project is cloned without permission.
		</p>
	</div>
</template>

<style scoped lang="scss">
	.secret-page-container {
		@apply flex flex-col items-center;

		.secret-page-header {
			@apply flex flex-col items-center;
			.logo {
				@apply max-w-36;
			}

			h1 {
				@apply my-4;
				@apply text-xl;
			}
		}

		.contributors {
			@apply flex flex-col items-center;
			h3 {
				@apply flex flex-col mb-4;

				@screen sm {
					@apply flex-row mb-0;
				}
			}

			li {
				@apply text-center;
			}
		}

		.description {
			@apply my-4;
			@apply text-center;
		}
	}
</style>

<script setup lang="ts"></script>
