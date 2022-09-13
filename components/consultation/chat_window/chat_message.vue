<template>
	<div class="message-item">
		<div :class="messageAlignment">
			<h6 class="message-item-name">
				{{ chatMessage.user.data.name }}
			</h6>
			<p
				v-if="isTextMessage(chatMessage) || isStatusMessage(chatMessage)"
				class="message-item-content">
				{{ chatMessage.data.value }}
			</p>
		</div>
	</div>
</template>

<style scoped lang="scss">
.message-item {
	@apply flex
}

.place-left {
	@apply flex-1 mr-auto
}

.place-right {
	@apply flex-1 ml-auto
}

.place-center {
	@apply flex-1 mx-auto
}
</style>

<script setup lang="ts">
import { computed, inject } from "vue"

import type { PageContext } from "$/types/renderer"
import type { TextMessage, StatusMessage } from "$/types/message"
import type { DeserializedChatMessageResource } from "$/types/documents/chat_message"

const pageContext = inject("pageContext") as PageContext<"deserialized">
const { pageProps } = pageContext

const { userProfile } = pageProps

const { chatMessage } = defineProps<{
	chatMessage: DeserializedChatMessageResource<"user">
}>()

type Alignment = "place-left"|"place-center"|"place-right"

function isStatusMessage(value: DeserializedChatMessageResource<"user">)
: value is DeserializedChatMessageResource<"user"> & StatusMessage {
	return value.kind === "status"
}

const messageAlignment = computed<Alignment>(() => {
	if (isStatusMessage(chatMessage)) {
		return "place-center"
	} else if (userProfile.data.id === chatMessage.user.data.id) {
		return "place-right"
	}

	return "place-left"
})

function isTextMessage(value: DeserializedChatMessageResource<"user">)
: value is DeserializedChatMessageResource<"user"> & TextMessage {
	return value.kind === "text"
}

</script>
