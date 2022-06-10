<template>
	<div class="layout">
		<div v-if="!isLoggingIn" class="navigation dark:bg-dark-700">
			<div class="container">
				<a href="/" class="logo">
					<img src="./placeholder.svg" alt="logo" />
					<h1 class="ml-1">TALAKUTNANGAN</h1>
				</a>

				<Notifications v-if="!isRoleGuest"></Notifications>
				<RoleSpecificLinks :role="role"/>
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
import RoleSpecificLinks from '@/PageShell/RoleSpecificLinks.vue'
import Notifications from "@/PageShell/Notifications.vue"
import { usePageContext } from "#/usePageContext"

const pageContext = usePageContext()
const path = pageContext.urlPathname
const isLoggingIn = path === "/log_in"
const roles = ["guest", "student_or_employee", "user_manager", "admin"]
const role = roles[2]
const isRoleGuest = role === "guest"

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
		line-height: 1.8em;
		box-shadow: 0 4px 10px rgba(0,0,0,0.5);

		.container {
			display: grid;
			grid-template-columns: 1fr min-content min-content;
		}

		.logo {
			padding: .25em;
			display: flex;
			align-items: center;

			img {
				width: 48px;
				padding: .5em;
			}
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
