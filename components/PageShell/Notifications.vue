<template>
	<div class="notifications">
		<a id="notification-btn" role="button" @click="toggleNotificationList" class="material-icons">
			notifications
		</a>
		<NotificationList v-if="isNotificationListShown">
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
		</NotificationList>
	</div>
</template>

<style scoped lang="scss">
.notifications {
	position: relative;
	height: 30px;
	padding: 3px 10px;
	align-self: center;

	& .dropdown-container {
		left: -100px;
	}
}

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
	border-top: 1px solid gray;
	display: flex;
	justify-content: center;
}
</style>

<script setup lang="ts">
import NotificationList from "@/Dropdown.vue"
import { ref } from "vue"

type Emissions = {
	(e: "toggleNotificationList", isNotificationListShown: boolean ): void
}
const emit = defineEmits<Emissions>()

const notifications = [
	{
		id: 0,
		description: "lorem ipsum",
		type: "general",
		icon: "notifications",
		dateOccured: new Date(2022, 2, 3).toDateString()
	}
]
const isNotificationListShown = ref(false)

function toggleNotificationList() {
	isNotificationListShown.value = !isNotificationListShown.value
	emit("toggleNotificationList", isNotificationListShown.value) // for testing purposes
}
</script>
