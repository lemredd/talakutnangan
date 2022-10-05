<template>
	<div class="navigation">
		<div class="wrapper">
			<a href="/" class="logo">
				<img src="@assets/logo_navbar.svg" alt="logo"/>
				<h1 class="ml-1">TALAKUTNANGAN</h1>
			</a>

			<Dropdown
				v-if="!isUserAGuest"
				:is-dropdown-shown="mustShowNotifications"
				class="notifications"
				@toggle="toggleNotificationsDedicatedly"
				@resize="toggleNotificationsDedicatedly">
				<template #toggler>
					<span class="material-icons">notifications</span>
				</template>
				<template #dropdown-contents>
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
			<CommonNavigationLinks/>
			<Dropdown
				v-if="!isUserAGuest"
				:is-dropdown-shown="mustShowSettings"
				class="user-settings"
				@toggle="toggleSettingsDedicatedly"
				@resize="toggleSettingsDedicatedly">
				<template #toggler>
					<span class="material-icons">account_circle</span>
				</template>
				<template #dropdown-contents>
					<ul class="settings-items">
						<Anchor href="/settings/account">
							<span class="material-icons">settings</span>
							<span class="label anchor-label">Account Settings</span>
						</Anchor>
						<Anchor href="/settings/profile">
							<span class="material-icons">person</span>
							<span class="label anchor-label">Profile Settings</span>
						</Anchor>
						<LogOutBtn/>
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

	margin: 0 auto;
	border-bottom: 1px solid hsla(0,0%,0%, 0.1);
	padding: 0 .75em;

	height: $navHeight;

	.wrapper {
		@apply grid grid-cols-[1fr,repeat(3,min-content)] flex-1;
	}

	.logo {
		@apply flex items-center;

		padding: .25em;

		img {
			width: 48px;
			padding: .5em;
		}
	}
}

.notifications, .user-settings {
	display: none;
}

@media screen and (min-width: $desktopViewportMinimum) {
	.user-settings {
		@apply self-center;

		&.parent-dropdown-container .dropdown-container {
			transform: none;
			left: unset;
			right: 0;
		}
	}

	.notifications {
		@apply self-center;

		.dropdown-container {
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
import { inject, computed } from "vue"

import type { PageContext } from "$/types/renderer"
import type { DeserializedUserProfile } from "$/types/documents/user"

import makeSwitch from "$@/helpers/make_switch"

import Anchor from "@/anchor.vue"
import Dropdown from "@/page_shell/dropdown.vue"
import LogOutBtn from "@/authentication/log_out_btn.vue"
import CommonNavigationLinks from "@/page_shell/navigation_links.vue"

const { pageProps } = inject("pageContext") as PageContext
const userProfile = pageProps.userProfile as DeserializedUserProfile|null

const isUserAGuest = computed(() => userProfile === null)

const {
	"state": mustShowNotifications,
	"toggle": toggleNotifications,
	"off": closeNotifications
} = makeSwitch(false)

const {
	"state": mustShowSettings,
	"toggle": toggleSettings,
	"off": closeSettings
} = makeSwitch(false)

function toggleNotificationsDedicatedly() {
	closeSettings()
	toggleNotifications()
}

function toggleSettingsDedicatedly() {
	closeNotifications()
	toggleSettings()
}

const notifications = [
	{
		"dateOccured": new Date(2022, 2, 3).toDateString(),
		"description": "lorem ipsum",
		"icon": "notifications",
		"id": 0,
		"type": "general"
	}
]
</script>
