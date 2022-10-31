<template>
	<div class="call">
		hello
	</div>
</template>

<style>
</style>

<script setup lang="ts">
import { inject, onMounted } from "vue"

import { PageContext } from "$/types/renderer"

import TokenFetcher from "$@/fetchers/rtc_token"

type AdditionalPageProps = "TOKEN_SERVICE_HOST_NAME"|"chatMessageActivities"|"consultation"
const pageContext = inject("pageContext") as PageContext<"deserialized", AdditionalPageProps>
const { pageProps } = pageContext
const { consultation, chatMessageActivities, userProfile, TOKEN_SERVICE_HOST_NAME } = pageProps

const tokenFetcher = new TokenFetcher()

onMounted(() => {
	const channelName = `consultation-ticket-${consultation.data.id}`
	const uid = userProfile.data.id

	tokenFetcher.generateToken(TOKEN_SERVICE_HOST_NAME as string, channelName, uid)
	.then(console.log)
})
</script>
