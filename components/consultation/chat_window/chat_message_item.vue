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
				v-if="isMessageKindText(chatMessage)"
				class="message-item-content"
				:class="messageItemContent">
				{{ chatMessage.data.value }}
			</p>
			<p
				v-if="isMessageKindFile(chatMessage)"
				class="message-item-content"
				:class="messageItemContent">
				<!-- TODO(lead): use appropriate elements for other file types  -->
				<img :src="fileURL"/>
			</p>
			<p
				v-if="isMessageKindStatus(chatMessage)"
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
		@apply flex items-end w-max mb-5;

		&.own-message {
			margin-left: auto;

			.message-item-content {
				@apply mr-2 ml-0;
			}
		}
		&.status-message {
			@apply opacity-50 text-sm;
			margin: 0 auto;
		}

		.message-item-content {
			max-width: 45vw;
			overflow-wrap: break-word;

			&.text-message-content {
				@apply ml-2 py-1 px-2;
				@apply border rounded-lg border-true-gray-600 border-opacity-50;
				@apply dark:border-opacity-100;
			}
		}

		.other, .self {
			@apply rounded-full border border-true-gray-600 border-opacity-50;
			width: 40px;
			height: 40px;
		}
	}
</style>

<script setup lang="ts">
import { computed, inject } from "vue"

import type { PageContext } from "$/types/renderer"
import type { TextMessage, StatusMessage } from "$/types/message"
import type { DeserializedChatMessageResource } from "$/types/documents/chat_message"

import {
	isMessageKindFile,
	isMessageKindStatus,
	isMessageKindText
} from "@/consultation/helpers/chat_message_kinds"

import ProfilePicture from "@/consultation/list/profile_picture_item.vue"

const pageContext = inject("pageContext") as PageContext<"deserialized">
const { pageProps } = pageContext

const { userProfile } = pageProps

const { chatMessage } = defineProps<{
	chatMessage: DeserializedChatMessageResource<"user">
}>()

const isSelfMessage = computed<boolean>(() => {
	const isMessageCameFromSelf = !isMessageKindStatus(chatMessage)
		&& userProfile.data.id === chatMessage.user.data.id

	return isMessageCameFromSelf
})

const isOtherMessage = computed<boolean>(() => {
	const isMessageCameFromOther = !isMessageKindStatus(chatMessage)
		&& userProfile.data.id !== chatMessage.user.data.id

	return isMessageCameFromOther
})

function isMessageKindText(value: DeserializedChatMessageResource<"user">)
: value is DeserializedChatMessageResource<"user"> & TextMessage {
	return value.kind === "text"
}
function isMessageKindFile(value: DeserializedChatMessageResource<"user">)
: value is DeserializedChatMessageResource<"user"> & TextMessage {
	return value.kind === "file"
}

const messageItem = {
	"own-message": isSelfMessage.value,
	"status-message": isMessageKindStatus(chatMessage)
}
const messageItemContent = {
	"file-message-content": isMessageKindFile(chatMessage),
	"status-message-content": isMessageKindStatus(chatMessage),
	"text-message-content": isMessageKindText(chatMessage)
}

const fileURL = computed(() => chatMessage.attachedChatFile?.data.fileContents)
</script>
