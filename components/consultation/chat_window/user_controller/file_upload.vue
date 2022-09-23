<template>
	<Overlay :is-shown="isShown">
		<template #header>

		</template>
		<template #default>
			<form>
				<input type="file" name=""/>
			</form>
		</template>
		<template #footer>
			<button
				class="btn btn-back"
				type="button"
				@click="emitClose">
				Back
			</button>
			<button class="btn btn-primary" type="button">
				Send
			</button>
		</template>
	</Overlay>
</template>

<style lang="css">
@import "@styles/btn.scss";
</style>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue"

import Fetcher from "$@/fetchers/chat_message"
import Overlay from "@/helpers/overlay.vue"

let rawFetcher: Fetcher|null = null

const props = defineProps<{ isShown: boolean }>()

function fetcher(): Fetcher {
	if (rawFetcher === null) throw new Error("Chat cannot be processed yet")

	return rawFetcher
}

onMounted(() => {
	rawFetcher = new Fetcher()
})
</script>
