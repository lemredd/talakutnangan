<template>
	<div
		class="message-item"
		:class="messageItem">
		<ProfilePicture
			v-if="isOtherMessage"
			class="other"
			:user="chatMessage.user"
			:title="chatMessage.user.data.name"/>
		<div>
			<p
				v-if="isTextMessage(chatMessage)"
				class="message-item-content"
				:class="messageItemContent">
				{{ chatMessage.data.value }}
			</p>
			<p
				v-if="isStatusMessage(chatMessage)"
				class="message-item-content"
				:class="messageItemContent">
				{{ chatMessage.user.data.name }} {{ chatMessage.data.value }}
			</p>
		</div>
		<ProfilePicture
			v-if="isSelfMessage"
			class="self"
			:user="chatMessage.user"
			:title="chatMessage.user.data.name"/>
	</div>
</template>

<style scoped lang="scss">
	.message-item {
		@apply flex items-center w-max;

		&.own-message {
			margin-left: auto;

			.text-message-content {
				@apply mr-2 ml-0;
			}
		}
		&.status-message {
			@apply opacity-50 text-sm;
			margin: 0 auto;
		}

		.text-message-content {
			@apply ml-2 py-1 px-2;
			@apply border rounded-lg border-true-gray-600 border-opacity-50;
			@apply dark:border-opacity-100
		}

		.other, .self {
			@apply rounded-full border border-true-gray-600 border-opacity-50;
			width: 50px;
			height: 50px;
		}
	}
</style>

<script setup lang="ts">
import { computed, inject } from "vue"

import type { PageContext } from "$/types/renderer"
import type { TextMessage, StatusMessage } from "$/types/message"
import type { DeserializedChatMessageResource } from "$/types/documents/chat_message"

import ProfilePicture from "@/consultation/list/profile_picture_item.vue"

const pageContext = inject("pageContext") as PageContext<"deserialized">
const { pageProps } = pageContext

const { userProfile } = pageProps

const { chatMessage } = defineProps<{
	chatMessage: DeserializedChatMessageResource<"user">
}>()

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

function isTextMessage(value: DeserializedChatMessageResource<"user">)
: value is DeserializedChatMessageResource<"user"> & TextMessage {
	return value.kind === "text"
}

const messageItem = {
	"own-message": isSelfMessage.value,
	"status-message": isStatusMessage(chatMessage)
}
const messageItemContent = {
	"text-message-content": isTextMessage(chatMessage)
}
</script>
