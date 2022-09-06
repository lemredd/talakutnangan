<template>
	<Anchor
		id="log-out-btn"
		role="button"
		@click="logOut">
		<span class="material-icons">logout</span>
		<span class="label btn-label">Logout</span>
	</Anchor>
</template>

<script setup lang="ts">
import Anchor from "@/anchor.vue"
import UserFetcher from "$@/fetchers/user"

UserFetcher.initialize("/api")

function logOut() {
	new UserFetcher().logOut()
	.then(() => {
		window.location.assign("/user/log_in")
	})
}
</script>
