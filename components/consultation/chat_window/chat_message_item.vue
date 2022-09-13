<template>
	<div class="message-item">
		<ProfilePicture
			v-if="isOtherMessage"
			class="flex-1"
			:user="chatMessage.user"/>
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
		<ProfilePicture
			v-if="isSelfMessage"
			class="flex-1"
			:user="chatMessage.user"/>
	</div>
</template>

<style scoped lang="scss">
.message-item {
	@apply flex
}

.align-left {
	@apply flex-1 mr-auto
}

.align-right {
	@apply flex-1 ml-auto
}

.align-center {
	@apply flex-1 mx-auto
}
</style>

<script setup lang="ts">
import { computed, inject } from "vue"

import type { PageContext } from "$/types/renderer"
import type { TextMessage, StatusMessage } from "$/types/message"
import type { DeserializedChatMessageResource } from "$/types/documents/chat_message"

import ProfilePicture from "@/helpers/profile_picture.vue"

const pageContext = inject("pageContext") as PageContext<"deserialized">
const { pageProps } = pageContext

const { userProfile } = pageProps

const { chatMessage } = defineProps<{
	chatMessage: DeserializedChatMessageResource<"user">
}>()

type Alignment = "align-left"|"align-center"|"align-right"

function isStatusMessage(value: DeserializedChatMessageResource<"user">)
: value is DeserializedChatMessageResource<"user"> & StatusMessage {
	return value.kind === "status"
}

const isSelfMessage = computed<boolean>(() => {
	const isMessageCameFromSelf = !isStatusMessage(chatMessage)
		&& userProfile.data.id === chatMessage.user.data.id

	return isMessageCameFromSelf
})

const isOtherMessage = computed<boolean>(() => {
	const isMessageCameFromOther = !isStatusMessage(chatMessage)
		&& userProfile.data.id !== chatMessage.user.data.id

	return isMessageCameFromOther
})

const messageAlignment = computed<Alignment>(() => {
	if (isStatusMessage(chatMessage)) {
		return "align-center"
	} else if (isSelfMessage.value) {
		return "align-right"
	}

	return "align-left"
})

function isTextMessage(value: DeserializedChatMessageResource<"user">)
: value is DeserializedChatMessageResource<"user"> & TextMessage {
	return value.kind === "text"
}

</script>
