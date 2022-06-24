<template>
	<div class="login-container">
		<div class="image"></div>
		<div class="login-form bg-dark-700">
			<h1>Login</h1>
			<LogInForm />
		</div>
	</div>

</template>

<style>
body {
	overflow-y: hidden;
}
</style>

<style scoped lang="scss">
.login-container {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 100vh;

	.image {
		content: '';
		position: fixed;
		inset: 0;

		background-image: url("https://unsplash.it/g/1920/1080");
		background-repeat: no-repeat;
		background-size: cover;
	}

	.login-form {
		width: 100%;
		max-width: 1200px;
		margin: 0 2em;
		padding: 1em 2em;
		z-index: 1;

		h1 {
			font-size: 2em;
			text-transform: uppercase;
		}
	}

}

@media (min-width: 768px) {
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

		.login-form {
			width: initial;
			margin: auto 0;
		}
	}
}
</style>

<script setup lang="ts">
import LogInForm from "@/LogInForm.vue"
</script>
