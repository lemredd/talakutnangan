<template>
	<div class="layout">
		<div class="navigation">
			<div class="container">
				<a href="/" class="logo">
					<img src="./placeholder.svg" height="64" width="64" alt="logo" />
					<h1 class="ml-1">TALAKUTNANGAN</h1>
				</a>
				<div class="links">
					<Link href="/log_in">
						<span class="material-icons">account_circle</span>
					</Link>
				</div>
			</div>

		</div>
		<div class="content">
			<div class="container">
				<slot />
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import Link from './Link.vue'
</script>

<style>
@import 'material-icons/iconfont/material-icons.css';

body {
	margin: 0;
	font-family: sans-serif;
}
*, *::before, *::after {
	box-sizing: border-box;
}
a {
	text-decoration: none;
}
</style>

<style scoped lang="scss">
.layout {
	display: flex;
	flex-direction: column;

	.navigation {
		padding: 0 .75em;
		flex-shrink: 0;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		line-height: 1.8em;

		.container {
			display: flex;
			align-items: center;
			justify-content: space-between;
		}

		.logo {
			padding: .25em;
			display: flex;
			align-items: center;
		}

		.links {
			height: 72px;
			display: flex;
			align-items: center;
		}
	}

	.content {
		padding: 20px;
		padding-bottom: 50px;
		min-height: 100vh;
	}
}

.container {
	max-width: 900px;
	margin: auto;
}
</style>
