<template>
	<div class="layout" ref="layout">
		<div v-if="!isLoggingIn" class="navigation dark:bg-dark-700">
			<div class="container">
				<a href="/" class="logo">
					<img src="@assets/logo_navbar.svg" alt="logo" />
					<h1 class="ml-1">TALAKUTNANGAN</h1>
				</a>

				<Dropdown purpose="notifications" v-if="!isRoleGuest">
					<template #toggler>
						<span class="material-icons">notifications</span>
					</template>
					<template #default>
						<ul class="notification-items">
							<a href="">
								<li class="notification-item" v-for="notification in notifications" :key="notification.id">
									<div :class="`icon ${notification.type} dark:bg-light-800`">
										<span class="material-icons">{{ notification.icon }}</span>
									</div>
									<h3 class="title">{{ notification.description }}</h3>
									<small class="date">{{ notification.dateOccured }}</small>
								</li>
							</a>

							<li class="notification-footer">
								<a href="/notifications">View All</a>
							</li>
						</ul>
					</template>
				</Dropdown>
				<RoleSpecificLinks :role="role"/>
				<Dropdown purpose="user-settings" v-if="!isRoleGuest">
				<template #toggler>
					<span class="material-icons">account_circle</span>
				</template>
				<template #default>
					<ul class="settings-items">
							<a href="">
								Account Settings
							</a>
							<a href="">
								Profile Settings
							</a>
							<a href="">
								Logout
							</a>
					</ul>
				</template>
				</Dropdown>
			</div>

		</div>
		<div class="content" :class="{ 'login-content': isLoggingIn }">
			<div class="container">
				<slot />
			</div>
		</div>
		<Footer></Footer>
	</div>
</template>

<script lang="ts" setup>
import { onMounted, provide, ref, watch } from "vue"
import RoleSpecificLinks from '@/PageShell/RoleSpecificLinks.vue'
import Dropdown from '@/Dropdown.vue'
import { usePageContext } from "#/usePageContext"
import Footer from "@/Footer.vue"
const pageContext = usePageContext()
const path = pageContext.urlPathname
const isLoggingIn = path === "/log_in"
const roles = ["guest", "student_or_employee", "user_manager", "admin"]
const role = roles[2]
const isRoleGuest = role === "guest"

const layout = ref<HTMLElement | null>(null)
const body = ref<HTMLBodyElement | null>(null)
const bodyClasses = ref<string[]>([])
onMounted(function() {
	if (layout.value) {
		// ! Risky
		body.value = layout.value.parentElement!.parentElement as HTMLBodyElement
	}
})
watch(bodyClasses, newSource => {
	body.value!.classList.remove(...body.value!.classList.values())
	body.value!.classList.add(...newSource)
})
provide("pageContext", pageContext)
provide("bodyClasses", bodyClasses)

const notifications = [
	{
		id: 0,
		description: "lorem ipsum",
		type: "general",
		icon: "notifications",
		dateOccured: new Date(2022, 2, 3).toDateString()
	},
	// {
	// 	id: 0,
	// 	description: "lorem ipsum",
	// 	type: "general",
	// 	icon: "notifications",
	// 	dateOccured: new Date(2022, 2, 3).toDateString()
	// },
	// {
	// 	id: 0,
	// 	description: "lorem ipsum",
	// 	type: "general",
	// 	icon: "notifications",
	// 	dateOccured: new Date(2022, 2, 3).toDateString()
	// }
]
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

<style lang="scss">
.layout {
	display: flex;
	flex-direction: column;

	.navigation {
		position: fixed;
		left: 0; right: 0;
		padding: 0 .75em;
		flex-shrink: 0;
		line-height: 1.8em;
		box-shadow: 0 4px 10px rgba(0,0,0,0.5);
		z-index: 1;

		.container {
			display: grid;
			grid-template-columns: 1fr repeat(3, min-content);
		}

		.logo {
			padding: .25em;
			display: flex;
			align-items: center;
			width: max-content;

			img {
				width: 48px;
				padding: .5em;

			}
		}
	}

	.content {
		margin-top: 56px;
		padding: 20px;
		min-height: calc(100vh - 56px);

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
}

.container {
	max-width: 900px;
	margin: auto;
}

.notifications, .user-settings {
	display: none;
}
@media screen and (min-width: 640px) {
	.user-settings {
		display: initial;

		height: 30px;
		padding: 3px 10px;
		align-self: center;
		position: relative;

		.dropdown-container {
			position: absolute;
			top: 56px;
			right: 0;
			width: max-content;

			.settings-items {
				display: flex;
				flex-direction: column;
			}
		}
	}
	.notifications {
		display: initial;
		height: 30px;
	padding: 3px 10px;
	align-self: center;
	position: relative;

		.dropdown-container {
			position: absolute;
			top: 56px;
			left: -50%;

				.notification-items {
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					.notification-item {
						padding: .5em 1em;
						display: grid;
						grid-template:
							"icon title"
							"icon date";
						.icon {
						border-radius: 50%;
						height: min-content;
						align-self: center;
						grid-area: icon;

							span {
								font-size: 32px;
							}
						}

						.title { grid-area: title; }
						.date { grid-area: date; }
					}
					.notification-footer {
						text-align: center;
					}
				}
		}
	}
}
</style>
