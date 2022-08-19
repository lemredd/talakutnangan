<template>
	<div v-if="!isLoggingIn" class="navigation">
		<div class="container">
			<a href="/" class="logo">
				<img src="@assets/logo_navbar.svg" alt="logo"/>
				<h1 class="ml-1">TALAKUTNANGAN</h1>
			</a>

			<Dropdown purpose="notifications" v-if="!isRoleGuest">
				<template #toggler>
					<span class="material-icons">notifications</span>
				</template>
				<template #default>
					<ul class="notification-items">
						<a href="">
							<li
								v-for="notification in notifications"
								:key="notification.id"
								class="notification-item">
								<div :class="`icon ${notification.type}`">
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
			<Dropdown v-if="!isRoleGuest" purpose="user-settings">
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
						<a role="button" @click="logOut">
							Logout
						</a>
					</ul>
				</template>
			</Dropdown>
		</div>
	</div>
</template>

<style lang="scss">
@import "@styles/variables.scss";

.navigation {
	@apply dark:bg-dark-700 flex justify-center;
	position: fixed;
	left: 0; right: 0;
	z-index: 1;
	background-color: white;

	padding: 0 .75em;
	border-bottom: 1px solid hsla(0,0%,0%, 0.1);
	height: $navHeight;

	.container {
		@apply grid grid-cols-[1fr,repeat(3,min-content)];
	}

	.logo {
		@apply flex items-center;

		padding: .25em;
		width: max-content;

		img {
			width: 48px;
			padding: .5em;
		}
	}
}

.notifications, .user-settings {
	display: none;
}

@media screen and (min-width: $mobileViewport) {
	.user-settings {
		@apply self-center;

		display: initial;
		height: 30px;
		padding: 3px 10px;
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
		@apply self-center;
		display: initial;

		height: 30px;
		padding: 3px 10px;
		position: relative;

		.dropdown-container {
			position: absolute;
			top: 56px;
			left: -50%;

				.notification-items {
					@apply flex flex-col justify-between;

					.notification-item {
						@apply grid grid-cols-[repeat(2,max-content)] grid-rows-[repeat(2,max-content)];
						padding: .5em 1em;

						.icon {
							@apply self-center row-span-full  dark:bg-light-800;
							border-radius: 50%;
							height: min-content;
							background-color: gray;

							span {
								font-size: 32px;
							}
						}

						.title {
							@apply col-start-2 row-start-1;
						}
						.date {
							@apply col-start-2 row-start-2;
						}
					}
					.notification-footer {
						text-align: center;
					}
				}
		}
	}
}
</style>

<script setup lang="ts">
import { inject } from "vue"
import RoleSpecificLinks from "@/page_shell/role_specific_links.vue"
import Dropdown from "@/Dropdown.vue"

const isLoggingIn = inject("isLoggingIn") as boolean

const roles = ["guest", "student_or_employee", "user_manager", "admin"]
const role = roles[2]
const isRoleGuest = role === "guest"

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
