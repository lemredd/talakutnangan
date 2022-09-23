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
					:value="filename"/>
				<input
					type="hidden"
					name="data[attributes][kind]"
					value="file"/>
				<label class="btn" for="choose-file-btn">
					<input
						id="choose-file-btn"
						type="file"
						name="meta[fileContents]"
						accept="image/png"
						@change="extractFilename"/>
					CHOOSE FILE
				</label>
				<button v-if="hasExtracted" type="button">
					Send file
				</button>
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

const filename = ref<string|null>(null)
const hasExtracted = computed<boolean>(() => filename.value !== null)

interface CustomEvents {
	(event: "close"): void
}
const emit = defineEmits<CustomEvents>()
function emitClose() {
	emit("close")
}

function fetcher(): Fetcher {
	if (rawFetcher === null) throw new Error("Chat cannot be processed yet")

	return rawFetcher
}

function extractFilename(event: Event) {
	const target = event.target as HTMLInputElement
	const rawFilename = target.files?.item(0)?.name as ""
	filename.value = rawFilename
}

onMounted(() => {
	rawFetcher = new Fetcher()
})
</script>
