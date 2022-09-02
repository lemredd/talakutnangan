<template>
	<a
		id="log-out-btn"
		role="button"
		@click="logOut">
		<span class="material-icons">logout</span>
		<span class="label btn-label">Logout</span>
	</a>
</template>

<style>
</style>

<script setup lang="ts">
import UserFetcher from "$@/fetchers/user"

UserFetcher.initialize("/api")

function logOut() {
	new UserFetcher().logOut()
	.then(() => {
		window.location.assign("/user/log_in")
	})
}
</script>
