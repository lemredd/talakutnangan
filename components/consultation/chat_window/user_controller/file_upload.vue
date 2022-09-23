<template>
	<Overlay :is-shown="isShown">
		<template #header>
		</template>
		<template #default>
			<form @submit.prevent>
				<input
					type="hidden"
					name="data[attributes][data][subkind]"
					value="image"/>
				<input
					type="hidden"
					name="data[attributes][data][name]"
					:value="fileName"/>
				<input
					type="hidden"
					name="data[attributes][kind]"
					value="file"/>
				<label class="btn" for="choose-file-btn">
					<input
						id="choose-file-btn"
						type="file"
						name="meta[fileContents]"
						accept="image/*"/>
					CHOOSE FILE
				</label>
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

#choose-file-btn {
	display:none;
	appearance: none;
}
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
