<template>
	<div class="notifications" >
		<a role="button" @click="toggleNotificationList">
			<span class="material-icons">notifications</span>
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
					<li class="notification-footer">
						<!-- using anchor tag mismatches on server -->
						<button role="link">View All</button>
					</li>
				</a>
			</ul>
		</NotificationList>
	</div>
</template>

<style scoped lang="scss">
.notifications {
	position: relative;

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
}
</script>
