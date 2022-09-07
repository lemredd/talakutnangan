<template>
	<Anchor
		id="log-out-btn"
		:href="null"
		role="button"
		@click.prevent="logOut">
		<span class="material-icons">logout</span>
		<span class="label btn-label">Logout</span>
	</Anchor>
</template>

<script setup lang="ts">
import UserFetcher from "$@/fetchers/user"
import assignPath from "$@/external/assign_path"

import Anchor from "@/anchor.vue"

UserFetcher.initialize("/api")

function logOut() {
	new UserFetcher().logOut()
	.then(() => {
		assignPath("/user/log_in")
	})
}
</script>
