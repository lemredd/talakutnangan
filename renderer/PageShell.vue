<template>
	<div class="layout">
		<div v-if="!isLoggingIn" class="navigation dark:bg-dark-700">
			<div class="container">
				<a href="/" class="logo">
					<img src="./placeholder.svg" class="w-[48px]" alt="logo" />
					<h1 class="ml-1">TALAKUTNANGAN</h1>
				</a>
				<div class="links">
					<Link href="/log_in">
						<span class="material-icons">account_circle</span>
					</Link>
				</div>
			</div>

		</div>
		<div class="content dark:">
			<div class="container">
				<slot />
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import Link from './Link.vue'
import { usePageContext } from "#/usePageContext"

const pageContext = usePageContext()
const path = pageContext.urlPathname
const isLoggingIn = path === "/log_in"
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
		box-shadow: 0 4px 10px rgba(0,0,0,0.5);

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
